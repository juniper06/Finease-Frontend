import Layout from '@/components/Navbar';
import { EditExpensesForm } from '@/components/cfo/expenses/edit-form';
import { Separator } from '@/components/ui/separator';
import React from 'react';

type Props = {
  params: {
    id: string;
  };
};

export default function EditExpensesPage({ params }: Props) {
  const { id } = params;
  return (
    <Layout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl w-full">
          Edit Expenses
        </h1>
      </div>
      <Separator />
      <EditExpensesForm expensesId={id} />
    </Layout>
  );
}