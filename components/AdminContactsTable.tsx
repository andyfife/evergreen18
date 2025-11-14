'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  VisibilityState,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export type ContactRow = {
  id: string;
  name: string;
  email: string;
  comment: string;
  userId?: string | null;
  createdAt: string | Date;
};

type Props = { data: ContactRow[] };

// Allow optional responsive classnames on columns
type ColumnWithMeta<T> = ColumnDef<T> & {
  meta?: { headerClassName?: string; cellClassName?: string };
};

export function AdminContactsTable({ data }: Props) {
  // ───────────────────────────────────────────────────────────────
  // Local UI state
  // ───────────────────────────────────────────────────────────────
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

  const toggleExpanded = (id: string) =>
    setExpanded((s) => ({ ...s, [id]: !s[id] }));

  // ───────────────────────────────────────────────────────────────
  // Columns (defined inside to access expanded state)
  // ───────────────────────────────────────────────────────────────
  const columns = React.useMemo<ColumnWithMeta<ContactRow>[]>(
    () => [
      // Select (hide on small)
      {
        id: 'select',
        meta: {
          headerClassName: 'hidden md:table-cell',
          cellClassName: 'hidden md:table-cell',
        },
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 32,
      },

      // CreatedAt (hide on xs)
      {
        accessorKey: 'createdAt',
        meta: {
          headerClassName: 'hidden sm:table-cell',
          cellClassName: 'hidden sm:table-cell',
        },
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const v = row.getValue('createdAt') as string | Date;
          return <div>{format(new Date(v), 'PP p')}</div>;
        },
      },

      // Name
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="truncate max-w-48">{row.getValue('name')}</div>
        ),
      },

      // Email (sortable + filterable)
      {
        accessorKey: 'email',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const email = row.getValue('email') as string;
          return (
            <a
              className="underline underline-offset-2 wrap-break-word"
              href={`mailto:${email}`}
              title={email}
            >
              {email}
            </a>
          );
        },
      },

      // Comment (grows, wraps, clamp + toggle)
      {
        accessorKey: 'comment',
        header: 'Comment',
        cell: ({ row }) => {
          const id = row.original.id;
          const value = (row.getValue('comment') as string) || '';
          const isOpen = expanded[id];

          return (
            <div className="min-w-0">
              <div
                className={[
                  'whitespace-pre-wrap wrap-break-word',
                  isOpen ? '' : 'line-clamp-3',
                ].join(' ')}
                title={!isOpen ? value : undefined}
              >
                {value}
              </div>

              {value.length > 160 && (
                <button
                  type="button"
                  onClick={() => toggleExpanded(id)}
                  className="mt-1 text-xs font-medium underline underline-offset-2"
                >
                  {isOpen ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
          );
        },
      },

      // UserId (hide on <lg)
      {
        accessorKey: 'userId',
        header: 'User ID',
        meta: {
          headerClassName: 'hidden lg:table-cell',
          cellClassName: 'hidden lg:table-cell',
        },
        cell: ({ row }) => (
          <div className="truncate max-w-40">
            {(row.getValue('userId') as string) ?? '—'}
          </div>
        ),
        enableSorting: false,
      },

      // Actions
      {
        id: 'actions',
        enableHiding: false,
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const item = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(item.email)}
                >
                  Copy email
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(item.comment)}
                >
                  Copy comment
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(item.id)}
                >
                  Copy contact ID
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [expanded]
  );

  // ───────────────────────────────────────────────────────────────
  // Table instance
  // ───────────────────────────────────────────────────────────────
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  });

  // ───────────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 py-4">
        <Input
          placeholder="Filter by email…"
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(e) =>
            table.getColumn('email')?.setFilterValue(e.target.value)
          }
          className="max-w-xs"
        />
        <Input
          placeholder="Filter by name…"
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(e) =>
            table.getColumn('name')?.setFilterValue(e.target.value)
          }
          className="max-w-xs"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((c) => c.getCanHide())
              .map((c) => (
                <DropdownMenuCheckboxItem
                  key={c.id}
                  className="capitalize"
                  checked={c.getIsVisible()}
                  onCheckedChange={(v) => c.toggleVisibility(!!v)}
                >
                  {c.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile list */}
      <div className="md:hidden space-y-3">
        {data.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-6">
            No results.
          </div>
        ) : (
          data.map((r) => (
            <div key={r.id} className="rounded-lg border p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium truncate">{r.name}</div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(r.createdAt), 'PP p')}
                </div>
              </div>
              <a
                href={`mailto:${r.email}`}
                className="text-sm underline underline-offset-2 wrap-break-word"
              >
                {r.email}
              </a>
              <div className="mt-2 text-sm whitespace-pre-wrap wrap-break-word">
                <span className="line-clamp-4">{r.comment}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(r.email)}
                >
                  Copy email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(r.comment)}
                >
                  Copy comment
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-hidden rounded-md border">
        <Table className="table-fixed w-full">
          <colgroup>
            {[
              { key: 'select', className: 'w-10' },
              { key: 'createdAt', className: 'w-[12rem]' },
              { key: 'name', className: 'w-[10rem]' },
              { key: 'email', className: 'w-[14rem]' },
              { key: 'comment', className: undefined }, // grows
              { key: 'userId', className: 'w-[10rem]' },
              { key: 'actions', className: 'w-[4rem]' },
            ].map(({ key, className }) => (
              <col key={key} className={className} />
            ))}
          </colgroup>

          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead
                    key={h.id}
                    className={
                      (h.column.columnDef as any)?.meta?.headerClassName
                    }
                  >
                    {h.isPlaceholder
                      ? null
                      : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        (cell.column.columnDef as any)?.meta?.cellClassName
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer / pagination */}
      <div className="flex items-center justify-end gap-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
