import React from 'react'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'

import { useAppSelector } from '../../app/hooks'
import TaskGroup from './TaskGroup'
import { GroupedTaskPayload } from './tasks-slice'

type TaskGroupListProps = {
  groupedTasks: GroupedTaskPayload
}

const TaskGroupList: React.FC<TaskGroupListProps> = ({ groupedTasks }) => {
  const canEdit = useAppSelector((state) => state.settings.canEdit)

  function onDragEnd(result: DropResult) {}

  return (
    <div data-testid="task-group-list">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId={'droppable-task-group-list'}
          isDropDisabled={!canEdit}
        >
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {Object.keys(groupedTasks).map((group, index, { length }) => {
                const identifier = `${index}-${group}`
                const tasks = groupedTasks[group]
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
                      return (
                        <TaskGroup
                          key={identifier}
                          tasks={tasks}
                          group={group}
                          innerRef={innerRef}
                          isLast={index + 1 === length}
                          isDragging={isDragging}
                          {...dragHandleProps}
                          {...draggableProps}
                        />
                      )
                    }}
                  </Draggable>
                )
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

export default TaskGroupList
