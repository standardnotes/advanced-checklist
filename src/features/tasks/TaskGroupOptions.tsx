import { useState } from 'react'
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button'
import VisuallyHidden from '@reach/visually-hidden'

import { useAppDispatch } from '../../app/hooks'
import { tasksGroupDeleted } from './tasks-slice'

import { MoreIcon, MergeIcon, TrashIcon } from '../../common/components/icons'

import ConfirmDialog from '../../common/components/ConfirmDialog'

import MergeTaskGroups from './MergeTaskGroups'

type TaskGroupOptionsProps = {
  group: string
}

const TaskGroupOptions: React.FC<TaskGroupOptionsProps> = ({ group }) => {
  const dispatch = useAppDispatch()

  const [showMergeDialog, setShowMergeDialog] = useState(false)
  const [showTrashDialog, setShowTrashDialog] = useState(false)

  function handleOpenMergeDialog() {
    setShowMergeDialog(true)
  }

  function handleCloseMergeDialog() {
    setShowMergeDialog(false)
  }

  function handleOpenTrashDialog() {
    setShowTrashDialog(true)
  }

  function handleCloseTrashDialog() {
    setShowTrashDialog(false)
  }

  return (
    <>
      <Menu>
        <MenuButton
          data-testid="task-group-options"
          className="sn-icon-button border-contrast"
        >
          <VisuallyHidden>Options for '{group}' group</VisuallyHidden>
          <MoreIcon />
        </MenuButton>
        <MenuList>
          <MenuItem
            data-testid="move-task-group-trash"
            onSelect={handleOpenTrashDialog}
          >
            <TrashIcon />
            <span className="px-1">Move group to trash</span>
          </MenuItem>
          <MenuItem
            data-testid="merge-task-group"
            onSelect={handleOpenMergeDialog}
          >
            <MergeIcon />
            <span className="px-1">Merge into another group</span>
          </MenuItem>
        </MenuList>
      </Menu>
      {showTrashDialog && (
        <ConfirmDialog
          testId="trash-task-group-dialog"
          title="Move to trash"
          confirmButtonText="Move to trash"
          confirmButtonStyle="danger"
          confirmButtonCb={() => dispatch(tasksGroupDeleted({ group }))}
          cancelButtonCb={handleCloseTrashDialog}
        >
          Are you sure you want to move '<strong>{group}</strong>' to the trash?
        </ConfirmDialog>
      )}
      {showMergeDialog && (
        <MergeTaskGroups group={group} handleClose={handleCloseMergeDialog} />
      )}
    </>
  )
}

export default TaskGroupOptions
