import type React from "react"
import AccountLayoutClient from "./AccountLayoutClient"

export const metadata = {
  title: "My Account - GeekWear",
  description: "Manage your GeekWear account, orders, and profile.",
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AccountLayoutClient children={children} />
}
