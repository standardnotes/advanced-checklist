import { fireEvent, screen } from '@testing-library/react'
import { RootState } from '../../app/store'

import { testRender } from '../../testUtils'
import { tasksGroupAdded } from './tasks-slice'
import CreateGroup from './CreateGroup'

it('renders a button by default', () => {
  testRender(<CreateGroup />)

  expect(screen.getByTestId('create-group-button')).toHaveTextContent('+')
  expect(screen.queryByTestId('create-group-input')).not.toBeInTheDocument()
})

it('renders nothing if user can not edit', () => {
  const defaultState: Partial<RootState> = {
    settings: {
      canEdit: false,
      isRunningOnMobile: false,
      spellCheckerEnabled: true,
    },
  }

  testRender(<CreateGroup />, {}, defaultState)

  expect(screen.queryByTestId('create-group-button')).not.toBeInTheDocument()
  expect(screen.queryByTestId('create-group-input')).not.toBeInTheDocument()
})

it('renders an input box when the button is clicked', () => {
  testRender(<CreateGroup />)

  const button = screen.getByTestId('create-group-button')
  fireEvent.click(button)

  expect(button).not.toBeInTheDocument()

  const inputBox = screen.queryByTestId('create-group-input')
  expect(inputBox).toBeInTheDocument()
  expect(inputBox).toHaveTextContent('')
})

it('changes text value', () => {
  testRender(<CreateGroup />)

  const button = screen.getByTestId('create-group-button')
  fireEvent.click(button)

  const inputBox = screen.getByTestId('create-group-input')
  fireEvent.change(inputBox, { target: { value: 'This is the new text' } })

  expect(inputBox.getAttribute('value')).toBe('This is the new text')
})

test('pressing enter when input box is empty, should not create a new group', () => {
  const { mockStore } = testRender(<CreateGroup />)

  let button = screen.getByTestId('create-group-button')
  fireEvent.click(button)

  const inputBox = screen.getByTestId('create-group-input')
  fireEvent.keyPress(inputBox, {
    key: 'Enter',
    code: 'Enter',
    charCode: 13,
    target: { value: '' },
  })

  const dispatchedActions = mockStore.getActions()
  expect(dispatchedActions).toHaveLength(0)

  button = screen.getByTestId('create-group-button')

  expect(inputBox).not.toBeInTheDocument()
  expect(button).toBeInTheDocument()
})

test('pressing enter should create a new group', () => {
  const group = 'My group name'
  const { mockStore } = testRender(<CreateGroup />)

  let button = screen.getByTestId('create-group-button')
  fireEvent.click(button)

  const inputBox = screen.getByTestId('create-group-input')
  fireEvent.keyPress(inputBox, {
    key: 'Enter',
    code: 'Enter',
    charCode: 13,
    target: { value: group },
  })

  const dispatchedActions = mockStore.getActions()
  expect(dispatchedActions).toHaveLength(1)
  expect(dispatchedActions[0]).toMatchObject(tasksGroupAdded(group))

  button = screen.getByTestId('create-group-button')

  expect(inputBox).not.toBeInTheDocument()
  expect(button).toBeInTheDocument()
})
