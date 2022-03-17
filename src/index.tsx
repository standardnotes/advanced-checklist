import './stylesheets/main.scss';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import CreateTask from './components/CreateTask';
import TasksContainer from './components/TasksContainer';

import Task from './models/Task';
import TaskManager from './models/TaskManager';

import EditorKit, { EditorKitDelegate } from '@standardnotes/editor-kit';

type Props = {};
type State = {
  editable: boolean;
  spellCheckEnabled: boolean;
  taskDraft: string;
  openTasks: Task[];
  completedTasks: Task[];
};

class TaskEditor extends Component<Props, State> {
  private editorKit?: EditorKit;
  private taskManager?: TaskManager;
  private note?: any;

  constructor(props: Props) {
    super(props);

    this.state = {
      editable: true,
      spellCheckEnabled: true,
      taskDraft: '',
      openTasks: [],
      completedTasks: [],
    };
  }

  componentDidMount() {
    this.configureEditorKit();
  }

  get ready(): boolean {
    return !!this.editorKit;
  }

  get showTutorial(): boolean {
    return (
      this.editorKit!.getComponentDataValueForKey('showTutorial') === undefined
    );
  }

  get isRunningOnMobile(): boolean {
    return this.editorKit!.isRunningInMobileApplication();
  }

  private configureEditorKit() {
    const editorKitDelegate: EditorKitDelegate = {
      setEditorRawText: (rawString: string) => {
        this.taskManager = new TaskManager(rawString);
        this.updateTasks();
      },
      onNoteValueChange: async (note: any) => {
        this.note = note;

        const editable =
          !note.content.appData['org.standardnotes.sn'].locked ?? true;
        const spellCheckEnabled = note.content.spellcheck;

        this.setState({
          editable,
          spellCheckEnabled,
          taskDraft: note.content.taskDraft,
        });
      },
      onNoteLockToggle: (locked: boolean) => {
        const editable = !locked;

        this.setState({
          editable,
        });
      },
    };

    this.editorKit = new EditorKit(editorKitDelegate, {
      mode: 'json',
      supportsFileSafe: false,
    });
  }

  updateTasks() {
    const { openTasks, completedTasks } = this.taskManager!.splitTasks();

    this.setState({
      openTasks,
      completedTasks,
    });
  }

  deleteTask = (task: Task) => {
    this.taskManager!.deleteTask(task);
    this.updateTasks();
    this.save();
  };

  toggleTaskStatus = (task: Task) => {
    task.toggleStatus();

    if (!task.completed) {
      this.taskManager!.moveTaskToTop(task);
    }

    setTimeout(() => {
      // Allow UI to show checkmark before transferring to other list.
      this.updateTasks();
      this.save();
    }, 300);
  };

  createTask = (description: string) => {
    if (description.length === 0) {
      return;
    }

    const task = this.taskManager!.createTask({ description });
    this.taskManager!.addTask(task);
    this.updateTaskDraft('');
    this.updateTasks();
    this.save();
  };

  updateTaskDraft = (rawString: string, save: boolean = false) => {
    this.setState({
      taskDraft: rawString,
    });
    save && this.save();
  };

  onReOpenCompleted = () => {
    if (window.confirm('Are you sure you want to reopen completed tasks?')) {
      this.taskManager!.reOpenCompleted();
      this.updateTasks();
      this.save();
    }
  };

  onDeleteCompleted = () => {
    if (window.confirm('Are you sure you want to delete completed tasks?')) {
      this.taskManager!.deleteCompleted();
      this.updateTasks();
      this.save();
    }
  };

  reOrderTasks = (containerId: string, source: number, destination: number) => {
    const isSourceOpen = containerId === 'open-tasks';
    const isDestinationCompleted = containerId === 'completed-tasks';
    const isDestinationOpen = !isDestinationCompleted;

    const fromTask = this.taskManager!.taskAtIndex(isSourceOpen, source);
    const toTask = this.taskManager!.taskAtIndex(
      isDestinationOpen,
      destination
    );

    this.taskManager!.changeTaskPosition(fromTask, toTask);
    if (isDestinationCompleted) {
      fromTask.markCompleted();
    } else {
      fromTask.markOpen();
    }

    this.updateTasks();
    this.save();
  };

  save = () => {
    const note = this.note;

    this.editorKit!.saveItemWithPresave(note, () => {
      note.content.text = this.taskManager!.getStoreAsString();
      note.content.taskDraft = this.state.taskDraft;
      note.content.preview_html = this.taskManager!.buildHtmlPreview();
      note.content.preview_plain = this.taskManager!.buildPlainPreview();
    });

    if (this.showTutorial) {
      this.editorKit!.setComponentDataValueForKey('showTutorial', false);
    }
  };

  render() {
    const {
      editable,
      spellCheckEnabled,
      openTasks,
      completedTasks,
      taskDraft,
    } = this.state;

    return (
      <>
        {this.ready && (
          <div className="task-input">
            <CreateTask
              isMobile={this.isRunningOnMobile}
              onSubmit={this.createTask}
              onUpdate={this.updateTaskDraft}
              showTutorial={this.showTutorial}
              spellCheckEnabled={spellCheckEnabled}
              taskDraft={taskDraft}
            />
          </div>
        )}

        <TasksContainer
          id="open-tasks"
          description={'Open Tasks'}
          tasks={openTasks}
          canEdit={editable}
          handleCheckboxChange={this.toggleTaskStatus}
          handleDeleteTask={this.deleteTask}
          handleTasksReOrder={this.reOrderTasks}
          handleTextChange={this.save}
          spellCheckEnabled={spellCheckEnabled}
        />

        <TasksContainer
          id="completed-tasks"
          description={'Completed Tasks'}
          tasks={completedTasks}
          canEdit={editable}
          handleCheckboxChange={this.toggleTaskStatus}
          handleDeleteTask={this.deleteTask}
          handleTasksReOrder={this.reOrderTasks}
          handleTextChange={this.save}
          spellCheckEnabled={spellCheckEnabled}
        >
          {completedTasks.length > 0 && (
            <div>
              <button className="link-button" onClick={this.onReOpenCompleted}>
                Reopen Completed
              </button>
              <button className="link-button" onClick={this.onDeleteCompleted}>
                Delete Completed
              </button>
            </div>
          )}
        </TasksContainer>
      </>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <TaskEditor />
  </React.StrictMode>,
  document.getElementById('root')
);
