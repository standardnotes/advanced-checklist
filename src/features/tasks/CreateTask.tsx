import { ChangeEvent, createRef, KeyboardEvent, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import styled from 'styled-components'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { taskAdded } from './tasks-slice'

import { TextInput } from '../../common/components'
import { DottedCircleIcon } from '../../common/components/icons'

const Container = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 8px;

  & > *:first-child {
    margin-left: 1px;
    margin-right: 9px;
  }
`

type CreateTaskProps = {
  group: string
}

const CreateTask: React.FC<CreateTaskProps> = ({ group }) => {
  const inputRef = createRef<HTMLInputElement>()

  const dispatch = useAppDispatch()

  const spellCheckerEnabled = useAppSelector(
    (state) => state.settings.spellCheckerEnabled
  )
  const canEdit = useAppSelector((state) => state.settings.canEdit)

  const [taskDraft, setTaskDraft] = useState('')

  function onTextChange(event: ChangeEvent<HTMLInputElement>) {
    const rawString = event.target.value
    setTaskDraft(rawString)
  }

  function handleKeyPress(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      const rawString = (event.target as HTMLInputElement).value
      if (rawString.length === 0) {
        return
      }

      dispatch(
        taskAdded({ task: { id: uuidv4(), description: rawString }, group })
      )
      setTaskDraft('')
    }
  }

  if (!canEdit) {
    return <></>
  }

  return (
    <Container>
      <DottedCircleIcon />
      <TextInput
        testId="create-task-input"
        disabled={!canEdit}
        onChange={onTextChange}
        onKeyPress={handleKeyPress}
        placeholder={'Type a task and press enter'}
        ref={inputRef}
        spellCheck={spellCheckerEnabled}
        value={taskDraft}
      />
    </Container>
  )
}

export default CreateTask
