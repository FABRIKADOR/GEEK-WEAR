import { AdminCheck } from "@/components/admin-check"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package } from "lucide-react"

export const metadata = {
  title: "Manage Orders - Admin - GeekWear",
}

export default function AdminOrdersPage() {
  return (
    <AdminCheck>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

        <Card>
          <CardHeader>
            <CardTitle>Orders Management</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="text-center">
              <Package className="h-16 w-16 mx-auto text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">Order management functionality will be implemented here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminCheck>
  )
}
