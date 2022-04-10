import React, { useEffect, useState } from 'react';

interface SearchFilterProps {
  placeholder?: string;
  onSubmit?: (value: string) => void;
  defaultValue?: string;
}

export function SearchFilter(props: SearchFilterProps) {
  const [value, setValue] = useState(props.defaultValue ?? '');

  useEffect(() => {
    setValue(props.defaultValue ?? '');
  }, [props.defaultValue]);
  function doSubmit() {
    if (!props.onSubmit) {
      return;
    }
    props.onSubmit(value);
  }

  return (
    <div className="bg-black/40 p-1.5 rounded flex gap-1 justify-center items-center">
      <input
        className="w-full px-3 py-2 h-9 leading-tight text-white font-bold text-sm uppercase focus:outline-none rounded appearance-none bg-gray-800/80 hover:bg-gray-300/20 tracking-widest"
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            doSubmit();
          }
        }}
        placeholder={props.placeholder ?? ''}
      />

      <button
        className="bg-900/80 rounded flex justify-center items-center p-2 h-9 cursor-pointer hover:bg-gray-300/20"
        onClick={doSubmit}
      >
        <svg
          width="13"
          height="14"
          viewBox="0 0 13 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_566_2495)">
            <path
              d="M5.95833 10.6472C8.35157 10.6472 10.2917 8.70713 10.2917 6.31389C10.2917 3.92066 8.35157 1.98056 5.95833 1.98056C3.5651 1.98056 1.625 3.92066 1.625 6.31389C1.625 8.70713 3.5651 10.6472 5.95833 10.6472Z"
              stroke="#B1B1B1"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.3748 11.7305L9.01855 9.3743"
              stroke="#B1B1B1"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_566_2495">
              <rect
                width="13"
                height="13"
                fill="white"
                transform="translate(0 0.35556)"
              />
            </clipPath>
          </defs>
        </svg>
      </button>
    </div>
  );
}
