import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button'
import VisuallyHidden from '@reach/visually-hidden'

import { useAppDispatch } from '../../app/hooks'
import { tasksGroupDeleted } from './tasks-slice'

import { confirmDialog } from '../../common/utils'
import { MoreIcon, MergeIcon, TrashIcon } from '../../common/components/icons'

type TaskGroupOptionsProps = {
  group: string
}

const TaskGroupOptions: React.FC<TaskGroupOptionsProps> = ({ group }) => {
  const dispatch = useAppDispatch()

  async function handleMoveToTrash() {
    const confirmedAction = await confirmDialog({
      title: 'Move to trash',
      text: `Are you sure you want to move '<strong>${group}</strong>' to the trash?`,
      confirmButtonText: 'Move to trash',
      confirmButtonStyle: 'danger',
    })
    if (confirmedAction) {
      dispatch(tasksGroupDeleted({ group }))
    }
  }

  function handleMerge() {
    console.log('Show a prompt with available groups to merge.')
  }

  return (
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
          onSelect={handleMoveToTrash}
        >
          <TrashIcon />
          <span className="px-1">Move group to trash</span>
        </MenuItem>
        <MenuItem data-testid="merge-task-group" onSelect={handleMerge}>
          <MergeIcon />
          <span className="px-1">Merge into another group</span>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default TaskGroupOptions
