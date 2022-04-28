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
import { ClosedCircleIcon, OpenCircleIcon } from '../../common/components/icons'

const SubTitleContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 14px;
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

type TasksContainerProps = {
  title: string
  tasks: TaskPayload[]
  group: string
  testId?: string
}

const TasksContainer: React.FC<TasksContainerProps> = ({
  group,
  tasks,
  title,
  testId,
  children,
}) => {
  const canEdit = useAppSelector((state) => state.settings.canEdit)
  const droppableId = title.replace(' ', '-').toLowerCase()

  return (
    <div data-testid={testId}>
      <Droppable droppableId={droppableId} isDropDisabled={!canEdit}>
        {(provided) => (
          <Wrapper>
            <SubTitleContainer>
              {title === 'Open tasks' ? (
                <OpenCircleIcon />
              ) : (
                <ClosedCircleIcon />
              )}
              <SubTitle>{title}</SubTitle>
            </SubTitleContainer>
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {tasks.map((task, index) => {
                const identifier = `${index}-${task.id}`
                return (
                  <Draggable
                    key={identifier}
                    draggableId={identifier}
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
                          style={getItemStyle(isDragging, style)}
                          {...restDraggableProps}
                        >
                          <TaskItem
                            key={identifier}
                            task={task}
                            group={group}
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
            </div>
            {children}
          </Wrapper>
        )}
      </Droppable>
    </div>
  )
}

export default TasksContainer
