import { useState } from 'react'
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button'
import VisuallyHidden from '@reach/visually-hidden'

import { useAppDispatch } from '../../app/hooks'
import { tasksGroupDeleted } from './tasks-slice'

import {
  MoreIcon,
  MergeIcon,
  TrashIcon,
  RenameIcon,
} from '../../common/components/icons'

import { ConfirmDialog } from '../../common/components'

import MergeTaskGroups from './MergeTaskGroups'
import RenameTaskGroups from './RenameTaskGroups'

type TaskGroupOptionsProps = {
  group: string
}

const TaskGroupOptions: React.FC<TaskGroupOptionsProps> = ({ group }) => {
  const dispatch = useAppDispatch()

  const [showMergeDialog, setShowMergeDialog] = useState(false)
  const [showTrashDialog, setShowTrashDialog] = useState(false)
  const [showRenameDialog, setShowRenameDialog] = useState(false)

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
            onSelect={() => setShowTrashDialog(true)}
          >
            <TrashIcon />
            <span className="px-1">Move group to trash</span>
          </MenuItem>
          <MenuItem
            data-testid="merge-task-group"
            onSelect={() => setShowMergeDialog(true)}
          >
            <MergeIcon />
            <span className="px-1">Merge into another group</span>
          </MenuItem>
          <MenuItem
            data-testid="rename-task-group"
            onSelect={() => setShowRenameDialog(true)}
          >
            <RenameIcon />
            <span className="px-1">Rename</span>
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
          cancelButtonCb={() => setShowTrashDialog(false)}
        >
          Are you sure you want to move '<strong>{group}</strong>' to the trash?
        </ConfirmDialog>
      )}
      {showMergeDialog && (
        <MergeTaskGroups
          group={group}
          handleClose={() => setShowMergeDialog(false)}
        />
      )}
      {showRenameDialog && (
        <RenameTaskGroups
          group={group}
          handleClose={() => setShowRenameDialog(false)}
        />
      )}
    </>
  )
}

export default TaskGroupOptions
