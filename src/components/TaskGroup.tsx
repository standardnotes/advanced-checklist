import CreateTask from './CreateTask'
import TaskList from './TaskList'
import { TaskPayload } from './../features/tasks/tasks-slice'
import { getPercentage } from '../common/utils'
import CircularProgressBar from './CircularProgressBar'

const TaskGroupName: React.FC = ({ children }) => {
  return (
    <h1 className="group-name" data-testid="task-group-name">
      {children}
    </h1>
  )
}

type TaskGroupStatsProps = {
  completedTasks: number
  totalTasks: number
}

const TaskGroupStats: React.FC<TaskGroupStatsProps> = ({
  completedTasks,
  totalTasks,
}) => {
  return (
    <span className="stats" data-testid="task-group-stats">
      {completedTasks}/{totalTasks}
    </span>
  )
}

const TaskGroupSeparator: React.FC = () => {
  return <hr data-testid="task-group-separator" />
}

type TaskGroupProps = {
  group: string
  tasks: TaskPayload[]
  isLast: boolean
}

const TaskGroup: React.FC<TaskGroupProps> = ({ group, tasks, isLast }) => {
  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const percentageCompleted = getPercentage(completedTasks, totalTasks)

  return (
    <div className="task-group-container">
      <div className="task-group">
        <TaskGroupName>{group}</TaskGroupName>
        <CircularProgressBar size={22} percentage={percentageCompleted} />
        <TaskGroupStats
          completedTasks={completedTasks}
          totalTasks={totalTasks}
        />
      </div>

      <CreateTask group={group} />
      <TaskList group={group} tasks={tasks} />

      {!isLast && <TaskGroupSeparator />}
    </div>
  )
}

export default TaskGroup
