import Layout from '@/components/Navbar';
import { EditInvoiceForm } from '@/components/cfo/invoices/edit-form';
import EditItemForm from '@/components/cfo/items/edit-form';
import { Separator } from '@/components/ui/separator';
import React from 'react';

type Props = {
  params: {
    id: string;
  };
};

export default function EditInvoicePage({ params }: Props) {
  const { id } = params;
  return (
    <Layout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl w-full">
          Edit Invoice
        </h1>
      </div>
      <Separator />
      <EditInvoiceForm invoiceId={id} />
    </Layout>
  );
}
