import { GuestViewStartup } from "@/components/guest/startup-view-form";
import React from "react";

type Props = {
  params: {
    id: string;
  };
};

export default function ViewStartupPage({ params }: Props) {
  const { id } = params;
  return (
    <>
      <GuestViewStartup id={id} />
    </>
  );
}
