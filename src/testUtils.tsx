import React from 'react'
import { Provider } from 'react-redux'
import { render as rtlRender, RenderOptions } from '@testing-library/react'
import configureStore from 'redux-mock-store'

import { RootState } from './app/store'

const defaultMockState: RootState = {
  tasks: {
    storage: {},
  },
  settings: {
    canEdit: true,
    isRunningOnMobile: false,
    spellCheckerEnabled: true,
  },
}

function testRender(
  ui: React.ReactElement,
  renderOptions?: RenderOptions,
  state?: Partial<RootState>
) {
  const mockStore = configureStore()({
    ...defaultMockState,
    ...state,
  })
  function Wrapper({
    children,
  }: {
    children: React.ReactElement<any, string | React.JSXElementConstructor<any>>
  }) {
    return <Provider store={mockStore}>{children}</Provider>
  }
  return {
    component: rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
    mockStore,
  }
}

export { testRender, defaultMockState }
