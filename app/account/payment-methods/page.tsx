import { CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function PaymentMethodsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Payment Methods</h2>

      <Card>
        <CardContent className="pt-6 text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="bg-muted rounded-full p-3 mb-4">
              <CreditCard className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Payment Methods</h3>
            <p className="text-muted-foreground mb-4">You haven't added any payment methods yet.</p>
            <p className="text-sm text-muted-foreground mb-6">
              Payment methods will be implemented with a payment processor like Stripe.
            </p>
            <Button disabled>Add Payment Method</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
