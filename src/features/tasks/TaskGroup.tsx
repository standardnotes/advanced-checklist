import { TaskPayload } from './tasks-slice'
import CreateTask from './CreateTask'
import TaskList from './TaskList'
import { getPercentage } from '../../common/utils'
import CircularProgressBar from '../../common/components/CircularProgressBar'
import MainTitle from '../../common/components/MainTitle'
import GenericInlineText from '../../common/components/GenericInlineText'
import ThematicBreak from '../../common/components/ThematicBreak'

const TaskGroupName: React.FC = ({ children }) => {
  return <MainTitle data-testid="task-group-name">{children}</MainTitle>
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
    <GenericInlineText data-testid="task-group-stats">
      {completedTasks}/{totalTasks}
    </GenericInlineText>
  )
}

const TaskGroupSeparator: React.FC = () => {
  return <ThematicBreak data-testid="task-group-separator" />
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
    <>
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
    </>
  )
}

export default TaskGroup
