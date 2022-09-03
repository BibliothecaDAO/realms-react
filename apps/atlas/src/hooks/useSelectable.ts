import { useState } from 'react';

export function useSelections<T>() {
  const [selections, setSelections] = useState<T[]>([]);

  function toggleSelection(item: T) {
    setSelections(
      selections.indexOf(item) > -1
        ? selections.filter((x) => x !== item)
        : [...selections, item]
    );
  }

  function isSelected(item: T) {
    return selections.indexOf(item) > -1;
  }

  return {
    selections,
    isSelected,
    toggleSelection,
    setSelections,
  };
}
