import React from 'react';

interface TextInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  cols?: number;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  rows = 5,
  cols = 50,
  placeholder = 'Enter your text here',
  maxLength,
  required,
  onFocus,
  onBlur,
  className,
}) => {
  return (
    <textarea
      className={className}
      value={value}
      onChange={onChange}
      rows={rows}
      cols={cols}
      placeholder={placeholder}
      maxLength={maxLength}
      required={required}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};

export default TextInput;
