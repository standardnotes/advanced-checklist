import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import EditorKit, { EditorKitDelegate } from '@standardnotes/editor-kit';

import './stylesheets/main.scss';

type Props = {};
type State = {
  editable: boolean;
  spellcheck: boolean;
  isLoading: boolean;
};

class TaskEditor extends Component<Props, State> {
  private editorKit?: EditorKit;
  private prevText: string = '';

  constructor(props: Props) {
    super(props);

    this.state = {
      editable: true,
      spellcheck: true,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.configureEditorKit();
  }

  private configureEditorKit() {
    const editorKitDelegate: EditorKitDelegate = {
      setEditorRawText: (text: string) => {
        this.prevText = text.trim();

        this.setState({
          isLoading: false,
        });
      },
      generateCustomPreview: (text: string) => {
        return {
          plain: text,
        };
      },
      onNoteValueChange: async (note: any) => {
        const editable =
          !note.content.appData['org.standardnotes.sn'].locked ?? true;
        const spellcheck = note.content.spellcheck;

        this.setState({
          editable,
          spellcheck,
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

  private onTextChange(text: string) {
    if (this.prevText === text.trim()) {
      return;
    }

    this.prevText = text.trim();
    this.editorKit!.onEditorValueChanged(text);
  }

  render() {
    const { isLoading } = this.state;

    if (isLoading) {
      return null;
    }

    return <></>;
  }
}

ReactDOM.render(
  <React.StrictMode>
    <TaskEditor />
  </React.StrictMode>,
  document.getElementById('root')
);
