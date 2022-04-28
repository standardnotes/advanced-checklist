import { ChangeEvent, forwardRef, KeyboardEvent } from 'react'
import styled from 'styled-components'

const StyledTextArea = styled.textarea`
  background-color: transparent;
  border: none;
  color: inherit;
  font-size: var(--sn-stylekit-font-size-h3);
  font-weight: 300;
  outline: none;
  overflow: hidden;
  padding-top: 5px;
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

export const TextAreaInput = forwardRef<
  HTMLTextAreaElement,
  TextAreaInputProps
>(
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
