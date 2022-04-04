import CreateTask from './CreateTask';
import TaskList from './TaskList';
import { TaskPayload } from './../features/tasks/tasks-slice';

type TaskGroupProps = {
  group: string;
  tasks: TaskPayload[];
  isLast: boolean;
};

const TaskGroup: React.FC<TaskGroupProps> = ({ group, tasks, isLast }) => {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="task-group-container">
      <div className="task-group">
        <h1 className="group-name">{group}</h1>
        <span className="stats">
          {completedTasks}/{totalTasks}
        </span>
      </div>

      <CreateTask group={group} />
      <TaskList group={group} tasks={tasks} />

      {!isLast && <hr />}
    </div>
  );
};

export default TaskGroup;
