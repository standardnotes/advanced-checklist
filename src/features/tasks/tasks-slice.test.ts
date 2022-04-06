import reducer, {
  openAllCompleted,
  deleteAllCompleted,
  taskAdded,
  taskDeleted,
  taskModified,
  tasksLoaded,
  taskToggled,
  tasksGroupAdded,
  tasksReordered,
} from './tasks-slice'
import type { TasksState, GroupedTaskPayload } from './tasks-slice'

it('should return the initial state', () => {
  return expect(
    reducer(undefined, {
      type: undefined,
    })
  ).toEqual({ storage: {} })
})

it('should handle a task being added', () => {
  const previousState: TasksState = { storage: {} }

  expect(
    reducer(
      previousState,
      taskAdded({
        task: { id: 'some-id', description: 'A simple task' },
        group: 'Test',
      })
    )
  ).toEqual({
    storage: {
      Test: [
        {
          id: 'some-id',
          description: 'A simple task',
          completed: false,
        },
      ],
    },
  })
})

it('should set completed to false when adding a new task', () => {
  const previousState: TasksState = { storage: {} }

  expect(
    reducer(
      previousState,
      taskAdded({
        task: { id: 'some-id', description: 'A simple task', completed: true },
        group: 'Test',
      })
    )
  ).toEqual({
    storage: {
      Test: [
        {
          id: 'some-id',
          description: 'A simple task',
          completed: false,
        },
      ],
    },
  })
})

it('should handle a task being added to the existing tasks store', () => {
  const previousState: TasksState = {
    storage: {
      Test: [
        {
          id: 'some-id',
          description: 'A simple task',
          completed: false,
        },
      ],
    },
  }

  expect(
    reducer(
      previousState,
      taskAdded({
        task: { id: 'another-id', description: 'Another simple task' },
        group: 'Test',
      })
    )
  ).toEqual({
    storage: {
      Test: [
        {
          id: 'another-id',
          description: 'Another simple task',
          completed: false,
        },
        {
          id: 'some-id',
          description: 'A simple task',
          completed: false,
        },
      ],
    },
  })
})

it('should handle an existing task being modified', () => {
  const previousState: TasksState = {
    storage: {
      Test: [
        {
          id: 'some-id',
          description: 'A simple task',
          completed: false,
        },
      ],
    },
  }

  expect(
    reducer(
      previousState,
      taskModified({
        task: { id: 'some-id', description: 'Task description changed' },
        group: 'Test',
      })
    )
  ).toEqual({
    storage: {
      Test: [
        {
          id: 'some-id',
          description: 'Task description changed',
          completed: false,
        },
      ],
    },
  })
})

it('should not modify tasks if an invalid id is provided', () => {
  const previousState: TasksState = {
    storage: {
      Test: [
        {
          id: 'some-id',
          description: 'A simple task',
          completed: false,
        },
      ],
    },
  }

  expect(
    reducer(
      previousState,
      taskModified({
        task: { id: 'some-invalid-id', description: 'New description' },
        group: 'Test',
      })
    )
  ).toEqual({
    storage: {
      Test: [
        {
          id: 'some-id',
          description: 'A simple task',
          completed: false,
        },
      ],
    },
  })
})

it('should keep completed field as-is, if task is modified', () => {
  const previousState: TasksState = {
    storage: {
      Test: [
        {
          id: 'some-id',
          description: 'A simple task',
          completed: false,
        },
      ],
    },
  }

  expect(
    reducer(
      previousState,
      taskModified({
        task: {
          id: 'some-id',
          description: 'New description',
          completed: true,
        },
        group: 'Test',
      })
    )
  ).toEqual({
    storage: {
      Test: [
        {
          id: 'some-id',
          description: 'New description',
          completed: false,
        },
      ],
    },
  })
})

it('should handle an existing task being toggled', () => {
  const previousState: TasksState = {
    storage: {
      Test: [
        {
          id: 'some-id',
          description: 'A simple task',
          completed: false,
        },
      ],
    },
  }

  expect(
    reducer(previousState, taskToggled({ id: 'some-id', group: 'Test' }))
  ).toEqual({
    storage: {
      Test: [
        {
          id: 'some-id',
          description: 'A simple task',
          completed: true,
        },
      ],
    },
  })
})

it('should handle an existing task being deleted', () => {
  const previousState: TasksState = {
    storage: {
      Test: [
        {
          id: 'some-id',
          description: 'A simple task',
          completed: false,
        },
        {
          id: 'another-id',
          description: 'Another simple task',
          completed: false,
        },
      ],
    },
  }

  expect(
    reducer(previousState, taskDeleted({ id: 'some-id', group: 'Test' }))
  ).toEqual({
    storage: {
      Test: [
        {
          id: 'another-id',
          description: 'Another simple task',
          completed: false,
        },
      ],
    },
  })
})

