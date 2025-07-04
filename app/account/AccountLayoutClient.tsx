"use client"

import type React from "react"
import { redirect } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { AccountSidebar } from "@/components/account-sidebar"

export default function AccountLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <AccountSidebar />
        </div>
        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  )
}
