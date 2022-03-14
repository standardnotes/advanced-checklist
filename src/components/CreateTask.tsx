import { ChangeEvent, Component, KeyboardEvent } from 'react';

type Props = {
  taskDraft: string;
  isMobile: boolean;
  showTutorial: boolean;
  spellCheckEnabled: boolean;
  onUpdate: (string: string, save: boolean) => void;
  onSubmit: (string: string) => void;
};

type State = {
  taskDraft: string;
};

class CreateTask extends Component<Props, State> {
  private inputElement: HTMLInputElement | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      taskDraft: props.taskDraft,
    };
  }

  shouldComponentUpdate({ taskDraft }: Props) {
    return taskDraft !== this.state.taskDraft;
  }

  componentDidUpdate({ taskDraft }: Props) {
    this.setState({
      taskDraft,
    });
  }

  componentDidMount() {
    const { isMobile } = this.props;
    if (isMobile) {
      this.inputElement!.focus();
    }
  }

  private onTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    /**
     * Save this as the current 'un-saved' task if while we're not
     * officially saving it as an actual task yet.
     */
    const rawString = event.target.value;
    this.props.onUpdate(rawString, true);
  };

  private handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const rawString = (event.target as HTMLInputElement).value;
      this.submitTask(rawString);
    }
  };

  private submitTask(value: string) {
    this.props.onSubmit(value);
  }

  render() {
    const { showTutorial, spellCheckEnabled, taskDraft } = this.props;

    return (
      <input
        className="create-task-input"
        dir="auto"
        onChange={this.onTextChange}
        onKeyPress={this.handleKeyPress}
        placeholder={showTutorial ? 'Type in your task, then press Enter.' : ''}
        ref={(ref) => (this.inputElement = ref)}
        spellCheck={spellCheckEnabled}
        type="text"
        value={taskDraft}
      />
    );
  }
}

export default CreateTask;
