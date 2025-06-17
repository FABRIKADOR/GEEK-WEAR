"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Package, MapPin, CreditCard, Heart, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

export function AccountSidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  const menuItems = [
    {
      title: "Profile",
      href: "/account/profile",
      icon: User,
    },
    {
      title: "Orders",
      href: "/account/orders",
      icon: Package,
    },
    {
      title: "Addresses",
      href: "/account/addresses",
      icon: MapPin,
    },
    {
      title: "Payment Methods",
      href: "/account/payment-methods",
      icon: CreditCard,
    },
    {
      title: "Wishlist",
      href: "/account/wishlist",
      icon: Heart,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </div>

      <div className="border-t pt-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
