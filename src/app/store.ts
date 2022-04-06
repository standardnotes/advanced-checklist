import { configureStore } from '@reduxjs/toolkit'

import tasksReducer from '../features/tasks/tasks-slice'
import settingsReducer from '../features/settings/settings-slice'

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    settings: settingsReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
