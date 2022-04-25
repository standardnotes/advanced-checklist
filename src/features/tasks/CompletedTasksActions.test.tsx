import { fireEvent, screen } from '@testing-library/react'
import { testRender } from '../../testUtils'

import { sleep } from '@standardnotes/utils'
import * as Utils from '../../common/utils'
import { RootState } from '../../app/store'
import CompletedTasksActions from './CompletedTasksActions'
import { deleteAllCompleted, openAllCompleted } from './tasks-slice'

const group = 'default group'

it('renders two buttons', () => {
  testRender(<CompletedTasksActions group={group} />)

  expect(screen.getByTestId('reopen-completed-button')).toHaveTextContent(
    'Reopen Completed'
  )
  expect(screen.getByTestId('delete-completed-button')).toHaveTextContent(
    'Delete Completed'
  )
})

it('should not render buttons if can not edit', () => {
  const defaultState: Partial<RootState> = {
    settings: {
      canEdit: false,
      isRunningOnMobile: false,
      spellCheckerEnabled: true,
    },
  }

  testRender(<CompletedTasksActions group={group} />, {}, defaultState)

  expect(
    screen.queryByTestId('reopen-completed-button')
  ).not.toBeInTheDocument()
  expect(
    screen.queryByTestId('delete-completed-button')
  ).not.toBeInTheDocument()
})

it('should dispatch openAllCompleted action', async () => {
  jest.spyOn(Utils, 'confirmDialog').mockResolvedValue(true)

  const { mockStore } = testRender(<CompletedTasksActions group={group} />)

  const reOpenCompletedButton = screen.getByTestId('reopen-completed-button')
  fireEvent.click(reOpenCompletedButton)

  expect(Utils.confirmDialog).toBeCalledWith({
    text: `Are you sure you want to reopen completed tasks on the '<strong>${group}</strong>' group?`,
  })

  await sleep(1)

  const dispatchedActions = mockStore.getActions()
  expect(dispatchedActions).toHaveLength(1)
  expect(dispatchedActions[0]).toMatchObject(openAllCompleted({ group }))
})

it('should dispatch deleteCompleted action', async () => {
  jest.spyOn(Utils, 'confirmDialog').mockResolvedValue(true)

  const { mockStore } = testRender(<CompletedTasksActions group={group} />)

  const deleteCompletedButton = screen.getByTestId('delete-completed-button')
  fireEvent.click(deleteCompletedButton)

  expect(Utils.confirmDialog).toBeCalledWith({
    text: `Are you sure you want to delete completed tasks on the '<strong>${group}</strong>' group?`,
  })

  await sleep(1)

  const dispatchedActions = mockStore.getActions()
  expect(dispatchedActions).toHaveLength(1)
  expect(dispatchedActions[0]).toMatchObject(deleteAllCompleted({ group }))
})
