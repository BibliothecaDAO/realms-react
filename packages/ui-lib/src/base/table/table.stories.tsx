import type { Story, Meta } from '@storybook/react';
import { useMemo } from 'react';
import type { ReactElement } from 'react';

import { ResourceIcon } from 'base';
import { Button } from '../button';
import { Table } from './table';

export default {
  component: Table,
  title: 'Display/Table',
} as Meta;

type Row = {
  resource: ReactElement;
  baseOutput: number;
  totalOutput: number;
  level: number;
  build: ReactElement;
};

const defaultData: Row[] = [
  {
    resource: (
      <span className="flex">
        <ResourceIcon className="mr-4" size="sm" resource="Wood" />
        Wood
      </span>
    ),
    baseOutput: 100,
    totalOutput: 122,
    level: 1,
    build: <Button size="xs">Upgrade</Button>,
  },
  {
    resource: (
      <span className="flex">
        <ResourceIcon className="mr-4" size="sm" resource="Coal" />
        Coal
      </span>
    ),
    baseOutput: 105,
    totalOutput: 100,
    level: 2,
    build: <Button size="xs">Upgrade</Button>,
  },
  {
    resource: (
      <span className="flex">
        <ResourceIcon className="mr-4" size="sm" resource="Copper" />
        Copper
      </span>
    ),
    baseOutput: 100,
    totalOutput: 142,
    level: 1,
    build: <Button size="xs">Upgrade</Button>,
  },
  {
    resource: (
      <span className="flex">
        <ResourceIcon className="mr-4" size="sm" resource="Mithral" />
        Mithral
      </span>
    ),
    baseOutput: 110,
    totalOutput: 108,
    level: 3,
    build: <Button size="xs">Upgrade</Button>,
  },
];

const Template: Story = (args) => {
  const columns = [
    { Header: 'Resource', id: 'select', accessor: 'resource' },
    { Header: 'Base Output', id: 2, accessor: 'baseOutput' },
    { Header: 'Total Output', id: 3, accessor: 'totalOutput' },
    { Header: 'Lvl', id: 4, accessor: 'level' },
    { Header: 'Build', id: 5, accessor: 'build' },
  ];

  return (
    <div className="p-8 sm:w-1/2 bg-gray-400/30 ">
      <Table columns={columns} {...args} />
    </div>
  );
};

export const Striped = Template.bind({});
Striped.args = { data: defaultData, options: { is_striped: true } };

export const Default = Template.bind({});
Default.args = { data: defaultData };
