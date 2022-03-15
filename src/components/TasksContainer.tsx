import React from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import Task from '../models/Task';
import TaskRow, { TaskRowProps } from './TaskRow';

type TasksContainerProps = Omit<
  {
    id: string;
    description: string;
    tasks: Task[];
    canEdit: boolean;
    handleTasksReOrder: (
      containerId: string,
      source: number,
      destination: number
    ) => void;
  } & TaskRowProps,
  'task' | 'innerRef'
>;

const TasksContainer: React.FC<TasksContainerProps> = ({
  id,
  description,
  tasks,
  canEdit,
  handleTasksReOrder,
  children,
  ...rest
}) => {
  const onDragEnd = (result: DropResult) => {
    const droppedOutsideList = !result.destination;
    if (droppedOutsideList) {
      return;
    }

    handleTasksReOrder(id, result.source.index, result.destination!.index);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" isDropDisabled={!canEdit}>
        {(provided) => (
          <div className="task-section">
            <h3>{description}</h3>
            <div {...provided.droppableProps} ref={provided.innerRef} id={id}>
              {tasks.map((task, index) => {
                const identifier = `${index}-${task.content}`;
                return (
                  <Draggable
                    key={identifier}
                    draggableId={identifier}
                    index={index}
                    isDragDisabled={!canEdit}
                  >
                    {(provided) => (
                      <TaskRow
                        key={identifier}
                        task={task}
                        innerRef={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        {...rest}
                      />
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
            {children}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TasksContainer;
