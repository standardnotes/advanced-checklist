import {
  ChangeEvent,
  createRef,
  KeyboardEvent,
  useEffect,
  useState,
} from 'react'
import styled from 'styled-components'

import {
  taskDeleted,
  taskModified,
  TaskPayload,
  taskToggled,
} from './tasks-slice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import CheckBoxInput from '../../common/components/CheckBoxInput'
import TextAreaInput from '../../common/components/TextAreaInput'

type ItemContainerProps = {
  completed?: boolean
}

const Container = styled.div<ItemContainerProps>`
  display: flex;
  flex-direction: row;
  margin-bottom: 8px;

  ${({ completed }) =>
    completed &&
    `
    text-decoration: line-through;
    opacity: 0.6;
  `}
`

export type TaskItemProps = {
  task: TaskPayload
  group: string
  innerRef?: (element?: HTMLElement | null | undefined) => any
}

const TaskItem: React.FC<TaskItemProps> = ({ group, innerRef, ...props }) => {
  const textAreaRef = createRef<HTMLTextAreaElement>()

  const dispatch = useAppDispatch()

  const canEdit = useAppSelector((state) => state.settings.canEdit)
  const spellCheckEnabled = useAppSelector(
    (state) => state.settings.spellCheckerEnabled
  )

  const [task, setTask] = useState(props.task)

  function resizeTextArea(textarea: HTMLTextAreaElement | null): void {
    if (!textarea) {
      return
    }

    /**
     * Set to 1px first to reset scroll height in case it shrunk.
     */
    textarea.style.height = '1px'
    textarea.style.height = textarea.scrollHeight + 'px'
  }

  useEffect(() => {
    resizeTextArea(textAreaRef.current)
  })

  function toggleCheckboxChange() {
    dispatch(taskToggled({ id: task.id, group }))
  }

  function onTextChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const description = event.target.value
    setTask({
      ...task,
      description,
    })
  }

  function onKeyUp(event: KeyboardEvent<HTMLTextAreaElement>) {
    // Delete task if empty and enter pressed
    if (event.key === 'Enter') {
      if (task.description.length === 0) {
        dispatch(taskDeleted({ id: task.id, group }))
        event.preventDefault()
      }
    }

    const element = event.target as HTMLTextAreaElement
    resizeTextArea(element)
  }

  function onKeyPress(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter') {
      // We want to disable any action on enter.
      event.preventDefault()
    }
  }

  /**
   * Save the task after the user has stopped typing.
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(taskModified({ task, group }))
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [dispatch, task, group])

  return (
    <Container
      data-testid="task-item"
      completed={task.completed}
      ref={innerRef}
      {...props}
    >
      <CheckBoxInput
        testId="check-box-input"
        checked={task.completed}
        disabled={!canEdit}
        onChange={toggleCheckboxChange}
      />
      <TextAreaInput
        testId="text-area-input"
        disabled={!canEdit || !!task.completed}
        onChange={onTextChange}
        onKeyPress={onKeyPress}
        onKeyUp={onKeyUp}
        ref={textAreaRef}
        spellCheck={spellCheckEnabled}
        value={task.description}
      />
    </Container>
  )
}

export default TaskItem
