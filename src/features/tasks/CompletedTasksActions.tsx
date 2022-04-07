import styled from 'styled-components'

import { useAppDispatch } from '../../app/hooks'
import { openAllCompleted, deleteAllCompleted } from './tasks-slice'

const LinkButton = styled.button`
  color: var(--sn-stylekit-paragraph-text-color);
  font-weight: bold;
  font-size: 10px;
  opacity: 0.3;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: inline;
  margin: 10px 10px 0 0;
  padding: 0;

  &:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
`

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
    <>
      <LinkButton
        onClick={handleReOpenCompleted}
        data-testid="reopen-completed-button"
      >
        Reopen Completed
      </LinkButton>
      <LinkButton
        onClick={handleDeleteCompleted}
        data-testid="delete-completed-button"
      >
        Delete Completed
      </LinkButton>
    </>
  )
}

export default CompletedTasksActions
