import {
  Draggable,
  DraggingStyle,
  Droppable,
  NotDraggingStyle,
} from 'react-beautiful-dnd'
import styled from 'styled-components'

import { useAppSelector } from '../../app/hooks'
import { TaskPayload } from './tasks-slice'
import TaskItem from './TaskItem'

import { SubTitle } from '../../common/components'

const InnerTasksContainer = styled.div<{
  type: ContainerType
  items: number
}>`
  display: flex;
  flex-direction: column;

  & > *:not(:last-child) {
    margin-bottom: 5px;
  }

  ${({ type, items }) =>
    type === 'completed' && items > 0 ? 'margin-bottom: 28px' : ''};
`

const OuterContainer = styled.div<{ type: ContainerType; items: number }>`
  ${({ type, items }) =>
    type === 'open' && items > 0 ? 'margin-bottom: 18px' : ''};
`

const SubTitleContainer = styled.div`
  align-items: center;
  display: flex;

  & > *:first-child {
    margin-right: 14px;
  }
`

const Wrapper = styled.div`
  color: var(--sn-stylekit-foreground-color);
`

const getItemStyle = (
  isDragging: boolean,
  draggableStyle?: DraggingStyle | NotDraggingStyle
) => ({
  ...draggableStyle,
  ...(isDragging && {
    color: 'var(--sn-stylekit-info-color)',
    fontWeight: 500,
  }),
})

type ContainerType = 'open' | 'completed'

type TasksContainerProps = {
  groupName: string
  tasks: TaskPayload[]
  type: ContainerType
  testId?: string
}

const TasksContainer: React.FC<TasksContainerProps> = ({
  groupName,
  tasks,
  type,
  testId,
  children,
}) => {
  const canEdit = useAppSelector((state) => state.settings.canEdit)
  const droppableId = `${type}-tasks-droppable`

  return (
    <OuterContainer data-testid={testId} type={type} items={tasks.length}>
      <Droppable droppableId={droppableId} isDropDisabled={!canEdit}>
        {(provided) => (
          <Wrapper>
            <SubTitleContainer>
              <SubTitle>{type} tasks</SubTitle>
            </SubTitleContainer>
            <InnerTasksContainer
              {...provided.droppableProps}
              ref={provided.innerRef}
              type={type}
              items={tasks.length}
            >
              {tasks.map((task, index) => {
                return (
                  <Draggable
                    key={`draggable-${task.id}`}
                    draggableId={`draggable-${task.id}`}
                    index={index}
                    isDragDisabled={!canEdit}
                  >
                    {(
                      { innerRef, draggableProps, dragHandleProps },
                      { isDragging }
                    ) => {
                      const { style, ...restDraggableProps } = draggableProps
                      return (
                        <div
                          key={`task-container-${task.id}`}
                          className={`${type}-tasks-container`}
                          style={getItemStyle(isDragging, style)}
                          {...restDraggableProps}
                        >
                          <TaskItem
                            key={`task-${task.id}`}
                            task={task}
                            groupName={groupName}
                            innerRef={innerRef}
                            {...dragHandleProps}
                          />
                        </div>
                      )
                    }}
                  </Draggable>
                )
              })}
              {provided.placeholder}
            </InnerTasksContainer>
            {children}
          </Wrapper>
        )}
      </Droppable>
    </OuterContainer>
  )
}

export default TasksContainer
