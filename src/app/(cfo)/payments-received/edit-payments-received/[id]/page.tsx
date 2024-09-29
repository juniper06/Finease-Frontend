import Layout from '@/components/Navbar';
import { EditPaymentRecordForm } from '@/components/cfo/payments/edit-form';
import { Separator } from '@/components/ui/separator';
import React from 'react';

type Props = {
  params: {
    id: string;
  };
};

export default function EditPaymentRecordPage({ params }: Props) {
  const { id } = params;
  return (
    <Layout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl w-full">
          Edit Payment History
        </h1>
      </div>
      <Separator />
      <EditPaymentRecordForm paymentId={id} />
    </Layout>
  );
}