it('should handle opening all tasks that are marked as completed', () => {
  const previousState: TasksState = {
    storage: {
      Test: [
        {
          id: 'some-id',
          description: 'A simple task',
          completed: false,
        },
        {
          id: 'another-id',
          description: 'Another simple task',
          completed: false,
        },
        {
          id: 'yet-another-id',
          description: 'Yet another simple task',
          completed: true,
        },
      ],
    },
  }

  expect(reducer(previousState, openAllCompleted({ group: 'Test' }))).toEqual({
    storage: {
      Test: [
        {
          id: 'some-id',
          description: 'A simple task',
          completed: false,
        },
        {
          id: 'another-id',
          description: 'Another simple task',
          completed: false,
        },
        {
          id: 'yet-another-id',
          description: 'Yet another simple task',
          completed: false,
        },
      ],
    },
  })
})

it('should handle clear all completed tasks', () => {
  const previousState: TasksState = {
    storage: {
      Test: [
        {
          id: 'some-id',
          description: 'A simple task',
          completed: true,
        },
        {
          id: 'another-id',
          description: 'Another simple task',
          completed: false,
        },
        {
          id: 'yet-another-id',
          description: 'Yet another simple task',
          completed: true,
        },
      ],
    },
  }

  expect(reducer(previousState, deleteAllCompleted({ group: 'Test' }))).toEqual(
    {
      storage: {
        Test: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
          },
        ],
      },
    }
  )
})

it('should handle loading tasks into the tasks store, if an invalid payload is provided', () => {
  const previousState: TasksState = {
    storage: {
      Test: [
        {
          id: 'another-id',
          description: 'Another simple task',
          completed: false,
        },
      ],
    },
  }

  expect(reducer(previousState, tasksLoaded(''))).toEqual(previousState)
  expect(reducer(previousState, tasksLoaded('null'))).toEqual(previousState)
  expect(reducer(previousState, tasksLoaded('undefined'))).toEqual(
    previousState
  )
})

it('should handle loading tasks into the tasks store, with a valid payload', () => {
  const previousState: TasksState = {
    storage: {},
  }

  const tasksPayload: GroupedTaskPayload = {
    Test: [
      {
        id: 'some-id',
        description: 'A simple task',
        completed: true,
      },
      {
        id: 'another-id',
        description: 'Another simple task',
        completed: false,
      },
      {
        id: 'yet-another-id',
        description: 'Yet another simple task',
        completed: true,
      },
    ],
  }

  const serializedPayload = JSON.stringify(tasksPayload)
  expect(reducer(previousState, tasksLoaded(serializedPayload))).toEqual({
    initialized: true,
    storage: {
      Test: [
        {
          id: 'some-id',
          description: 'A simple task',
          completed: true,
        },
        {
          id: 'another-id',
          description: 'Another simple task',
          completed: false,
        },
        {
          id: 'yet-another-id',
          description: 'Yet another simple task',
          completed: true,
        },
      ],
    },
  })
})

it('should handle adding a new task group', () => {
  const previousState: TasksState = { storage: {} }

  expect(reducer(previousState, tasksGroupAdded('New group'))).toEqual({
    storage: {
      'New group': [],
    },
  })
})

it('should handle adding an existing task group', () => {
  const previousState: TasksState = {
    storage: {
      'Existing group': [
        {
          id: 'some-id',
          description: 'A simple task',
          completed: true,
        },
      ],
    },
  }

  expect(reducer(previousState, tasksGroupAdded('Existing group'))).toEqual(
    previousState
  )
})

it('should handle reordering tasks from the same section', () => {
  const previousState: TasksState = {
    storage: {
      Test: [
        {
          id: 'some-id',
          description: 'A simple task',
          completed: true,
        },
        {
          id: 'another-id',
          description: 'Another simple task',
          completed: false,
        },
        {
          id: 'yet-another-id',
          description: 'Yet another simple task',
          completed: true,
        },
      ],
    },
  }

  expect(
    reducer(
      previousState,
      tasksReordered({
        group: 'Test',
        swapTaskIndex: 0,
        withTaskIndex: 1,
        isSameSection: true,
      })
    )
  ).toEqual({
    storage: {
      Test: [
        {
          id: 'another-id',
          description: 'Another simple task',
          completed: false,
        },
        {
          id: 'some-id',
          description: 'A simple task',
          completed: true,
        },
        {
          id: 'yet-another-id',
          description: 'Yet another simple task',
          completed: true,
        },
      ],
    },
  })
})

it('should handle reordering tasks from different sections', () => {
  const previousState: TasksState = {
    storage: {
      Test: [
        {
          id: 'some-id',
          description: 'A simple task',
          completed: true,
        },
        {
          id: 'another-id',
          description: 'Another simple task',
          completed: false,
        },
        {
          id: 'yet-another-id',
          description: 'Yet another simple task',
          completed: true,
        },
      ],
    },
  }

  expect(
    reducer(
      previousState,
      tasksReordered({
        group: 'Test',
        swapTaskIndex: 0,
        withTaskIndex: 1,
        isSameSection: false,
      })
    )
  ).toEqual({
    storage: {
      Test: [
        {
          id: 'some-id',
          description: 'A simple task',
          completed: false,
        },
        {
          id: 'another-id',
          description: 'Another simple task',
          completed: false,
        },
        {
          id: 'yet-another-id',
          description: 'Yet another simple task',
          completed: true,
        },
      ],
    },
  })
})
