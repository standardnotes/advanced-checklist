import styled from 'styled-components'

import { getPercentage } from '../../common/utils'
import { TaskPayload } from './tasks-slice'
import CircularProgressBar from '../../common/components/CircularProgressBar'
import CreateTask from './CreateTask'
import GenericInlineText from '../../common/components/GenericInlineText'
import MainTitle from '../../common/components/MainTitle'
import TaskList from './TaskList'
import ThematicBreak from '../../common/components/ThematicBreak'

const GroupHeader = styled.div`
  align-items: center;
  display: flex;
`

const GroupName: React.FC = ({ children }) => {
  return <MainTitle data-testid="task-group-name">{children}</MainTitle>
}

type GroupStatsProps = {
  completedTasks: number
  totalTasks: number
}

const GroupStats: React.FC<GroupStatsProps> = ({
  completedTasks,
  totalTasks,
}) => {
  return (
    <GenericInlineText data-testid="task-group-stats">
      {completedTasks}/{totalTasks}
    </GenericInlineText>
  )
}

const GroupSeparator: React.FC = () => {
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
      <GroupHeader>
        <GroupName>{group}</GroupName>
        <CircularProgressBar size={22} percentage={percentageCompleted} />
        <GroupStats completedTasks={completedTasks} totalTasks={totalTasks} />
      </GroupHeader>

      <CreateTask group={group} />
      <TaskList group={group} tasks={tasks} />

      {!isLast && <GroupSeparator />}
    </>
  )
}

export default TaskGroup
