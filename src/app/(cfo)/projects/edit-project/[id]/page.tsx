import { EditProjectForm } from '@/components/cfo/projects/edit-form';
import Layout from '@/components/Navbar';
import { Separator } from '@/components/ui/separator';
import React from 'react';

type Props = {
  params: {
    id: string;
  };
};

export default function EditProjectPage({ params }: Props) {
  const { id } = params;
  return (
    <Layout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl w-full">
          Edit Project
        </h1>
      </div>
      <Separator />
      <EditProjectForm projectId={id} />
    </Layout>
  );
}
