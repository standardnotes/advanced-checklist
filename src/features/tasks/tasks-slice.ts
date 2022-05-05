import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { arrayMoveImmutable } from '../../common/utils'

export type TasksState = {
  groups: GroupPayload[]
  initialized?: boolean
}

const initialState: TasksState = {
  groups: [],
}

export type TaskPayload = {
  id: string
  description: string
  completed?: boolean
  createdAt: Date
  updatedAt?: Date
  completedAt?: Date
}

export type GroupPayload = {
  name: string
  collapsed?: boolean
  draft?: string
  lastActive?: boolean
  tasks: TaskPayload[]
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    taskAdded(
      state,
      action: PayloadAction<{
        task: { id: string; description: string }
        groupName: string
      }>
    ) {
      const { groupName, task } = action.payload
      const group = state.groups.find((item) => item.name === groupName)
      if (!group) {
        return
      }
      delete group.draft
      group.tasks.unshift({
        ...task,
        completed: false,
        createdAt: new Date(),
      })
    },
    taskModified(
      state,
      action: PayloadAction<{
        task: { id: string; description: string }
        groupName: string
      }>
    ) {
      const { groupName, task } = action.payload
      const group = state.groups.find((item) => item.name === groupName)
      if (!group) {
        return
      }
      const currentTask = group.tasks.find((item) => item.id === task.id)
      if (currentTask) {
        currentTask.description = task.description
        currentTask.updatedAt = new Date()
      }
    },
    taskDeleted(
      state,
      action: PayloadAction<{ id: string; groupName: string }>
    ) {
      const { id, groupName } = action.payload
      const group = state.groups.find((item) => item.name === groupName)
      if (!group) {
        return
      }
      group.tasks = group.tasks.filter((task) => task.id !== id)
    },
    taskToggled(
      state,
      action: PayloadAction<{ id: string; groupName: string }>
    ) {
      const { id, groupName } = action.payload
      const group = state.groups.find((item) => item.name === groupName)
      if (!group) {
        return
      }
      const currentTask = group.tasks.find((task) => task.id === id)
      if (currentTask) {
        currentTask.completed = !currentTask.completed
        currentTask.updatedAt = new Date()
        if (currentTask.completed) {
          currentTask.completedAt = new Date()
        } else {
          delete currentTask.completedAt
        }
      }
    },
    openAllCompleted(state, action: PayloadAction<{ groupName: string }>) {
      const { groupName } = action.payload
      const group = state.groups.find((item) => item.name === groupName)
      if (!group) {
        return
      }
      group.tasks.forEach((task) => {
        task.completed = false
        delete task.completedAt
      })
    },
    deleteAllCompleted(state, action: PayloadAction<{ groupName: string }>) {
      const { groupName } = action.payload
      const group = state.groups.find((item) => item.name === groupName)
      if (!group) {
        return
      }
      group.tasks = group.tasks.filter((task) => task.completed === false)
    },
    tasksReordered(
      state,
      action: PayloadAction<{
        groupName: string
        swapTaskIndex: number
        withTaskIndex: number
        isSameSection: boolean
      }>
    ) {
      const { groupName, swapTaskIndex, withTaskIndex, isSameSection } =
        action.payload
      if (!isSameSection) {
        return
      }
      const group = state.groups.find((item) => item.name === groupName)
      if (!group) {
        return
      }
      group.tasks = arrayMoveImmutable(
        group.tasks,
        swapTaskIndex,
        withTaskIndex
      )
    },
    tasksGroupAdded(state, action: PayloadAction<string>) {
      const group = state.groups.find((item) => item.name === action.payload)
      if (group) {
        return
      }
      state.groups.push({
        name: action.payload,
        tasks: [],
      })
    },
    tasksGroupReordered(
      state,
      action: PayloadAction<{
        swapGroupIndex: number
        withGroupIndex: number
      }>
    ) {
      const { swapGroupIndex, withGroupIndex } = action.payload
      state.groups = arrayMoveImmutable(
        state.groups,
        swapGroupIndex,
        withGroupIndex
      )
    },
    tasksGroupDeleted(
      state,
      action: PayloadAction<{
        groupName: string
      }>
    ) {
      const { groupName } = action.payload
      state.groups = state.groups.filter((item) => item.name !== groupName)
    },
    tasksGroupMerged(
      state,
      action: PayloadAction<{
        groupName: string
        mergeWith: string
      }>
    ) {
      const { groupName, mergeWith } = action.payload
      if (groupName === mergeWith) {
        return
      }
      const groupA = state.groups.find((item) => item.name === groupName)
      if (!groupA) {
        return
      }
      const groupB = state.groups.find((item) => item.name === mergeWith)
      if (!groupB) {
        return
      }
      state.groups = state.groups
        .filter((item) => item.name !== groupName)
        .map((item) => {
          const tasks = groupB.tasks.concat(groupA.tasks)
          if (item.name === mergeWith) {
            return {
              ...item,
              tasks,
            }
          }
          return item
        })
    },
    tasksGroupCollapsed(
      state,
      action: PayloadAction<{
        groupName: string
        collapsed: boolean
      }>
    ) {
      const { groupName, collapsed } = action.payload
      const group = state.groups.find((item) => item.name === groupName)
      if (!group) {
        return
      }
      group.collapsed = collapsed
    },
    tasksGroupDraft(
      state,
      action: PayloadAction<{
        groupName: string
        draft: string
      }>
    ) {
      const { groupName, draft } = action.payload
      const group = state.groups.find((item) => item.name === groupName)
      if (!group) {
        return
      }
      group.draft = draft
    },
    tasksGroupLastActive(
      state,
      action: PayloadAction<{
        groupName: string
      }>
    ) {
      const { groupName } = action.payload
      state.groups.forEach((item) => {
        if (item.name === groupName) {
          item.lastActive = true
          return
        }
        item.lastActive && delete item.lastActive
      })
    },
    tasksLoaded(state, action: PayloadAction<string>) {
      if (!action.payload && !state.initialized) {
        action.payload = '[]'
      }

      try {
        const newState: TasksState = {
          groups: [],
          initialized: true,
        }
        const groupsPayloads = JSON.parse(action.payload) as GroupPayload[]

        groupsPayloads.forEach((group) => {
          newState.groups.push(group)
        })

        if (newState !== initialState) {
          state.groups = newState.groups
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
  tasksGroupDeleted,
  tasksGroupMerged,
  tasksGroupCollapsed,
  tasksGroupDraft,
  tasksGroupLastActive,
} = tasksSlice.actions
export default tasksSlice.reducer
