import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { taskAdded } from '../features/tasks/tasks-slice'

type CreateTaskProps = {
  group: string
}

const CreateTask: React.FC<CreateTaskProps> = ({ group }) => {
  const inputElement = useRef<HTMLInputElement | null>()

  const dispatch = useAppDispatch()

  const isRunningOnMobile = useAppSelector(
    (state) => state.settings.isRunningOnMobile
  )
  const spellCheckerEnabled = useAppSelector(
    (state) => state.settings.spellCheckerEnabled
  )

  const [taskDraft, setTaskDraft] = useState('')

  useEffect(() => {
    if (isRunningOnMobile) {
      inputElement.current!.focus()
    }
  })

  function onTextChange(event: ChangeEvent<HTMLInputElement>) {
    /**
     * Save this as the current 'un-saved' task if while we're not
     * officially saving it as an actual task yet.
     */
    const rawString = event.target.value
    setTaskDraft(rawString)
  }

  function handleKeyPress(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      const rawString = (event.target as HTMLInputElement).value
      dispatch(
        taskAdded({ task: { id: uuidv4(), description: rawString }, group })
      )
      setTaskDraft('')
    }
  }

  return (
    <div className="create-task-container" data-testid="create-task">
      <input
        className="create-task-input"
        dir="auto"
        onChange={onTextChange}
        onKeyPress={handleKeyPress}
        placeholder={'Type in your task, then press enter'}
        ref={(ref) => (inputElement.current = ref)}
        spellCheck={spellCheckerEnabled}
        type="text"
        value={taskDraft}
      />
    </div>
  )
}

export default CreateTask
