import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SettingsState = {
  canEdit: boolean;
  isRunningOnMobile: boolean;
  showTutorial: boolean;
  spellCheckerEnabled: boolean;
};

const initialState: SettingsState = {
  canEdit: true,
  isRunningOnMobile: false,
  showTutorial: true,
  spellCheckerEnabled: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setCanEdit(state, action: PayloadAction<boolean>) {
      state.canEdit = action.payload;
    },
    setIsRunningOnMobile(state, action: PayloadAction<boolean>) {
      state.isRunningOnMobile = action.payload;
    },
    setShowTutorial(state, action: PayloadAction<boolean>) {
      state.showTutorial = action.payload;
    },
    setSpellCheckerEnabled(state, action: PayloadAction<boolean>) {
      state.spellCheckerEnabled = action.payload;
    },
  },
});

export const {
  setCanEdit,
  setIsRunningOnMobile,
  setShowTutorial,
  setSpellCheckerEnabled,
} = settingsSlice.actions;
export default settingsSlice.reducer;
