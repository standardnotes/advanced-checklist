import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { arrayMoveImmutable } from '../../common/utils'

export type TasksState = {
  storage: GroupedTaskPayload
  initialized?: boolean
}

const initialState: TasksState = {
  storage: {},
}

export type TaskPayload = {
  id: string
  description: string
  completed?: boolean
}

export type GroupedTaskPayload = {
  [group: string]: TaskPayload[]
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    taskAdded(
      state,
      action: PayloadAction<{ task: TaskPayload; group: string }>
    ) {
      const { group, task } = action.payload
      if (!state.storage[group]) {
        state.storage[group] = []
      }

      state.storage[group].unshift({
        ...task,
        completed: false,
      })
    },
    taskModified(
      state,
      action: PayloadAction<{ task: TaskPayload; group: string }>
    ) {
      const { task, group } = action.payload
      const currentTask = state.storage[group].find(
        (item) => item.id === task.id
      )
      currentTask && (currentTask.description = task.description)
    },
    taskDeleted(state, action: PayloadAction<{ id: string; group: string }>) {
      const { id, group } = action.payload
      const tasks = state.storage[group].filter((task) => task.id !== id)
      state.storage[group] = tasks
    },
    taskToggled(state, action: PayloadAction<{ id: string; group: string }>) {
      const { id, group } = action.payload
      const task = state.storage[group].find((task) => task.id === id)
      task && (task.completed = !task.completed)
    },
    openAllCompleted(state, action: PayloadAction<{ group: string }>) {
      const { group } = action.payload
      Object.values(state.storage[group]).forEach(
        (task) => (task.completed = false)
      )
    },
    deleteAllCompleted(state, action: PayloadAction<{ group: string }>) {
      const { group } = action.payload
      const tasks = state.storage[group].filter(
        (task) => task.completed === false
      )
      state.storage[group] = tasks
    },
    tasksGroupAdded(state, action: PayloadAction<string>) {
      if (!state.storage[action.payload]) {
        state.storage[action.payload] = []
      }
    },
    tasksReordered(
      state,
      action: PayloadAction<{
        group: string
        swapTaskIndex: number
        withTaskIndex: number
        isSameSection: boolean
      }>
    ) {
      const { group, swapTaskIndex, withTaskIndex, isSameSection } =
        action.payload
      if (!isSameSection) {
        return
      }
      state.storage[group] = arrayMoveImmutable(
        state.storage[group],
        swapTaskIndex,
        withTaskIndex
      )
    },
    tasksGroupReordered(
      state,
      action: PayloadAction<{
        swapGroupIndex: number
        withGroupIndex: number
      }>
    ) {
      const { swapGroupIndex, withGroupIndex } = action.payload
      const orderedGroups = arrayMoveImmutable(
        Object.keys(state.storage),
        swapGroupIndex,
        withGroupIndex
      )
      state.storage = orderedGroups.reduce(
        (acc, key) => ({
          ...acc,
          [key]: state.storage[key],
        }),
        {}
      )
    },
    tasksLoaded(state, action: PayloadAction<string>) {
      if (!action.payload && !state.initialized) {
        action.payload = '{}'
      }

      try {
        const newState: TasksState = {
          storage: {},
          initialized: true,
        }
        const tasksPayloads = JSON.parse(action.payload) as GroupedTaskPayload

        Object.keys(tasksPayloads).forEach((group) => {
          newState.storage[group] = []
          Object.values(tasksPayloads[group]).forEach((task) => {
            newState.storage[group].push(task)
          })
        })

        if (newState !== initialState) {
          state.storage = newState.storage
          state.initialized = newState.initialized
        }
      } catch (e) {
        return
      }
    },
  },
})

export const {
  taskAdded,
  taskModified,
  taskToggled,
  taskDeleted,
  openAllCompleted,
  deleteAllCompleted,
  tasksLoaded,
  tasksGroupAdded,
  tasksReordered,
  tasksGroupReordered,
} = tasksSlice.actions
export default tasksSlice.reducer
