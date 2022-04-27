import { screen, fireEvent } from '@testing-library/react'
import { RootState } from '../../app/store'
import { testRender } from '../../testUtils'

import RenameTaskGroups from './RenameTaskGroups'
import { tasksGroupMerged } from './tasks-slice'

const handleClose = jest.fn()

it('renders the alert dialog with an input box', () => {
  const defaultGroup = 'Test'
  const defaultState: Partial<RootState> = {
    tasks: {
      storage: {
        [defaultGroup]: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
          },
        ],
      },
    },
  }

  testRender(
    <RenameTaskGroups group={defaultGroup} handleClose={handleClose} />,
    {},
    defaultState
  )

  const alertDialog = screen.getByTestId('rename-task-group-dialog')
  expect(alertDialog).toBeInTheDocument()
  expect(alertDialog).toHaveTextContent(`Renaming the group '${defaultGroup}':`)

  const inputBox = screen.getByTestId('new-group-name-input')
  expect(inputBox).toBeInTheDocument()
  expect(inputBox).toHaveTextContent('')
})

it('should dispatch the action to merge groups', () => {
  const defaultGroup = 'Test'
  const defaultState: Partial<RootState> = {
    tasks: {
      storage: {
        [defaultGroup]: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
          },
        ],
        Testing: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
          },
        ],
      },
    },
  }

  const { mockStore } = testRender(
    <RenameTaskGroups group={defaultGroup} handleClose={handleClose} />,
    {},
    defaultState
  )

  const newGroupName = 'My new group name'

  const inputBox = screen.getByTestId(
    'new-group-name-input'
  ) as HTMLInputElement
  fireEvent.change(inputBox, { target: { value: newGroupName } })

  expect(inputBox.value).toBe(newGroupName)

  const buttons = screen.queryAllByRole('button')
  expect(buttons).toHaveLength(2)

  const cancelButton = buttons[0]
  expect(cancelButton).toHaveTextContent('Cancel')

  const mergeButton = buttons[1]
  expect(mergeButton).toHaveTextContent('Rename')

  fireEvent.click(mergeButton)

  const dispatchedActions = mockStore.getActions()
  expect(dispatchedActions).toHaveLength(1)
  expect(dispatchedActions[0]).toMatchObject(
    tasksGroupMerged({ group: defaultGroup, mergeWith: newGroupName })
  )
  expect(handleClose).toHaveBeenCalledTimes(1)
})
