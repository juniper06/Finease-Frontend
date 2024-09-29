import { UsersTable } from '@/components/admin/table'
import { GuestStartupTable } from '@/components/guest/table'
import React from 'react'

export default function GuestHome() {
  return (
    <>
    <h1 className="text-lg font-semibold md:text-2xl">Guest Dashboard</h1>
    <main>
      <GuestStartupTable/>
    </main>
    </>
  )
}
