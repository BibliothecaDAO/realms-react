import React, { useState } from 'react';

interface TickboxProps {
  label: string;
  checked?: boolean;
  onChange: (checked: boolean) => void;
}

export const Checkbox: React.FC<TickboxProps> = ({
  label,
  checked,
  onChange,
}) => {
  return (
    <label
      className={`flex p-2 border rounded border-white/20 ${
        checked ? 'bg-green-900' : 'bg-white/30'
      } `}
    >
      <input
        type="checkbox"
        className="self-center w-4 h-4 mr-3 text-green-500 bg-green-100 border-green-300 rounded-full shadow focus:ring-green-200"
        checked={checked}
        onChange={(checked) => onChange(!checked)}
      />
      {label}
    </label>
  );
};
