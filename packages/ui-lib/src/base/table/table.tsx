/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-key */
import { ArrayUtils } from '@bibliotheca-dao/core-lib';
import type { AccessorFn } from '@tanstack/react-table';
import {
  Column,
  flexRender,
  getCoreRowModel,
  useReactTable,
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
  className?: string;
};

export function Table({
  data,
  columns: customColumns,
  options,
  className,
}: TableProps) {
  const [globalFilter, setGlobalFilter] = useState('');

  const defaultColumns = customColumns?.map((column) => {
    return {
      accessorKey: column.accessor,
      header: column.Header,
      cell: (info: any) => info.getValue(),
      footer: (props: { column: { id: any } }) => props.column.id,
      size: column.size || 150,
    };
  });

  const [columns] = useState<typeof defaultColumns>(() => [...defaultColumns]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className={`w-full overflow-x-scroll ${className}`}>
      {options?.search && (
        <div>
          <input
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="p-2 text-gray-600 border rounded bg-white-600/40 border-block"
            placeholder="Search..."
          />
        </div>
      )}

      <table className="w-full table-fixed">
        <thead className="uppercase bg-gray-1000/90">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  className="p-2 text-center "
                  key={header.id}
                  style={{ width: header.getSize() }}
                  colSpan={header.colSpan}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="shadow-inner">
          {table.getRowModel().rows.map((row, index) => (
            <tr
              className={`${
                !ArrayUtils.isEven(index + 1) && options?.is_striped
                  ? 'bg-gray-900/50'
                  : 'bg-gray-900'
              } hover:bg-gray-900 shadow-inner transition-all duration-30`}
              key={row.id}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  className="px-3 py-1 mx-auto text-center "
                  key={cell.id}
                  style={{ width: cell.column.getSize() }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
