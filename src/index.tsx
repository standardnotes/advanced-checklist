import './stylesheets/main.scss';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import TaskRow from './components/TaskRow';
import CreateTask from './components/CreateTask';

import Task from './models/Task';
import TaskList from './models/TaskList';

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
  private taskList?: TaskList;
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
        this.taskList = new TaskList(rawString);
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
      mode: 'plaintext',
      supportsFileSafe: false,
    });
  }

  updateTasks() {
    const { openTasks, completedTasks } = this.taskList!.splitTasks();

    this.setState({
      openTasks,
      completedTasks,
    });
  }

  deleteTask(task: Task) {
    this.taskList!.deleteTask(task);
    this.updateTasks();
    this.save();
  }

  toggleTaskStatus = (task: Task) => {
    task.toggleStatus();

    if (!task.completed) {
      this.taskList!.moveTaskToTop(task);
    }

    setTimeout(() => {
      // Allow UI to show checkmark before transferring to other list.
      this.updateTasks();
      this.save();
    }, 300);
  };

  private createTask = (rawString: string) => {
    const task = this.taskList!.createTask(rawString);
    this.taskList!.addTask(task);
    this.updateTaskDraft('');
    this.updateTasks();
    this.save();
  };

  private updateTaskDraft = (rawString: string, save: boolean = false) => {
    this.setState({
      taskDraft: rawString,
    });
    save && this.save();
  };

  private onReOpenCompleted = () => {
    if (window.confirm('Are you sure you want to reopen completed tasks?')) {
      this.taskList!.reOpenCompleted();
      this.updateTasks();
      this.save();
    }
  };

  private onDeleteCompleted = () => {
    if (window.confirm('Are you sure you want to delete completed tasks?')) {
      this.taskList!.deleteCompleted();
      this.updateTasks();
      this.save();
    }
  };

  private taskRowForTask(task: Task, index: number) {
    const { spellCheckEnabled } = this.state;
    return (
      <TaskRow
        deleteTask={this.deleteTask}
        handleCheckboxChange={this.toggleTaskStatus}
        handleTextChange={() => this.save()}
        key={`${index}-${task.rawString}`}
        spellCheckEnabled={spellCheckEnabled}
        task={task}
      />
    );
  }

  private save() {
    const note = this.note;

    this.editorKit!.saveItemWithPresave(note, () => {
      note.content.text = this.taskList!.getDataString();
      note.content.taskDraft = this.state.taskDraft;
      note.content.preview_html = this.taskList!.buildHtmlPreview();
      note.content.preview_plain = this.taskList!.buildPlainPreview();
    });

    if (this.showTutorial) {
      this.editorKit!.setComponentDataValueForKey('showTutorial', false);
    }
  }

  render() {
    const { spellCheckEnabled, openTasks, completedTasks, taskDraft } =
      this.state;

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

        <div className="task-section">
          <h3>Open Tasks</h3>
          <div id="completed-tasks">
            {openTasks.map((task, index) => {
              return this.taskRowForTask(task, index);
            })}
          </div>
        </div>

        <div className="task-section">
          <h3>Completed Tasks</h3>
          <div id="completed-tasks">
            {completedTasks.map((task, index) => {
              return this.taskRowForTask(task, index);
            })}
          </div>

          {completedTasks.length > 0 && (
            <div>
              <button className="clear-button" onClick={this.onReOpenCompleted}>
                Reopen Completed
              </button>
              <button className="clear-button" onClick={this.onDeleteCompleted}>
                Delete Completed
              </button>
            </div>
          )}
        </div>
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
