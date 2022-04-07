import {
  Draggable,
  DraggingStyle,
  Droppable,
  NotDraggingStyle,
} from 'react-beautiful-dnd'
import styled from 'styled-components'

import { useAppSelector } from '../../app/hooks'
import { TaskPayload } from './tasks-slice'
import SubTitle from '../../common/components/SubTitle'
import TaskItem from './TaskItem'

const SubContainer = styled.div`
  color: var(--sn-stylekit-paragraph-text-color);
  margin-bottom: 16px;
`

const getItemStyle = (
  isDragging: boolean,
  draggableStyle?: DraggingStyle | NotDraggingStyle
) => ({
  ...draggableStyle,
  ...(isDragging && {
    backgroundColor: 'var(--sn-stylekit-shadow-color)',
    borderColor: 'var(--sn-stylekit-border-color)',
    borderStyle: 'dotted',
    borderWidth: '3px',
  }),
})

type TasksContainerProps = {
  droppableId: string
  title: string
  tasks: TaskPayload[]
  group: string
}

const TasksContainer: React.FC<TasksContainerProps> = ({
  droppableId,
  group,
  tasks,
  title,
  children,
}) => {
  const canEdit = useAppSelector((state) => state.settings.canEdit)

  return (
    <Droppable droppableId={droppableId} isDropDisabled={!canEdit}>
      {(provided) => (
        <SubContainer>
          <SubTitle>{title}</SubTitle>
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {tasks.map((task, index) => {
              const identifier = `${index}-${task.id}-${task.description}`
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
        </SubContainer>
      )}
    </Droppable>
  )
}

export default TasksContainer
