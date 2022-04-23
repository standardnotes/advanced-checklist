import { fireEvent, screen } from '@testing-library/react'
import { testRender } from '../../testUtils'

import TaskGroupOptions from './TaskGroupOptions'
import { tasksGroupDeleted } from './tasks-slice'

beforeEach(() => {
  window.confirm = jest.fn().mockReturnValue(true)
})

function clickButton(element: HTMLElement) {
  fireEvent.mouseDown(element)
  fireEvent.mouseUp(element)
  fireEvent.click(element)
  fireEvent.mouseMove(element)
  fireEvent.mouseUp(element)
}

const group = 'default group'

it('renders an options menu', () => {
  testRender(<TaskGroupOptions group={group} />)

  const optionsButton = screen.getByTestId('task-group-options')
  expect(optionsButton).toBeInTheDocument()

  const moveGroupToTrash = screen.getByTestId('move-task-group-trash')
  const mergeTaskGroup = screen.getByTestId('merge-task-group')

  expect(moveGroupToTrash).not.toBeVisible()
  expect(mergeTaskGroup).not.toBeVisible()

  clickButton(optionsButton)

  expect(moveGroupToTrash).toBeVisible()
  expect(mergeTaskGroup).toBeVisible()
})

it('should dispatch tasksGroupDeleted action', () => {
  const { mockStore } = testRender(<TaskGroupOptions group={group} />)

  const optionsButton = screen.getByTestId('task-group-options')
  fireEvent.click(optionsButton)

  const moveGroupToTrash = screen.getByTestId('move-task-group-trash')
  clickButton(moveGroupToTrash)

  expect(window.confirm).toBeCalledWith(
    `Are you sure you want to move '${group}' to the trash?`
  )

  const dispatchedActions = mockStore.getActions()
  expect(dispatchedActions).toHaveLength(1)
  expect(dispatchedActions[0]).toMatchObject(tasksGroupDeleted({ group }))
})
