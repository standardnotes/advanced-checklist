import { useAppDispatch } from '../app/hooks';
import {
  reOpenAllCompleted,
  deleteAllCompleted,
} from '../features/tasks/tasks-slice';

type CompletedTasksActionsProps = {
  group: string;
};

const CompletedTasksActions: React.FC<CompletedTasksActionsProps> = ({
  group,
}) => {
  const dispatch = useAppDispatch();

  function handleReOpenCompleted() {
    if (window.confirm('Are you sure you want to reopen completed tasks?')) {
      dispatch(reOpenAllCompleted({ group }));
    }
  }

  function handleDeleteCompleted() {
    if (window.confirm('Are you sure you want to delete completed tasks?')) {
      dispatch(deleteAllCompleted({ group }));
    }
  }

  return (
    <div className="completed-tasks-actions-container">
      <button className="link-button" onClick={handleReOpenCompleted}>
        Reopen Completed
      </button>
      <button className="link-button" onClick={handleDeleteCompleted}>
        Delete Completed
      </button>
    </div>
  );
};

export default CompletedTasksActions;
