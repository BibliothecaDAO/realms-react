import { useState, useEffect } from 'react';

const resources = [
  'Wood',
  'Stone',
  'Coal',
  'Copper',
  'Obsidian',
  'Silver',
  'Ironwood',
  'Cold Iron',
  'Gold',
  'Hartwood',
  'Diamonds',
  'Sapphire',
  'Ruby',
  'Deep Crystal',
  'Ignium',
  'Ethereal Silica',
  'True Ice',
  'Twilight Quartz',
  'Alchemical Silver',
  'Adamantine',
  'Mithral',
  'Dragonhide',
];

export type Resource = typeof resources[number];

export type ResourceQty = {
  name: Resource;
  qty: string | number;
};

export const useSwapResources = () => {
  const [loading, setLoading] = useState(false);
  const [selectedResources, setSelectedResources] = useState<ResourceQty[]>([]);
  const [availableResources, setAvailableResources] =
    useState<Resource[]>(resources);

  const addSelectedResources = () => {
    setSelectedResources((prevRows) => [
      ...prevRows,
      {
        name: availableResources[0],
        qty: 0, // Random age
      },
    ]);
  };
  const removeSelectedResource = (name: Resource) => {
    setSelectedResources(
      selectedResources.filter((item) => item.name !== name)
    );
  };
  const updateSelectedResource = (
    name: string,
    qty?: number | string,
    newName?: string
  ) => {
    console.log(qty);
    console.log(name);
    console.log(selectedResources);
    setSelectedResources(
      selectedResources.map((resourceRow) => {
        console.log(resourceRow);
        if (resourceRow.name === name) {
          console.log(name);
          resourceRow.qty = qty ? qty : resourceRow.qty;
          resourceRow.name = newName ? newName : resourceRow.name;
          console.log(resourceRow);
          return { ...resourceRow };
        } else {
          return { ...resourceRow };
        }
      })
    );
  };
  const updateResourceQty = ({ name, qty }: ResourceQty) => {
    setSelectedResources(
      selectedResources.map((resourceRow) =>
        resourceRow.name === name
          ? { ...resourceRow, qty: qty }
          : { ...resourceRow }
      )
    );
  };
  const handleResourceChange = (name: string, newName: string) => {
    setSelectedResources(
      selectedResources.map((resourceRow) =>
        resourceRow.name === name
          ? { ...resourceRow, name: newName, qty: 0 }
          : { ...resourceRow }
      )
    );
  };
  useEffect(() => {
    const resourceRowNames = selectedResources.map((i) => {
      return i.name;
    });
    setAvailableResources(
      resources.filter(function (el) {
        return resourceRowNames.indexOf(el) < 0;
      })
    );
  }, [selectedResources]);
  return {
    loading,
    availableResources,
    selectedResources,
    addSelectedResources,
    removeSelectedResource,
    updateResourceQty,
    handleResourceChange,
    updateSelectedResource,
  };
};
