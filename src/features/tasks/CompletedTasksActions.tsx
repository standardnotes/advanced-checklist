import { useState } from 'react'
import styled from 'styled-components'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { ConfirmDialog } from '../../common/components'

import { openAllCompleted, deleteAllCompleted } from './tasks-slice'

const LinkButton = styled.button`
  background-color: var(--sn-stylekit-secondary-background-color);
  border-radius: 4px;
  border-style: none;
  color: var(--sn-stylekit-paragraph-text-color);
  cursor: pointer;
  display: inline;
  font-size: var(--sn-stylekit-font-size-h6);
  font-weight: 400;
  height: 25px;
  margin: 10px 10px 0 0;
  opacity: 0.96;
  padding: 4px 10px 4px;

  &:hover {
    opacity: 0.8;
    text-decoration: none;
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
