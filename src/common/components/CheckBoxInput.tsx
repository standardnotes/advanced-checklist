import './CheckBoxInput.scss'

import { ChangeEvent, forwardRef } from 'react'

type CheckBoxInputProps = {
  checked?: boolean
  disabled?: boolean
  testId?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

const CheckBoxInput = forwardRef<HTMLInputElement, CheckBoxInputProps>(
  ({ checked, disabled, testId, onChange }, ref) => {
    return (
      <label className="checkbox-container">
        <input
          type="checkbox"
          checked={checked}
          data-testid={testId}
          disabled={disabled}
          onChange={onChange}
          ref={ref}
        />
        <span className="checkmark" />
      </label>
    )
  }
)

export default CheckBoxInput
