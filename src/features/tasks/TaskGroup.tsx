import { useState } from 'react'
import styled from 'styled-components'

import { getPercentage } from '../../common/utils'
import { TaskPayload } from './tasks-slice'

import CreateTask from './CreateTask'
import TaskItemList from './TaskItemList'

import CircularProgressBar from '../../common/components/CircularProgressBar'
import GenericInlineText from '../../common/components/GenericInlineText'
import MainTitle from '../../common/components/MainTitle'
import RoundButton from '../../common/components/RoundButton'
import ThematicBreak from '../../common/components/ThematicBreak'

import MoreIcon from '../../common/components/icons/MoreIcon'
import ChevronDownIcon from '../../common/components/icons/ChevronDownIcon'
import ReorderIcon from '../../common/components/icons/ReorderIcon'
import ChevronUpIcon from '../../common/components/icons/ChevronUpIcon'

type CollapsableContainerProps = {
  collapsed: boolean
}

const CollapsableContainer = styled.div<CollapsableContainerProps>`
  display: ${({ collapsed }) => (collapsed ? 'none' : 'block')};
`

const GroupSeparator: React.FC = () => {
  return <ThematicBreak data-testid="task-group-separator" />
}

type TaskGroupProps = {
  group: string
  tasks: TaskPayload[]
  isLast: boolean
  innerRef?: (element?: HTMLElement | null | undefined) => any
}

const TaskGroup: React.FC<TaskGroupProps> = ({
  group,
  tasks,
  isLast,
  innerRef,
  ...props
}) => {
  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const percentageCompleted = getPercentage(completedTasks, totalTasks)

  const [collapsed, setCollapsed] = useState(false)

  function handleCollapse() {
    setCollapsed(!collapsed)
  }

  function handleOptions() {
    console.log('Options button clicked...')
  }

  return (
    <div ref={innerRef} {...props}>
      <div
        className={`flex items-center justify-between h-8 mt-1 ${
          isLast ? 'mb-3' : 'mb-1'
        }`}
      >
        <div className="flex flex-grow items-center">
          <div className="mr-3">
            <ReorderIcon />
          </div>
          <MainTitle>{group}</MainTitle>
          <CircularProgressBar size={22} percentage={percentageCompleted} />
          <GenericInlineText data-testid="task-group-stats">
            {completedTasks}/{totalTasks}
          </GenericInlineText>
        </div>
        <div className="flex items-center">
          <div className="ml-3">
            <RoundButton onClick={handleOptions}>
              <MoreIcon />
            </RoundButton>
          </div>
          <div className="ml-3">
            <RoundButton onClick={handleCollapse}>
              {!collapsed ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </RoundButton>
          </div>
        </div>
      </div>

      <CollapsableContainer collapsed={collapsed}>
        <CreateTask group={group} />
        <TaskItemList group={group} tasks={tasks} />
      </CollapsableContainer>

      {!isLast && <GroupSeparator />}
    </div>
  )
}

export default TaskGroup
