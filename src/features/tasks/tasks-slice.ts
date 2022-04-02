import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { arrayMoveImmutable } from '../../common/utils';

export type TasksState = {
  storage: GroupedTaskPayload;
};

const initialState: TasksState = {
  storage: {},
};

export type TaskPayload = {
  id: string;
  description: string;
  completed?: boolean;
};

export type GroupedTaskPayload = {
  [group: string]: TaskPayload[];
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    taskAdded(
      state,
      action: PayloadAction<{ task: TaskPayload; group: string }>
    ) {
      const { group, task } = action.payload;

      if (!state.storage[group]) {
        state.storage[group] = [];
      }

      state.storage[group].push({
        ...task,
        completed: false,
      });
    },
    taskModified(
      state,
      action: PayloadAction<{ task: TaskPayload; group: string }>
    ) {
      const { task, group } = action.payload;
      const tasks = state.storage[group].map((original) => {
        if (task.id === original.id) {
          delete task.completed;
          return {
            ...original,
            ...task,
          };
        }
        return original;
      });
      state.storage[group] = tasks;
    },
    taskDeleted(state, action: PayloadAction<{ id: string; group: string }>) {
      const { id, group } = action.payload;
      const tasks = state.storage[group].filter((task) => task.id !== id);
      state.storage[group] = tasks;
    },
    taskToggled(state, action: PayloadAction<{ id: string; group: string }>) {
      const { id, group } = action.payload;
      const task = state.storage[group].find((task) => task.id === id);
      task && (task.completed = !task.completed);
    },
    reOpenAllCompleted(state, action: PayloadAction<{ group: string }>) {
      const { group } = action.payload;
      Object.values(state.storage[group]).forEach(
        (task) => (task.completed = false)
      );
    },
    deleteAllCompleted(state, action: PayloadAction<{ group: string }>) {
      const { group } = action.payload;
      const tasks = state.storage[group].filter(
        (task) => task.completed === false
      );
      state.storage[group] = tasks;
    },
    tasksLoaded(state, action: PayloadAction<string>) {
      if (!action.payload) {
        return;
      }

      try {
        const newState: TasksState = {
          storage: {},
        };
        const tasksPayloads = JSON.parse(action.payload) as GroupedTaskPayload;

        Object.keys(tasksPayloads).forEach((group) => {
          newState.storage[group] = [];
          Object.values(tasksPayloads[group]).forEach((task) => {
            newState.storage[group].push(task);
          });
        });

        newState !== initialState && (state.storage = newState.storage);
      } catch (e) {
        return;
      }
    },
    tasksGroupAdded(state, action: PayloadAction<string>) {
      if (!state.storage[action.payload]) {
        state.storage[action.payload] = [];
      }
    },
    tasksReordered(
      state,
      action: PayloadAction<{
        group: string;
        swapTaskIndex: number;
        withTaskIndex: number;
        sameSection: boolean;
      }>
    ) {
      const { group, swapTaskIndex, withTaskIndex, sameSection } =
        action.payload;
      if (!sameSection) {
        const task = state.storage[group][swapTaskIndex];
        task.completed = !task.completed;
        return;
      }
      state.storage[group] = arrayMoveImmutable(
        state.storage[group],
        swapTaskIndex,
        withTaskIndex
      );
    },
  },
});

export const {
  taskAdded,
  taskModified,
  taskToggled,
  taskDeleted,
  reOpenAllCompleted,
  deleteAllCompleted,
  tasksLoaded,
  tasksGroupAdded,
  tasksReordered,
} = tasksSlice.actions;
export default tasksSlice.reducer;
