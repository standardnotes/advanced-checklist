import './stylesheets/main.scss';

import React, { useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import CreateGroup from './features/tasks/CreateGroup';
import TaskGroup from './features/tasks/TaskGroup';

import { useAppDispatch, useAppSelector } from './app/hooks';
import {
  setCanEdit,
  setIsMobile,
  setShowTutorial,
  setSpellCheckerEnabled,
} from './features/settings/settings-slice';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { tasksLoaded } from './features/tasks/tasks-slice';
import EditorKit, { EditorKitDelegate } from '@standardnotes/editor-kit';

const TaskEditor: React.FC = () => {
  const currentNote = useRef<any>();
  const editorKit = useRef<EditorKit>();

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

  const saveNote = useCallback(() => {
    const note = currentNote.current;
    if (!note) {
      return;
    }

    editorKit.current!.saveItemWithPresave(note, () => {
      const groupedTasks = store.getState().tasks.storage;
      note.content.text = JSON.stringify(groupedTasks);
      note.content.preview_html = '<span>WIP</span>';
      note.content.preview_plain = 'WIP';
    });

    if (showTutorial()) {
      // editorKit.current!.setComponentDataValueForKey('showTutorial', false);
    }
  }, []);

  const configureEditorKit = useCallback(() => {
    const editorKitDelegate: EditorKitDelegate = {
      setEditorRawText: (rawString: string) => {
        dispatch(tasksLoaded(rawString));
      },
      onNoteValueChange: async (note: any) => {
        currentNote.current = note;

        const editable =
          !note.content.appData['org.standardnotes.sn'].locked ?? true;
        const spellCheckEnabled = note.content.spellcheck;

        dispatch(setCanEdit(editable));
        dispatch(setSpellCheckerEnabled(spellCheckEnabled));
        dispatch(setIsMobile(isRunningOnMobile()));
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

  useEffect(() => {
    return store.subscribe(saveNote);
  }, [saveNote]);

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
