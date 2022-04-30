/* eslint-disable react/jsx-key */
import { ArrayUtils } from '@bibliotheca-dao/core-lib';
import type { AccessorFn } from '@tanstack/react-table';
import {
  Column,
  getColumnFilteredRowModelSync,
  createTable,
  getCoreRowModelSync,
  getGlobalFilteredRowModelSync,
  useTableInstance,
} from '@tanstack/react-table';
import { useReducer, useState } from 'react';
import type { ReactElement } from 'react';
import { Button } from '../button';

type ColumnType = {
  Header: string;
  id: number;
  accessor: string;
};
type TableOptions = {
  is_striped?: boolean;
  search?: boolean;
};

type TableProps = {
  data: any;
  columns: Array<any>;
  options?: TableOptions;
};

export function Table({ data, columns: customColumns, options }: TableProps) {
  const [globalFilter, setGlobalFilter] = useState('');

  const table = createTable().setRowType<typeof data>();
  const { createColumns, createDataColumn, createGroup } = table;

  const defaultColumns = createColumns(
    customColumns?.map((column) => {
      return createDataColumn(column.accessor, {
        header: column.Header,
        footer: (props: { column: { id: any } }) => props.column.id,
      });
    })
  );

  const [columns] = useState<typeof defaultColumns>(() => [...defaultColumns]);

  const instance = useTableInstance(table, {
    data,
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModelSync(),
    onGlobalFilterChange: setGlobalFilter,
    getGlobalFilteredRowModel: getGlobalFilteredRowModelSync(),
  });

  return (
    <div className="p-2">
      {options?.search && (
        <div>
          <input
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="p-2 text-gray-600 border shadow font-lg bg-gray-600/40 border-block"
            placeholder="Search all columns..."
          />
        </div>
      )}
      <div className="h-2" />
      <table
        className="w-full text-left text-white -striped"
        {...instance.getTableProps()}
      >
        <thead className="uppercase">
          {instance.getHeaderGroups().map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((header) => (
                <th
                  className="py-2 tracking-wider text-md"
                  {...header.getHeaderProps()}
                >
                  {header.isPlaceholder ? null : header.renderHeader()}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="shadow-lg" {...instance.getTableBodyProps()}>
          {instance.getRowModel().rows.map((row, index) => (
            <tr
              className={`${
                !ArrayUtils.isEven(index + 1) && options?.is_striped
                  ? 'bg-gray-900/70'
                  : 'bg-gray-800/70'
              } border-b-2 border-gray-900 hover:bg-gray-600/90`}
              {...row.getRowProps()}
            >
              {row.getVisibleCells().map((cell) => (
                <td className="px-2 py-1.5" {...cell.getCellProps()}>
                  {cell.renderCell()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
