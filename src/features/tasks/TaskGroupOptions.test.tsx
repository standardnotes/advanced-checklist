import { fireEvent, screen } from '@testing-library/react'
import { testRender } from '../../testUtils'

import { sleep } from '@standardnotes/utils'
import * as Utils from '../../common/utils'
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

it('should dispatch tasksGroupDeleted action', async () => {
  jest.spyOn(Utils, 'confirmDialog').mockResolvedValue(true)

  const { mockStore } = testRender(<TaskGroupOptions group={group} />)

  const optionsButton = screen.getByTestId('task-group-options')
  fireEvent.click(optionsButton)

  const moveGroupToTrash = screen.getByTestId('move-task-group-trash')
  clickButton(moveGroupToTrash)

  expect(Utils.confirmDialog).toBeCalledWith({
    confirmButtonStyle: 'danger',
    confirmButtonText: 'Move to trash',
    text: `Are you sure you want to move '<strong>${group}</strong>' to the trash?`,
    title: 'Move to trash',
  })

  await sleep(1)

  const dispatchedActions = mockStore.getActions()
  expect(dispatchedActions).toHaveLength(1)
  expect(dispatchedActions[0]).toMatchObject(tasksGroupDeleted({ group }))
})
