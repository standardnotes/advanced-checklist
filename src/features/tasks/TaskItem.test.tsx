import { fireEvent, screen, waitFor } from '@testing-library/react'

import {
  taskDeleted,
  taskModified,
  TaskPayload,
  taskToggled,
} from './tasks-slice'
import { testRender } from '../../testUtils'
import TaskItem from './TaskItem'

const group = 'default group'
const task: TaskPayload = {
  id: 'test-1',
  description: 'Testing #1',
  completed: false,
}

it('renders a check box and textarea input', async () => {
  testRender(<TaskItem group={group} task={task} />)

  expect(screen.getByTestId('check-box-input')).toBeInTheDocument()
  expect(screen.getByTestId('text-area-input')).toBeInTheDocument()
})

test('clicking the check box should toggle the task as open/completed', () => {
  const { mockStore } = testRender(<TaskItem group={group} task={task} />)

  const checkBox = screen.getByTestId('check-box-input')
  fireEvent.click(checkBox)

  let dispatchedActions = mockStore.getActions()

  expect(dispatchedActions).toHaveLength(1)
  expect(dispatchedActions[0]).toMatchObject(
    taskToggled({
      id: task.id,
      group,
    })
  )

  fireEvent.click(checkBox)

  dispatchedActions = mockStore.getActions()

  expect(dispatchedActions).toHaveLength(2)
  expect(dispatchedActions[1]).toMatchObject(
    taskToggled({
      id: task.id,
      group,
    })
  )
})

test('changing the textarea input text should update the task description', async () => {
  jest.useFakeTimers()

  const newTaskDescription = 'My new task'

  const { mockStore } = testRender(<TaskItem group={group} task={task} />)

  const textAreaInput = screen.getByTestId(
    'text-area-input'
  ) as HTMLTextAreaElement
  fireEvent.change(textAreaInput, {
    target: { value: newTaskDescription },
  })
  fireEvent.keyUp(textAreaInput, {
    target: { value: newTaskDescription },
  })

  await waitFor(() => {
    expect(textAreaInput.value).toBe(newTaskDescription)
  })

  jest.runAllTimers()

  const dispatchedActions = mockStore.getActions()

  expect(dispatchedActions).toHaveLength(1)
  expect(dispatchedActions[0]).toMatchObject(
    taskModified({
      task: {
        ...task,
        description: newTaskDescription,
      },
      group,
    })
  )
})

test('clearing the textarea input text should delete the task', () => {
  const { mockStore } = testRender(<TaskItem group={group} task={task} />)

  const textAreaInput = screen.getByTestId('text-area-input')
  fireEvent.change(textAreaInput, {
    target: { value: '' },
  })
  fireEvent.keyUp(textAreaInput, {
    key: 'Enter',
    code: 'Enter',
    charCode: 13,
    target: { value: '' },
  })

  const dispatchedActions = mockStore.getActions()

  expect(dispatchedActions).toHaveLength(1)
  expect(dispatchedActions[0]).toMatchObject(
    taskDeleted({
      id: task.id,
      group,
    })
  )
})

test('pressing enter should not update the task description', () => {
  const { mockStore } = testRender(<TaskItem group={group} task={task} />)

  const textAreaInput = screen.getByTestId('text-area-input')
  fireEvent.keyPress(textAreaInput, {
    key: 'Enter',
    code: 'Enter',
    charCode: 13,
    target: { value: 'This is a test' },
  })

  const dispatchedActions = mockStore.getActions()

  expect(dispatchedActions).toHaveLength(0)
})
