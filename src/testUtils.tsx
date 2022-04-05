import React from 'react';
import { Provider } from 'react-redux';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import configureStore from 'redux-mock-store';

const mockStore = configureStore()({
  tasks: {
    storage: {},
  },
  settings: {
    canEdit: true,
    isRunningOnMobile: false,
    spellCheckerEnabled: true,
  },
});

function testRender(ui: React.ReactElement, renderOptions?: RenderOptions) {
  function Wrapper({
    children,
  }: {
    children: React.ReactElement<
      any,
      string | React.JSXElementConstructor<any>
    >;
  }) {
    return <Provider store={mockStore}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export { testRender };
