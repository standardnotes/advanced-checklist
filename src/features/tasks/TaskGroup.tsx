import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { getPercentage } from '../../common/utils'
import { GroupPayload, tasksGroupCollapsed } from './tasks-slice'

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
  group: GroupPayload
  isDragging: boolean
  innerRef?: (element?: HTMLElement | null | undefined) => any
  style?: React.CSSProperties
}

const TaskGroup: React.FC<TaskGroupProps> = ({
  group,
  isDragging,
  innerRef,
  style,
  ...props
}) => {
  const dispatch = useAppDispatch()

  const completedTasks = group.tasks.filter((task) => task.completed).length
  const totalTasks = group.tasks.length
  const percentageCompleted = getPercentage(completedTasks, totalTasks)

  const [collapsed, setCollapsed] = useState<boolean>(!!group.collapsed)

  const canEdit = useAppSelector((state) => state.settings.canEdit)
  const isOnMobile = useAppSelector((state) => state.settings.isRunningOnMobile)

  const allTasksCompleted = totalTasks > 0 && totalTasks === completedTasks

  const groupName = group.name

  function handleCollapse() {
    dispatch(tasksGroupCollapsed({ groupName, collapsed: !collapsed }))
    setCollapsed(!collapsed)
  }

  useEffect(() => {
    !group.collapsed && setCollapsed(isDragging)
  }, [group, isDragging, setCollapsed])

  /**
   * We want to enable reordering groups via the reorder icon exclusively on mobile.
   */
  const taskGroupProps = {
    ...(!isOnMobile ? props : {}),
  }

  return (
    <TaskGroupContainer ref={innerRef} style={style} {...taskGroupProps}>
      <div className="flex items-center justify-between h-8 mt-1 mb-1">
        <div className="flex flex-grow items-center">
          {canEdit && isOnMobile && (
            <div className="mr-3" {...props}>
              <ReorderIcon highlight={isDragging} />
            </div>
          )}
          <MainTitle
            crossed={allTasksCompleted && collapsed}
            highlight={isDragging}
          >
            {groupName}
          </MainTitle>
          <CircularProgressBar size={18} percentage={percentageCompleted} />
          <GenericInlineText data-testid="task-group-stats">
            {completedTasks}/{totalTasks}
          </GenericInlineText>
        </div>
        {!isDragging && (
          <div className="flex items-center">
            {canEdit && (
              <div className="ml-3">
                <TaskGroupOptions groupName={groupName} />
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
        <TaskItemList group={group} />
      </CollapsableContainer>
    </TaskGroupContainer>
  )
}

export default TaskGroup
