import React from 'react'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import TaskGroup from './TaskGroup'
import { GroupedTaskPayload, tasksGroupReordered } from './tasks-slice'

type TaskGroupListProps = {
  groupedTasks: GroupedTaskPayload
}

const TaskGroupList: React.FC<TaskGroupListProps> = ({ groupedTasks }) => {
  const dispatch = useAppDispatch()

  const canEdit = useAppSelector((state) => state.settings.canEdit)

  function onDragEnd(result: DropResult) {
    const droppedOutsideList = !result.destination
    if (droppedOutsideList) {
      return
    }

    const { source, destination } = result
    if (!destination) {
      return
    }

    dispatch(
      tasksGroupReordered({
        swapGroupIndex: source.index,
        withGroupIndex: destination.index,
      })
    )
  }

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
                      const { onTransitionEnd, ...restDraggableProps } =
                        draggableProps
                      return (
                        <div
                          onTransitionEnd={onTransitionEnd}
                          onDragStart={dragHandleProps?.onDragStart}
                        >
                          <TaskGroup
                            key={identifier}
                            tasks={tasks}
                            group={group}
                            innerRef={innerRef}
                            isLast={index + 1 === length}
                            isDragging={isDragging}
                            {...dragHandleProps}
                            {...restDraggableProps}
                          />
                        </div>
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
