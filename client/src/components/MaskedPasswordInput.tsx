// src/components/MaskedPasswordInput.tsx
import React, { useState } from 'react';

interface MaskedPasswordInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}

const MaskedPasswordInput: React.FC<MaskedPasswordInputProps> = ({
  value,
  onChange,
  placeholder,
  style,
}) => {
  const [maskedValue, setMaskedValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const realValue = e.target.value;
    const prevValue = value;
    onChange(realValue);

    // Build display string: all chars masked except last
    let display = '';
    if (realValue.length > 1) {
      display = '•'.repeat(realValue.length-1) + realValue[realValue.length - 1];
    } else {
      display = realValue;
    }

    setMaskedValue(display);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Show unmasked temporarily for typing
    setMaskedValue(value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Mask all characters
    setMaskedValue('•'.repeat(value.length));
  };

  return (
    <input
      type="text"
      value={maskedValue}
      placeholder={placeholder}
      style={style}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      autoComplete="new-password"
    />
  );
};

export default MaskedPasswordInput;
