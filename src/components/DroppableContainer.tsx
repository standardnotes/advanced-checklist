import { Draggable, Droppable } from 'react-beautiful-dnd';

import { useAppSelector } from '../app/hooks';
import TaskItem from './TaskItem';
import { TaskPayload } from '../features/tasks/tasks-slice';

type DroppableContainerProps = {
  droppableId: string;
  title: string;
  tasks: TaskPayload[];
  group: string;
};

const DroppableContainer: React.FC<DroppableContainerProps> = ({
  droppableId,
  group,
  tasks,
  title,
  children,
}) => {
  const canEdit = useAppSelector((state) => state.settings.canEdit);

  return (
    <Droppable droppableId={droppableId} isDropDisabled={!canEdit}>
      {(provided) => (
        <div className="tasks-container">
          <h3>{title}</h3>
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {tasks.map((task, index) => {
              const identifier = `${index}-${task.id}-${task.description}`;
              return (
                <Draggable
                  key={identifier}
                  draggableId={identifier}
                  index={index}
                  isDragDisabled={!canEdit}
                >
                  {(provided) => (
                    <TaskItem
                      key={identifier}
                      task={task}
                      group={group}
                      innerRef={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
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
  );
};

export default DroppableContainer;
