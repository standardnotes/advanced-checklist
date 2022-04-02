import { GroupedTaskPayload } from './features/tasks/tasks-slice';

const personalTasks = [
  {
    id: 'test-a-1',
    description: 'Create Twitter profile banner',
  },
  {
    id: 'test-a-2',
    description: 'Create improved design for download splash',
  },
  {
    id: 'test-a-3',
    description: 'Send todo grouping wireframes',
    completed: true,
  },
  {
    id: 'test-a-4',
    description: 'Do the dishes',
    completed: true,
  },
];

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
];

const standardNotesTasks = [
  {
    id: 'test-c-1',
    description: 'Test #3',
  },
  {
    id: 'test-c-2',
    description: 'Test #4',
    completed: true,
  },
];

const mockData: GroupedTaskPayload = {
  Personal: personalTasks,
  Work: workTasks,
  'Standard Notes': standardNotesTasks,
  Test: [],
};

export default mockData;
