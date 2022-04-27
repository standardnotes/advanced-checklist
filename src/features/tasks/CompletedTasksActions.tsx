import { useState } from 'react'
import styled from 'styled-components'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { ConfirmDialog } from '../../common/components'

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

  const canEdit = useAppSelector((state) => state.settings.canEdit)

  const [showReopenDialog, setShowReopenDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  if (!canEdit) {
    return <></>
  }

  return (
    <div data-testid="completed-tasks-actions">
      <LinkButton
        onClick={() => setShowReopenDialog(true)}
        data-testid="reopen-completed-button"
      >
        Reopen Completed
      </LinkButton>
      <LinkButton
        onClick={() => setShowDeleteDialog(true)}
        data-testid="delete-completed-button"
      >
        Delete Completed
      </LinkButton>
      {showReopenDialog && (
        <ConfirmDialog
          testId="reopen-all-tasks-dialog"
          confirmButtonStyle="danger"
          confirmButtonCb={() => dispatch(openAllCompleted({ group }))}
          cancelButtonCb={() => setShowReopenDialog(false)}
        >
          Are you sure you want to reopen completed tasks on the '
          <strong>{group}</strong>' group?
        </ConfirmDialog>
      )}
      {showDeleteDialog && (
        <ConfirmDialog
          testId="delete-completed-tasks-dialog"
          confirmButtonStyle="danger"
          confirmButtonCb={() => dispatch(deleteAllCompleted({ group }))}
          cancelButtonCb={() => setShowDeleteDialog(false)}
        >
          Are you sure you want to delete completed tasks on the '
          <strong>{group}</strong>' group?
        </ConfirmDialog>
      )}
    </div>
  )
}

export default CompletedTasksActions
