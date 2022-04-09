import React from 'react'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'

import { useAppSelector } from '../../app/hooks'
import TaskGroup from './TaskGroup'

const TaskGroupList: React.FC = () => {
  const canEdit = useAppSelector((state) => state.settings.canEdit)
  const groupedTasks = useAppSelector((state) => state.tasks.storage)

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
                          tasks={tasks}
                          group={group}
                          innerRef={innerRef}
                          isLast={index + 1 === length}
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
