import React from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'

import { useAppDispatch } from '../../app/hooks'
import { groupTasksByCompletedStatus } from '../../common/utils'
import { TaskPayload, tasksReordered } from './tasks-slice'

import TasksContainer from './TasksContainer'
import CompletedTasksActions from './CompletedTasksActions'

type TaskItemListProps = {
  group: string
  tasks: TaskPayload[]
}

const TaskItemList: React.FC<TaskItemListProps> = ({ tasks, group }) => {
  const dispatch = useAppDispatch()

  const { openTasks, completedTasks } = groupTasksByCompletedStatus(tasks)

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
        group,
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
          group={group}
        />

        <TasksContainer
          testId="completed-tasks-container"
          type="Completed"
          tasks={completedTasks}
          group={group}
        >
          {completedTasks.length > 0 && <CompletedTasksActions group={group} />}
        </TasksContainer>
      </DragDropContext>
    </div>
  )
}

export default TaskItemList
