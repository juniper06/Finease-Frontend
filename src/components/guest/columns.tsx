"use client";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import Link from "next/link";
import { Startup } from "@/actions/ceo/startup.action";

export const startupsColumns: ColumnDef<Startup>[] = [
  {
    accessorKey: "companyName",
    header: "Startup Name",
    cell: ({ row }) => (
      <Link href={`/guest/view-startup/${row.original.id}`}>
        <div className="w-full h-full cursor-pointer">
          {row.getValue("companyName")}
        </div>
      </Link>
    ),
  },
  {
    accessorKey: "industry",
    header: "Startup Industry",
    cell: ({ row }) => (
      <Link href={`/guest/view-startup/${row.original.id}`}>
        <div className="w-full h-full cursor-pointer">
          {row.getValue("industry")}
        </div>
      </Link>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => (
      <Link href={`/guest/view-startup/${row.original.id}`}>
        <div className="w-full h-full cursor-pointer">
          {row.getValue("phoneNumber")}
        </div>
      </Link>
    ),
  },
  {
    accessorKey: "contactEmail",
    header: "Contact Email",
    cell: ({ row }) => (
      <Link href={`/guest/view-startup/${row.original.id}`}>
        <div className="w-full h-full cursor-pointer">
          {row.getValue("contactEmail")}
        </div>
      </Link>
    ),
  },
  {
    accessorKey: "locationName",
    header: "Location",
    cell: ({ row }) => (
      <Link href={`/guest/view-startup/${row.original.id}`}>
        <div className="w-full h-full cursor-pointer">
          {row.getValue("locationName")}
        </div>
      </Link>
    ),
  },
];
