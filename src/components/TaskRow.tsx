import { ChangeEvent, Component, KeyboardEvent } from 'react';
import Task from '../models/Task';

type Props = {
  task: Task;
  spellCheckEnabled: boolean;
  handleCheckboxChange: (task: Task) => void;
  handleTextChange: (task: Task, text: string) => void;
  deleteTask: (task: Task) => void;
};

type State = {
  task: Task;
  isChecked: boolean;
};

class TaskRow extends Component<Props, State> {
  private textAreaElement: HTMLTextAreaElement | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      task: props.task,
      isChecked: props.task.completed,
    };
  }

  componentDidMount() {
    this.resizeTextArea(this.textAreaElement);
  }

  UNSAFE_componentWillReceiveProps(newProps: Props) {
    this.setState({
      task: newProps.task,
      isChecked: newProps.task.completed,
    });

    // Wait till after render
    setTimeout(() => {
      this.resizeTextArea(this.textAreaElement);
    }, 1);
  }

  private toggleCheckboxChange = () => {
    const { handleCheckboxChange } = this.props;

    this.setState(({ isChecked }) => ({
      isChecked: !isChecked,
    }));

    handleCheckboxChange(this.props.task);
  };

  private onTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    this.props.task.setContentString(text);
    this.props.handleTextChange(this.props.task, text);

    this.forceUpdate();
  };

  private onKeyUp = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // Delete task if empty and enter pressed
    if (event.key === 'Enter') {
      if (this.props.task.isEmpty()) {
        this.props.deleteTask(this.props.task);
        event.preventDefault();
      }
    }

    const element = event.target as HTMLTextAreaElement;
    this.resizeTextArea(element);
  };

  private onKeyPress(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter') {
      /**
       * We want to disable any action on enter, since newlines are reserved
       * and are how tasks are delimitted.
       */
      event.preventDefault();
    }
  }

  private resizeTextArea(textarea: HTMLTextAreaElement | null): void {
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
    const { task, spellCheckEnabled } = this.props;

    return (
      <div className={`task ${task.completed ? 'completed' : ''}`}>
        <label className="checkbox-container">
          <input
            checked={isChecked}
            className="checkbox"
            onChange={this.toggleCheckboxChange}
            spellCheck={spellCheckEnabled}
            type="checkbox"
            value={task.content}
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
          value={task.content}
        />
      </div>
    );
  }
}

export default TaskRow;
