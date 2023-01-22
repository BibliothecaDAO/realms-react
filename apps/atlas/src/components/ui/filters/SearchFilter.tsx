import Search from '@bibliotheca-dao/ui-lib/icons/frame/search_icon.svg';
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
    <div className="flex items-center justify-center w-48 gap-1 p-1 rounded-xl ">
      <button
        className="flex items-center justify-center p-2 transition-all duration-300 cursor-pointer rounded-xl h-9 hover:bg-gray-300/20"
        onClick={doSubmit}
      >
        <Search className={'w-5 fill-frame-secondary'} />
      </button>
      <input
        className="w-full px-3 py-1 text-sm font-bold leading-tight tracking-widest transition-all duration-300 bg-transparent rounded-lg shadow-md appearance-none h-9 focus:outline-none hover:bg-gray-300/10 placeholder:text-frame-primary"
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          // Clear value if empty
          if (!e.target.value && props.onSubmit) {
            props.onSubmit('');
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            doSubmit();
          }
        }}
        placeholder={props.placeholder ?? ''}
      />
    </div>
  );
}
