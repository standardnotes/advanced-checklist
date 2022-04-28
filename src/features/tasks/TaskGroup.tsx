import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { useAppSelector } from '../../app/hooks'
import { getPercentage } from '../../common/utils'
import { TaskPayload } from './tasks-slice'

import CreateTask from './CreateTask'
import TaskItemList from './TaskItemList'

import TaskGroupOptions from './TaskGroupOptions'

import {
  CircularProgressBar,
  GenericInlineText,
  MainTitle,
  RoundButton,
} from '../../common/components'
import {
  ChevronDownIcon,
  ReorderIcon,
  ChevronUpIcon,
} from '../../common/components/icons'

const TaskGroupContainer = styled.div`
  background-color: var(--sn-stylekit-background-color);
  border: 1px solid var(--sn-stylekit-border-color);
  border-radius: 8px;
  box-sizing: border-box;
  padding: 16px;
  margin-bottom: 9px;
`

type CollapsableContainerProps = {
  collapsed: boolean
}

const CollapsableContainer = styled.div<CollapsableContainerProps>`
  display: ${({ collapsed }) => (collapsed ? 'none' : 'block')};
`

type TaskGroupProps = {
  group: string
  tasks: TaskPayload[]
  isLast: boolean
  isDragging: boolean
  innerRef?: (element?: HTMLElement | null | undefined) => any
  style?: React.CSSProperties
}

const TaskGroup: React.FC<TaskGroupProps> = ({
  group,
  tasks,
  isLast,
  isDragging,
  innerRef,
  style,
  ...props
}) => {
  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const percentageCompleted = getPercentage(completedTasks, totalTasks)

  const [collapsed, setCollapsed] = useState(isDragging)

  const canEdit = useAppSelector((state) => state.settings.canEdit)
  const isOnMobile = useAppSelector((state) => state.settings.isRunningOnMobile)

  function handleCollapse() {
    setCollapsed(!collapsed)
  }

  useEffect(() => {
    setCollapsed(isDragging)
  }, [isDragging, setCollapsed])

  return (
    <TaskGroupContainer ref={innerRef} style={style} {...props}>
      <div
        className={`flex items-center justify-between h-8 mt-1 ${
          isLast ? 'mb-3' : 'mb-1'
        }`}
      >
        <div className="flex flex-grow items-center">
          {canEdit && isOnMobile && (
            <div className="mr-3" {...props}>
              <ReorderIcon highlight={isDragging} />
            </div>
          )}
          <MainTitle highlight={isDragging}>{group}</MainTitle>
          <CircularProgressBar size={22} percentage={percentageCompleted} />
          <GenericInlineText data-testid="task-group-stats">
            {completedTasks}/{totalTasks}
          </GenericInlineText>
        </div>
        {!isDragging && (
          <div className="flex items-center">
            {canEdit && (
              <div className="ml-3">
                <TaskGroupOptions group={group} />
              </div>
            )}
            <div className="ml-3">
              <RoundButton
                testId="collapse-task-group"
                onClick={handleCollapse}
              >
                {!collapsed ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </RoundButton>
            </div>
          </div>
        )}
      </div>

      <CollapsableContainer collapsed={collapsed}>
        <CreateTask group={group} />
        <TaskItemList group={group} tasks={tasks} />
      </CollapsableContainer>
    </TaskGroupContainer>
  )
}

export default TaskGroup
