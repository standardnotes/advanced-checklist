import React from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'

import { useAppDispatch } from '../../app/hooks'
import { groupTasksByCompletedStatus } from '../../common/utils'
import { GroupPayload, tasksReordered } from './tasks-slice'

import TasksContainer from './TasksContainer'
import CompletedTasksActions from './CompletedTasksActions'

type TaskItemListProps = {
  group: GroupPayload
}

const TaskItemList: React.FC<TaskItemListProps> = ({ group }) => {
  const dispatch = useAppDispatch()

  const { openTasks, completedTasks } = groupTasksByCompletedStatus(group.tasks)

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
      tasksReordered({
        groupName: group.name,
        swapTaskIndex: source.index,
        withTaskIndex: destination.index,
        isSameSection: source.droppableId === destination.droppableId,
      })
    )
  }

  return (
    <div data-testid="task-list">
      <DragDropContext onDragEnd={onDragEnd}>
        <TasksContainer
          testId="open-tasks-container"
          type="Open"
          tasks={openTasks}
          groupName={group.name}
        />

        <TasksContainer
          testId="completed-tasks-container"
          type="Completed"
          tasks={completedTasks}
          groupName={group.name}
        >
          {completedTasks.length > 0 && (
            <CompletedTasksActions groupName={group.name} />
          )}
        </TasksContainer>
      </DragDropContext>
    </div>
  )
}

export default TaskItemList
