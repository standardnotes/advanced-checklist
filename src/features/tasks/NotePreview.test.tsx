import { render, screen, within } from '@testing-library/react'
import NotePreview from './NotePreview'
import { GroupPayload } from './tasks-slice'

const workTasks = [
  {
    id: 'test-b-1',
    description: 'Test #1',
    createdAt: new Date(),
  },
  {
    id: 'test-b-2',
    description: 'Test #2',
    completed: true,
    createdAt: new Date(),
  },
]

const personalTasks = [
  {
    id: 'test-c-1',
    description: 'Test #3',
    createdAt: new Date(),
  },
  {
    id: 'test-c-2',
    description: 'Test #4',
    completed: true,
    createdAt: new Date(),
  },
]

const miscTasks = [
  {
    id: 'test-d-1',
    description: 'Test #5',
    createdAt: new Date(),
  },
  {
    id: 'test-d-2',
    description: 'Test #6',
    createdAt: new Date(),
  },
]

it('should render without tasks', () => {
  const groupedTasks: GroupPayload[] = []

  render(<NotePreview groupedTasks={groupedTasks} />)

  const header = screen.getByText('0/0 completed')
  expect(header).toBeVisible()

  // const progressBar = screen.getByRole('progressbar') as HTMLProgressElement
  // expect(progressBar.max).toBe(100)
  // expect(progressBar.value).toBe(0)

  const taskList = screen.queryAllByRole('list')
  expect(taskList).toHaveLength(0)

  const taskListElements = screen.queryAllByRole('listitem')
  expect(taskListElements).toHaveLength(0)
})

it('should render with tasks', () => {
  const groupedTasks = [
    {
      name: 'Work',
      tasks: workTasks,
    },
    {
      name: 'Personal',
      tasks: personalTasks,
    },
  ]

  render(<NotePreview groupedTasks={groupedTasks} />)

  const header = screen.getByText('2/4 completed')
  expect(header).toBeVisible()

  // const progressBar = screen.getByRole('progressbar') as HTMLProgressElement
  // expect(progressBar.max).toBe(100)
  // expect(progressBar.value).toBe(50)

  const taskList = screen.getByRole('list')
  const taskListElements = within(taskList).getAllByRole('listitem')

  expect(taskListElements).toHaveLength(2)
})

it('should render a summary of the remaining open task', () => {
  const groupedTasks = [
    {
      name: 'Work',
      tasks: workTasks,
    },
    {
      name: 'Personal',
      tasks: personalTasks,
    },
    {
      name: 'Misc',
      tasks: miscTasks,
    },
  ]

  render(<NotePreview groupedTasks={groupedTasks} />)

  const remainingTaskSummary = screen.getByText('And 1 other group')
  expect(remainingTaskSummary).toBeVisible()
})

it('should render a summary of the remaining open task(s)', () => {
  const groupedTasks = [
    {
      name: 'Work',
      tasks: workTasks,
    },
    {
      name: 'Personal',
      tasks: personalTasks,
    },
    {
      name: 'Misc',
      tasks: miscTasks,
    },
    {
      name: 'Groceries',
      tasks: [
        {
          id: 'test-e-1',
          description: 'Test #7',
          createdAt: new Date(),
        },
      ],
    },
  ]

  render(<NotePreview groupedTasks={groupedTasks} />)

  const remainingTaskSummary = screen.getByText('And 2 other groups')
  expect(remainingTaskSummary).toBeVisible()
})
