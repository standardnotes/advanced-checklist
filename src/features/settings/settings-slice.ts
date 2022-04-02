import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SettingsState = {
  canEdit: boolean;
  isMobile: boolean;
  showTutorial: boolean;
  spellCheckerEnabled: boolean;
};

const initialState: SettingsState = {
  canEdit: true,
  isMobile: false,
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
    setIsMobile(state, action: PayloadAction<boolean>) {
      state.isMobile = action.payload;
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
  setIsMobile,
  setShowTutorial,
  setSpellCheckerEnabled,
} = settingsSlice.actions;
export default settingsSlice.reducer;
