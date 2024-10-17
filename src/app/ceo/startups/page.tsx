import { StartupTable } from "@/components/ceo/startup/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function ItemsPage() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl w-full">All Startups</h1>
        {/* <Button className="flex gap-2 text-md" asChild>
          <Link href="/ceo/startups/add-startup">
            <CirclePlus className="h-6 w-6" />
            New
          </Link>
        </Button> */}
      </div>
      <Separator />
      <StartupTable/>
      </>
  );
}
