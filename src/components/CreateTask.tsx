import React, { ChangeEvent, Component, KeyboardEvent } from 'react';

type Props = {
  unSavedTask: string;
  isMobile: boolean;
  showTutorial: boolean;
  spellCheckEnabled: boolean;
  onUpdate: (string: string) => void;
  onSubmit: (string: string) => void;
};

type State = {
  rawString: string;
};

export default class CreateTask extends Component<Props, State> {
  private inputElement: HTMLInputElement | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      rawString: props.unSavedTask,
    };
  }

  shouldComponentUpdate({ unSavedTask }: Props) {
    return unSavedTask !== this.state.rawString;
  }

  componentDidUpdate({ unSavedTask }: Props) {
    this.setState({
      rawString: unSavedTask,
    });
  }

  componentDidMount() {
    const { isMobile } = this.props;
    if (isMobile) {
      this.inputElement!.focus();
    }
  }

  private onTextChange(event: ChangeEvent<HTMLInputElement>) {
    /**
     * Save this as the current 'unsaved' task if while we're not
     * officially saving it as an actual task yet.
     */
    const rawString = event.target.value;
    this.props.onUpdate(rawString);
  }

  private handleKeyPress(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      const rawString = (event.target as HTMLInputElement).value;
      this.submitTask(rawString);
    }
  }

  private submitTask(value: string) {
    this.props.onSubmit(value);
  }

  render() {
    const { showTutorial, spellCheckEnabled, unSavedTask } = this.props;

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
        value={unSavedTask}
      />
    );
  }
}
