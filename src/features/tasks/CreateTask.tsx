import {
  ChangeEvent,
  createRef,
  KeyboardEvent,
  useEffect,
  useState,
} from 'react'
import { v4 as uuidv4 } from 'uuid'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { taskAdded } from './tasks-slice'
import BigTextInput from '../../common/components/BigTextInput'

type CreateTaskProps = {
  group: string
}

const CreateTask: React.FC<CreateTaskProps> = ({ group }) => {
  const inputRef = createRef<HTMLInputElement>()

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
      inputRef.current!.focus()
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
    <BigTextInput
      testId="create-task-input"
      onChange={onTextChange}
      onKeyPress={handleKeyPress}
      placeholder={'Type in your task, then press enter'}
      ref={inputRef}
      spellCheck={spellCheckerEnabled}
      value={taskDraft}
    />
  )
}

export default CreateTask
