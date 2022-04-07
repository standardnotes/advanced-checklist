import React from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'

import { useAppDispatch } from '../../app/hooks'
import TasksContainer from './TasksContainer'
import CompletedTasksActions from './CompletedTasksActions'
import { TaskPayload, tasksReordered } from './tasks-slice'

type TaskListProps = {
  group: string
  tasks: TaskPayload[]
}

const TaskList: React.FC<TaskListProps> = ({ tasks, group }) => {
  const dispatch = useAppDispatch()

  const openTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

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
          droppableId="open-tasks"
          title="Open tasks"
          tasks={openTasks}
          group={group}
        />

        <TasksContainer
          droppableId="completed-tasks"
          title="Completed tasks"
          tasks={completedTasks}
          group={group}
        >
          {completedTasks.length > 0 && <CompletedTasksActions group={group} />}
        </TasksContainer>
      </DragDropContext>
    </div>
  )
}

export default TaskList
