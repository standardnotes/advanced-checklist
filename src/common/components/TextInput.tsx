import { ChangeEvent, forwardRef, KeyboardEvent } from 'react'
import styled from 'styled-components'

type StyledInputProps = {
  textSize: 'normal' | 'big'
}

const StyledInput = styled.input<StyledInputProps>`
  background-color: unset;
  border: none;
  color: var(--sn-stylekit-paragraph-text-color);
  font-size: ${({ textSize }) =>
    textSize === 'big' ? '1.125rem' : 'var(--sn-stylekit-font-size-h3)'};
  font-weight: ${({ textSize }) => (textSize === 'big' ? '500' : '400')};
  height: auto;
  margin: 6px 0 6px 0;
  outline: none;
  padding: 0;
  width: 100%;

  /* Remove default shadow for iOS mobile */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  ::placeholder {
    color: var(--sn-stylekit-input-placeholder-color);
  }
`

type TextInputProps = {
  value: string
  autoFocus?: boolean
  dir?: 'ltr' | 'rtl' | 'auto'
  disabled?: boolean
  placeholder?: string
  spellCheck?: boolean
  testId?: string
  textSize?: 'normal' | 'big'
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  onKeyPress?: (event: KeyboardEvent<HTMLInputElement>) => void
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      value,
      autoFocus,
      dir = 'auto',
      disabled,
      placeholder,
      spellCheck,
      testId,
      textSize = 'normal',
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
        textSize={textSize}
        value={value}
      />
    )
  }
)
