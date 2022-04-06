import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { tasksGroupAdded } from './../features/tasks/tasks-slice'

const CreateGroup: React.FC = () => {
  const inputElement = useRef<HTMLInputElement | null>()

  const dispatch = useAppDispatch()

  const [group, setGroup] = useState('')
  const [isCreateMode, setIsCreateMode] = useState(false)

  const canEdit = useAppSelector((state) => state.settings.canEdit)
  const spellCheckerEnabled = useAppSelector(
    (state) => state.settings.spellCheckerEnabled
  )

  function toggleMode() {
    setIsCreateMode(!isCreateMode)
  }

  function onTextChange(event: ChangeEvent<HTMLInputElement>) {
    setGroup(event.target.value)
  }

  function handleKeyPress(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      const rawString = (event.target as HTMLInputElement).value
      if (rawString.length > 0) {
        dispatch(tasksGroupAdded(rawString))
      }

      setIsCreateMode(false)
      setGroup('')
    }
  }

  if (!canEdit) {
    return <></>
  }

  return (
    <div className="create-group-container">
      {!isCreateMode && (
        <button className="create-group-button" onClick={toggleMode}>
          +
        </button>
      )}
      {isCreateMode && (
        <input
          className="create-group-input"
          type="text"
          value={group}
          onChange={onTextChange}
          onKeyPress={handleKeyPress}
          placeholder="Name your task group and press enter"
          ref={(ref) => (inputElement.current = ref)}
          spellCheck={spellCheckerEnabled}
          autoFocus
        />
      )}
    </div>
  )
}

export default CreateGroup
