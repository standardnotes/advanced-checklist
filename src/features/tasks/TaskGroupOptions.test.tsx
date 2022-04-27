import { fireEvent, screen } from '@testing-library/react'
import { testRender } from '../../testUtils'

import TaskGroupOptions from './TaskGroupOptions'
import { tasksGroupDeleted } from './tasks-slice'

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

  const confirmDialog = screen.getByTestId('trash-task-group-dialog')
  expect(confirmDialog).toBeInTheDocument()
  expect(confirmDialog).toHaveTextContent(
    `Are you sure you want to move '${group}' to the trash?`
  )

  const confirmButton = screen.getByTestId('confirm-dialog-button')
  fireEvent.click(confirmButton)

  const dispatchedActions = mockStore.getActions()
  expect(dispatchedActions).toHaveLength(1)
  expect(dispatchedActions[0]).toMatchObject(tasksGroupDeleted({ group }))
})

it('should open the merge task group dialog', () => {
  testRender(<TaskGroupOptions group={group} />)

  const optionsButton = screen.getByTestId('task-group-options')
  fireEvent.click(optionsButton)

  const mergeTaskGroup = screen.getByTestId('merge-task-group')
  clickButton(mergeTaskGroup)

  expect(screen.getByTestId('merge-task-group-dialog')).toBeInTheDocument()
})

it('should open the delete task group dialog', () => {
  testRender(<TaskGroupOptions group={group} />)

  const optionsButton = screen.getByTestId('task-group-options')
  fireEvent.click(optionsButton)

  const trashTaskGroup = screen.getByTestId('move-task-group-trash')
  clickButton(trashTaskGroup)

  expect(screen.getByTestId('trash-task-group-dialog')).toBeInTheDocument()
})

it('should open the rename task group dialog', () => {
  testRender(<TaskGroupOptions group={group} />)

  const optionsButton = screen.getByTestId('task-group-options')
  fireEvent.click(optionsButton)

  const renameTaskGroup = screen.getByTestId('rename-task-group')
  clickButton(renameTaskGroup)

  expect(screen.getByTestId('rename-task-group-dialog')).toBeInTheDocument()
})

it('should close the delete task group dialog', () => {
  testRender(<TaskGroupOptions group={group} />)

  const optionsButton = screen.getByTestId('task-group-options')
  fireEvent.click(optionsButton)

  const trashTaskGroup = screen.getByTestId('move-task-group-trash')
  clickButton(trashTaskGroup)

  const cancelButton = screen.getByTestId('cancel-dialog-button')
  clickButton(cancelButton)

  expect(
    screen.queryByTestId('trash-task-group-dialog')
  ).not.toBeInTheDocument()
})

it('should close the merge task group dialog', () => {
  testRender(<TaskGroupOptions group={group} />)

  const optionsButton = screen.getByTestId('task-group-options')
  fireEvent.click(optionsButton)

  const mergeTaskGroup = screen.getByTestId('merge-task-group')
  clickButton(mergeTaskGroup)

  const cancelButton = screen.queryAllByRole('button')[0]
  clickButton(cancelButton)

  expect(
    screen.queryByTestId('merge-task-group-dialog')
  ).not.toBeInTheDocument()
})

it('should close the rename task group dialog', () => {
  testRender(<TaskGroupOptions group={group} />)

  const optionsButton = screen.getByTestId('task-group-options')
  fireEvent.click(optionsButton)

  const renameTaskGroup = screen.getByTestId('rename-task-group')
  clickButton(renameTaskGroup)

  const cancelButton = screen.queryAllByRole('button')[0]
  clickButton(cancelButton)

  expect(
    screen.queryByTestId('rename-task-group-dialog')
  ).not.toBeInTheDocument()
})
