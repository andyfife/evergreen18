'use client';

import { AdminContactsTable, ContactRow } from './AdminContactsTable';

type Props = { data: ContactRow[] };

export default function AdminContactsClient({ data }: Props) {
  return <AdminContactsTable data={data} />;
}
