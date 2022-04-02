import './stylesheets/main.scss';

import React, { useEffect } from 'react';
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
import mockData from './mockData';

const TaskEditor: React.FC = () => {
  const groupedTasks = useAppSelector((state) => state.tasks.storage);
  const canEdit = useAppSelector((state) => state.settings.canEdit);

  const dispatch = useAppDispatch();

  function configureEditorKit() {
    dispatch(setCanEdit(true));
    dispatch(setSpellCheckerEnabled(true));
    dispatch(setIsMobile(false));
    dispatch(setShowTutorial(true));
  }

  useEffect(() => {
    configureEditorKit();
  });

  useEffect(() => {
    const serialized = JSON.stringify(mockData);
    dispatch(tasksLoaded(serialized));
  }, [dispatch]);

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
