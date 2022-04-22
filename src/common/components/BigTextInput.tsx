import { ChangeEvent, forwardRef, KeyboardEvent } from 'react'
import styled from 'styled-components'

const StyledInput = styled.input`
  background-color: var(--sn-stylekit-editor-background-color);
  border: none;
  color: var(--sn-stylekit-paragraph-text-color);
  font-size: var(--sn-stylekit-font-size-editor);
  height: 30px;
  margin: 6px 0 6px 0;
  outline: none;
  width: 100%;

  /* Remove default shadow for iOS mobile */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  ::placeholder {
    color: var(--sn-stylekit-input-placeholder-color);
  }
`

type BigTextInputProps = {
  value: string
  autoFocus?: boolean
  dir?: 'ltr' | 'rtl' | 'auto'
  disabled?: boolean
  placeholder?: string
  spellCheck?: boolean
  testId?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  onKeyPress?: (event: KeyboardEvent<HTMLInputElement>) => void
}

export const BigTextInput = forwardRef<HTMLInputElement, BigTextInputProps>(
  (
    {
      value,
      autoFocus,
      dir = 'auto',
      disabled,
      placeholder,
      spellCheck,
      testId,
      onChange,
      onKeyPress,
    },
    ref
  ) => {
    return (
      <StyledInput
        type="text"
        autoFocus={autoFocus}
        data-testid={testId}
        dir={dir}
        disabled={disabled}
        onChange={onChange}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
        ref={ref}
        spellCheck={spellCheck}
        value={value}
      />
    )
  }
)
