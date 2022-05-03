import { screen, fireEvent } from '@testing-library/react'

import { RootState } from '../../app/store'
import { TaskPayload } from './tasks-slice'
import { testRender } from '../../testUtils'
import TaskGroup from './TaskGroup'

const group = 'default group'
const tasks: TaskPayload[] = [
  {
    id: 'test-1',
    description: 'Testing',
    completed: false,
  },
  {
    id: 'test-2',
    description: 'Testing',
    completed: false,
  },
]

it('renders the group name', () => {
  testRender(<TaskGroup group={group} tasks={tasks} isDragging={false} />)

  expect(screen.getByText(group)).toBeVisible()
})

it('renders the number of completed tasks and total tasks', () => {
  testRender(<TaskGroup group={group} tasks={tasks} isDragging={false} />)

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length

  expect(screen.getByTestId('task-group-stats')).toHaveTextContent(
    `${completedTasks}/${totalTasks}`
  )
})

it('renders the circular progress bar', () => {
  testRender(<TaskGroup group={group} tasks={tasks} isDragging={false} />)

  expect(screen.getByTestId('circular-progress-bar')).toBeInTheDocument()
})

it('does not render a thematic break element', () => {
  testRender(<TaskGroup group={group} tasks={tasks} isDragging={false} />)

  expect(screen.queryByTestId('task-group-separator')).not.toBeInTheDocument()
})

it('renders the element that is used to create a new task', () => {
  testRender(<TaskGroup group={group} tasks={tasks} isDragging={false} />)

  expect(screen.getByTestId('create-task-input')).toBeInTheDocument()
})

it('renders the element that is used to display the list of tasks', () => {
  testRender(<TaskGroup group={group} tasks={tasks} isDragging={false} />)

  expect(screen.getByTestId('task-list')).toBeInTheDocument()
})

it('collapses the group', () => {
  testRender(<TaskGroup group={group} tasks={tasks} isDragging={false} />)

  const createTask = screen.getByTestId('create-task-input')
  const taskItemList = screen.getByTestId('task-list')

  expect(createTask).toBeVisible()
  expect(taskItemList).toBeVisible()

  const collapseButton = screen.getByTestId('collapse-task-group')
  fireEvent.click(collapseButton)

  expect(createTask).not.toBeVisible()
  expect(taskItemList).not.toBeVisible()
})

it('shows group options', () => {
  testRender(<TaskGroup group={group} tasks={tasks} isDragging={false} />)

  expect(screen.getByTestId('task-group-options')).toBeInTheDocument()
})

it('hides group options if can not edit', () => {
  const defaultState: Partial<RootState> = {
    settings: {
      canEdit: false,
      isRunningOnMobile: false,
      spellCheckerEnabled: true,
    },
  }

  testRender(
    <TaskGroup group={group} tasks={tasks} isDragging={false} />,
    {},
    defaultState
  )

  expect(screen.queryByTestId('task-group-options')).not.toBeInTheDocument()
})

it('shows a reorder icon when on mobile', () => {
  let defaultState: Partial<RootState> = {
    settings: {
      canEdit: false,
      isRunningOnMobile: true,
      spellCheckerEnabled: true,
    },
  }

  testRender(
    <TaskGroup group={group} tasks={tasks} isDragging={false} />,
    {},
    defaultState
  )

  expect(screen.queryByTestId('reorder-icon')).not.toBeInTheDocument()

  defaultState = {
    settings: {
      canEdit: true,
      isRunningOnMobile: true,
      spellCheckerEnabled: true,
    },
  }

  testRender(
    <TaskGroup group={group} tasks={tasks} isDragging={false} />,
    {},
    defaultState
  )

  expect(screen.getByTestId('reorder-icon')).toBeInTheDocument()
})
