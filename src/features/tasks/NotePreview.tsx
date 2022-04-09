import ProgressBar from '../../common/components/HorizontalProgressBar'
import {
  getPercentage,
  getTaskArrayFromGroupedTasks,
  groupTasksByCompletedStatus,
  truncateText,
} from '../../common/utils'
import { GroupedTaskPayload, TaskPayload } from './tasks-slice'

const TASKS_PREVIEW_LIMIT = 3
const MAX_TASK_DESCRIPTION_LENGTH = 30

const Header: React.FC = ({ children }) => {
  return <b style={{ marginTop: '10px', width: '100%' }}>{children}</b>
}

const TaskListElement: React.FC = ({ children, ...props }) => {
  return (
    <li style={{ marginBottom: '5px' }} {...props}>
      {children}
    </li>
  )
}

type TaskListProps = {
  openTasks: TaskPayload[]
}

const TaskList: React.FC<TaskListProps> = ({ openTasks }) => {
  const tasksToPreview = openTasks.slice(
    0,
    Math.min(openTasks.length, TASKS_PREVIEW_LIMIT)
  )
  if (tasksToPreview.length === 0) {
    return <></>
  }

  const remainingTasks = openTasks.length - tasksToPreview.length
  const taskNoun = remainingTasks > 1 ? 'tasks' : 'task'

  return (
    <>
      <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
        {tasksToPreview.map((task, index) => (
          <TaskListElement key={`task-${index}`}>
            {truncateText(task.description, MAX_TASK_DESCRIPTION_LENGTH)}
          </TaskListElement>
        ))}
      </ul>
      {openTasks.length > tasksToPreview.length && (
        <b>
          And {remainingTasks} other open {taskNoun}
        </b>
      )}
    </>
  )
}

type NotePreviewProps = {
  groupedTasks: GroupedTaskPayload
}

const NotePreview: React.FC<NotePreviewProps> = ({ groupedTasks }) => {
  const allTasks: TaskPayload[] = getTaskArrayFromGroupedTasks(groupedTasks)
  const { openTasks, completedTasks } = groupTasksByCompletedStatus(allTasks)
  const completedPercentage = getPercentage(
    allTasks.length,
    completedTasks.length
  )

  return (
    <>
      <Header>
        {completedTasks.length}/{allTasks.length} tasks completed
      </Header>
      <ProgressBar max={100} value={completedPercentage} />
      <TaskList openTasks={openTasks} />
    </>
  )
}

export default NotePreview

export function getPlainPreview(groupedTasks: GroupedTaskPayload) {
  const allTasks = getTaskArrayFromGroupedTasks(groupedTasks)
  const { openTasks } = groupTasksByCompletedStatus(allTasks)

  return `${openTasks.length}/${allTasks.length} tasks completed`
}