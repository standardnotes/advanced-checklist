import './stylesheets/main.scss';

import React, { useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import EditorKit, { EditorKitDelegate } from '@standardnotes/editor-kit';

import CreateGroup from './components/CreateGroup';
import TaskGroup from './components/TaskGroup';
import { store } from './app/store';
import { useAppDispatch, useAppSelector } from './app/hooks';
import {
  setCanEdit,
  setIsRunningOnMobile,
  setShowTutorial,
  setSpellCheckerEnabled,
} from './features/settings/settings-slice';
import { tasksLoaded } from './features/tasks/tasks-slice';

const TaskEditor: React.FC = () => {
  const note = useRef<any>();
  const editorKit = useRef<EditorKit>();

  const initialized = useAppSelector((state) => state.tasks.initialized);
  const groupedTasks = useAppSelector((state) => state.tasks.storage);
  const canEdit = useAppSelector((state) => state.settings.canEdit);

  const dispatch = useAppDispatch();

  function showTutorial(): boolean {
    return true;
    // return (
    //   editorKit.current!.getComponentDataValueForKey('showTutorial') === undefined
    // );
  }

  function isRunningOnMobile(): boolean {
    return false;
    // return editorKit.current!.isRunningInMobileApplication();
  }

  const configureEditorKit = useCallback(() => {
    const editorKitDelegate: EditorKitDelegate = {
      setEditorRawText: (rawString: string) => {
        dispatch(tasksLoaded(rawString));
      },
      onNoteValueChange: async (currentNote: any) => {
        note.current = currentNote;

        const editable =
          !currentNote.content.appData['org.standardnotes.sn'].locked ?? true;
        const spellCheckEnabled = currentNote.content.spellcheck;

        dispatch(setCanEdit(editable));
        dispatch(setSpellCheckerEnabled(spellCheckEnabled));
        dispatch(setIsRunningOnMobile(isRunningOnMobile()));
        dispatch(setShowTutorial(showTutorial()));
      },
      onNoteLockToggle: (locked: boolean) => {
        dispatch(setCanEdit(!locked));
      },
    };

    editorKit.current = new EditorKit(editorKitDelegate, {
      mode: 'json',
      supportsFileSafe: false,
    });
  }, [dispatch]);

  useEffect(() => {
    configureEditorKit();
  }, [configureEditorKit]);

  const saveNote = useCallback(() => {
    const currentNote = note.current;
    if (!currentNote || !initialized) {
      return;
    }

    editorKit.current!.saveItemWithPresave(currentNote, () => {
      currentNote.content.text = JSON.stringify(groupedTasks);
      currentNote.content.preview_html = '<span>WIP</span>';
      currentNote.content.preview_plain = 'WIP';
    });

    if (showTutorial()) {
      // editorKit.current!.setComponentDataValueForKey('showTutorial', false);
    }
  }, [initialized, groupedTasks]);

  useEffect(() => saveNote);

  return (
    <>
      {Object.keys(groupedTasks).map((group, index, { length }) => {
        const tasks = groupedTasks[group];
        return (
          <TaskGroup
            key={index}
            group={group}
            tasks={tasks}
            isLast={index + 1 === length}
          />
        );
      })}

      {canEdit && <CreateGroup />}
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <TaskEditor />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
