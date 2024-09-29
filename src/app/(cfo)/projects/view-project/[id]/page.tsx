import { ViewSpecificProject } from "@/components/cfo/projects/view-form";
import Layout from "@/components/Navbar";
import React from "react";

type Props = {
  params: {
    id: string;
  };
};

export default function ViewProject({ params }: Props) {
  const { id } = params;
  return (
    <Layout>
      <ViewSpecificProject id={id} />
    </Layout>
  );
}
