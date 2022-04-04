import reducer, {
  setCanEdit,
  setIsRunningOnMobile,
  setShowTutorial,
  setSpellCheckerEnabled,
} from './settings-slice';
import type { SettingsState } from './settings-slice';

it('should return the initial state', () => {
  return expect(
    reducer(undefined, {
      type: undefined,
    })
  ).toEqual({
    canEdit: true,
    isRunningOnMobile: false,
    showTutorial: true,
    spellCheckerEnabled: true,
  });
});

it('should handle setting canEdit property', () => {
  const previousState: SettingsState = {
    canEdit: false,
    isRunningOnMobile: false,
    showTutorial: false,
    spellCheckerEnabled: false,
  };

  expect(reducer(previousState, setCanEdit(true))).toEqual({
    ...previousState,
    canEdit: true,
  });
});

it('should handle setting isRunningOnMobile property', () => {
  const previousState: SettingsState = {
    canEdit: false,
    isRunningOnMobile: false,
    showTutorial: false,
    spellCheckerEnabled: false,
  };

  expect(reducer(previousState, setIsRunningOnMobile(true))).toEqual({
    ...previousState,
    isRunningOnMobile: true,
  });
});

it('should handle setting showTutorial property', () => {
  const previousState: SettingsState = {
    canEdit: false,
    isRunningOnMobile: false,
    showTutorial: false,
    spellCheckerEnabled: false,
  };

  expect(reducer(previousState, setShowTutorial(true))).toEqual({
    ...previousState,
    showTutorial: true,
  });
});

it('should handle setting spellCheckerEnabled property', () => {
  const previousState: SettingsState = {
    canEdit: false,
    isRunningOnMobile: false,
    showTutorial: false,
    spellCheckerEnabled: false,
  };

  expect(reducer(previousState, setSpellCheckerEnabled(true))).toEqual({
    ...previousState,
    spellCheckerEnabled: true,
  });
});
