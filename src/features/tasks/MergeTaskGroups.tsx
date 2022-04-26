import '@reach/dialog/styles.css'

import React, { useRef, useState } from 'react'
import {
  AlertDialog,
  AlertDialogLabel,
  AlertDialogDescription,
} from '@reach/alert-dialog'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { tasksGroupMerged } from './tasks-slice'

type MergeTaskGroupsProps = {
  group: string
  closeDialog: () => void
}

const MergeTaskGroups: React.FC<MergeTaskGroupsProps> = ({
  group,
  closeDialog,
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null)

  const dispatch = useAppDispatch()

  const groupedTasks = useAppSelector((state) => state.tasks.storage)
  const mergeableGroups = Object.keys(groupedTasks).filter(
    (item) => item !== group
  )

  const [mergeWith, setMergeWith] = useState<string>()

  function handleChange(event: React.FormEvent<HTMLFieldSetElement>) {
    // @ts-ignore
    const selectedGroup = event.target.value
    setMergeWith(selectedGroup)
  }

  function handleMergeGroups() {
    if (!mergeWith) {
      closeDialog()
      return
    }

    dispatch(tasksGroupMerged({ group, mergeWith }))
    closeDialog()
  }

  return (
    <AlertDialog
      data-testid="merge-task-group-dialog"
      leastDestructiveRef={cancelRef}
    >
      <div className="sk-modal-content">
        <div className="sn-component">
          <div className="sk-panel">
            <div className="sk-panel-content">
              <div className="sk-panel-section">
                <AlertDialogLabel className="sk-h3 sk-panel-section-title">
                  Merging task groups
                </AlertDialogLabel>

                {mergeableGroups.length > 0 ? (
                  <>
                    <AlertDialogDescription className="sk-panel-row">
                      <p className="color-foreground">
                        Select which group you want to merge '
                        <strong>{group}</strong>' into:
                      </p>
                    </AlertDialogDescription>
                    <fieldset className="flex flex-col" onChange={handleChange}>
                      {mergeableGroups.map((item) => (
                        <label key={item} className="flex items-center mb-1">
                          <input
                            type="radio"
                            value={item}
                            checked={item === mergeWith}
                            readOnly
                          />
                          {item}
                        </label>
                      ))}
                    </fieldset>
                  </>
                ) : (
                  <AlertDialogDescription>
                    <p className="color-foreground">
                      There are no other groups to merge '
                      <strong>{group}</strong>' with.
                    </p>
                  </AlertDialogDescription>
                )}

                <div className="flex my-1 mt-4">
                  <button
                    className="sn-button small neutral"
                    onClick={closeDialog}
                    ref={cancelRef}
                  >
                    {!mergeWith ? 'Close' : 'Cancel'}
                  </button>
                  {mergeWith && (
                    <button
                      className="sn-button small ml-2 info"
                      onClick={handleMergeGroups}
                    >
                      Merge groups
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AlertDialog>
  )
}

export default MergeTaskGroups
