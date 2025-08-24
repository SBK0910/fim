import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"

interface BondDetailsProps {
  type: string
  faceValue?: number
  couponRate: number
  maturityDate?: string
}

export default function BondDetailsCard({ type, faceValue, couponRate, maturityDate }: BondDetailsProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Bond Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div><p className="text-sm text-muted-foreground mb-1">Bond Type</p><p className="font-medium">{type}</p></div>
            <div><p className="text-sm text-muted-foreground mb-1">Face Value</p><p className="font-medium">₹{faceValue?.toLocaleString()}</p></div>
          </div>
          <div className="space-y-4">
            <div><p className="text-sm text-muted-foreground mb-1">Coupon Rate</p><p className="font-medium">{couponRate}%</p></div>
            <div><p className="text-sm text-muted-foreground mb-1">Maturity Date</p><p className="font-medium">{maturityDate ? new Date(maturityDate).toLocaleDateString() : 'N/A'}</p></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}