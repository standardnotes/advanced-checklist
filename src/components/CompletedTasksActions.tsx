import { useAppDispatch } from '../app/hooks'
import {
  openAllCompleted,
  deleteAllCompleted,
} from '../features/tasks/tasks-slice'

type CompletedTasksActionsProps = {
  group: string
}

const CompletedTasksActions: React.FC<CompletedTasksActionsProps> = ({
  group,
}) => {
  const dispatch = useAppDispatch()

  function handleReOpenCompleted() {
    if (
      window.confirm(
        `Are you sure you want to reopen completed tasks on the '${group}' group?`
      )
    ) {
      dispatch(openAllCompleted({ group }))
    }
  }

  function handleDeleteCompleted() {
    if (
      window.confirm(
        `Are you sure you want to delete completed tasks on the '${group}' group?`
      )
    ) {
      dispatch(deleteAllCompleted({ group }))
    }
  }

  return (
    <div className="completed-tasks-actions-container">
      <button
        className="link-button"
        onClick={handleReOpenCompleted}
        data-testid="reopen-completed-button"
      >
        Reopen Completed
      </button>
      <button
        className="link-button"
        onClick={handleDeleteCompleted}
        data-testid="delete-completed-button"
      >
        Delete Completed
      </button>
    </div>
  )
}

export default CompletedTasksActions
