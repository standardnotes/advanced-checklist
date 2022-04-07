import { ChangeEvent, forwardRef, KeyboardEvent } from 'react'
import styled from 'styled-components'

const StyledTextArea = styled.textarea`
  background-color: transparent;
  border: none;
  color: var(--sn-stylekit-editor-foreground-color);
  font-family: sans-serif;
  font-size: var(--sn-stylekit-font-size-editor);
  outline: none;
  overflow: hidden;
  resize: none;
  width: 100%;
`

type TextAreaInputProps = {
  value: string
  dir?: 'ltr' | 'rtl' | 'auto'
  disabled?: boolean
  spellCheck?: boolean
  testId?: string
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void
  onKeyPress?: (event: KeyboardEvent<HTMLTextAreaElement>) => void
  onKeyUp?: (event: KeyboardEvent<HTMLTextAreaElement>) => void
}

const TextAreaInput = forwardRef<HTMLTextAreaElement, TextAreaInputProps>(
  (
    {
      value,
      dir = 'auto',
      disabled,
      spellCheck,
      testId,
      onChange,
      onKeyPress,
      onKeyUp,
    },
    ref
  ) => {
    return (
      <StyledTextArea
        data-testid={testId}
        dir={dir}
        disabled={disabled}
        onChange={onChange}
        onKeyPress={onKeyPress}
        onKeyUp={onKeyUp}
        ref={ref}
        spellCheck={spellCheck}
        value={value}
      />
    )
  }
)

export default TextAreaInput
