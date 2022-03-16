import { ChangeEvent, Component, KeyboardEvent, LegacyRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';

import Task from './../models/Task';

export type TaskRowProps = {
  task: Task;
  spellCheckEnabled: boolean;
  handleCheckboxChange: (task: Task) => void;
  handleTextChange: (task: Task, text: string) => void;
  handleDeleteTask: (task: Task) => void;
  innerRef: LegacyRef<HTMLDivElement>;
};

type TaskRowState = {
  task: Task;
  isChecked: boolean;
};

class TaskRow extends Component<TaskRowProps, TaskRowState> {
  private textAreaElement: HTMLTextAreaElement | null = null;

  constructor(props: TaskRowProps) {
    super(props);

    this.state = {
      task: props.task,
      isChecked: props.task.completed,
    };
  }

  componentDidMount() {
    this.resizeTextArea(this.textAreaElement);
  }

  UNSAFE_componentWillReceiveProps(newProps: TaskRowProps) {
    this.setState({
      task: newProps.task,
      isChecked: newProps.task.completed,
    });

    // Wait till after render
    setTimeout(() => {
      this.resizeTextArea(this.textAreaElement);
    }, 1);
  }

  toggleCheckboxChange = () => {
    const { handleCheckboxChange } = this.props;

    this.setState(({ isChecked }) => ({
      isChecked: !isChecked,
    }));

    handleCheckboxChange(this.props.task);
  };

  onTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    this.props.task.description = text;
    this.props.handleTextChange(this.props.task, text);

    this.forceUpdate();
  };

  onKeyUp = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // Delete task if empty and enter pressed
    if (event.key === 'Enter') {
      if (this.props.task.isEmpty()) {
        this.props.handleDeleteTask(this.props.task);
        event.preventDefault();
      }
    }

    const element = event.target as HTMLTextAreaElement;
    this.resizeTextArea(element);
  };

  onKeyPress(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter') {
      /**
       * We want to disable any action on enter, since newlines are reserved
       * and are how tasks are delimitted.
       */
      event.preventDefault();
    }
  }

  resizeTextArea(textarea: HTMLTextAreaElement | null): void {
    if (!textarea) {
      return;
    }

    /**
     * Set to 1px first to reset scroll height in case it shrunk.
     */
    textarea.style.height = '1px';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  render() {
    const { isChecked } = this.state;
    const {
      task,
      spellCheckEnabled,
      innerRef,
      handleCheckboxChange,
      handleTextChange,
      handleDeleteTask,
      ...rest
    } = this.props;

    return (
      <div
        className={`task ${task.completed ? 'completed' : ''}`}
        ref={innerRef}
        {...rest}
      >
        <span className="drag-grip-container">
          <FontAwesomeIcon icon={faGripVertical} style={{}} />
        </span>
        <label className="checkbox-container">
          <input
            checked={isChecked}
            className="checkbox"
            onChange={this.toggleCheckboxChange}
            spellCheck={spellCheckEnabled}
            type="checkbox"
          />
          <span className="checkmark" />
        </label>
        <textarea
          className="task-input-textarea"
          dir="auto"
          onChange={this.onTextChange}
          onKeyPress={this.onKeyPress}
          onKeyUp={this.onKeyUp}
          ref={(textarea) => (this.textAreaElement = textarea)}
          spellCheck={spellCheckEnabled}
          value={task.description}
        />
      </div>
    );
  }
}

export default TaskRow;
