import { render, screen, within } from '@testing-library/react'
import NotePreview from './NotePreview'

const workTasks = [
  {
    id: 'test-b-1',
    description: 'Test #1',
  },
  {
    id: 'test-b-2',
    description: 'Test #2',
    completed: true,
  },
]

const personalTasks = [
  {
    id: 'test-c-1',
    description: 'Test #3',
  },
  {
    id: 'test-c-2',
    description: 'Test #4',
    completed: true,
  },
]

const miscTasks = [
  {
    id: 'test-d-1',
    description: 'Test #5',
  },
  {
    id: 'test-d-2',
    description: 'Test #6',
  },
]

it('should render without tasks', () => {
  const groupedTasks = {}

  render(<NotePreview groupedTasks={groupedTasks} />)

  const header = screen.getByText('0/0 tasks completed')
  expect(header).toBeVisible()

  const progressBar = screen.getByRole('progressbar') as HTMLProgressElement
  expect(progressBar.max).toBe(100)
  expect(progressBar.value).toBe(0)

  const taskList = screen.queryAllByRole('list')
  expect(taskList).toHaveLength(0)

  const taskListElements = screen.queryAllByRole('listitem')
  expect(taskListElements).toHaveLength(0)
})

it('should render with tasks', () => {
  const groupedTasks = {
    Work: workTasks,
    Personal: personalTasks,
  }

  render(<NotePreview groupedTasks={groupedTasks} />)

  const header = screen.getByText('2/4 tasks completed')
  expect(header).toBeVisible()

  const progressBar = screen.getByRole('progressbar') as HTMLProgressElement
  expect(progressBar.max).toBe(100)
  expect(progressBar.value).toBe(50)

  const taskList = screen.getByRole('list')
  const taskListElements = within(taskList).getAllByRole('listitem')

  expect(taskListElements).toHaveLength(2)
})

it('should render a summary of the remaining open task', () => {
  const groupedTasks = {
    Work: workTasks,
    Personal: personalTasks,
    Misc: miscTasks,
  }

  render(<NotePreview groupedTasks={groupedTasks} />)

  const remainingTaskSummary = screen.getByText('And 1 other open task')
  expect(remainingTaskSummary).toBeVisible()
})

it('should render a summary of the remaining open task(s)', () => {
  const groupedTasks = {
    Work: workTasks,
    Personal: personalTasks,
    Misc: miscTasks,
    Groceries: [
      {
        id: 'test-e-1',
        description: 'Test #7',
      },
    ],
  }

  render(<NotePreview groupedTasks={groupedTasks} />)

  const remainingTaskSummary = screen.getByText('And 2 other open tasks')
  expect(remainingTaskSummary).toBeVisible()
})
