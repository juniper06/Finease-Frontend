import Layout from '@/components/Navbar';
import EditCustomerForm from '@/components/cfo/customers/edit-form';
import { Separator } from '@/components/ui/separator';
import React from 'react';

type Props = {
  params: {
    id: string;
  };
};

export default function EditItemPage({ params }: Props) {
  const { id } = params;
  return (
    <Layout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl w-full">
          Edit Customer
        </h1>
      </div>
      <Separator />
      <EditCustomerForm customerId={id} />
    </Layout>
  );
}
