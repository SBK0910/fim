import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

interface TradingInfoProps {
  volume?: number
  valueInCrores?: number
}

export default function TradingInfoCard({ volume, valueInCrores }: TradingInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Trading Info
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div><p className="text-sm text-muted-foreground mb-1">Volume</p><p className="text-lg font-semibold">{volume?.toLocaleString()}</p></div>
        <div><p className="text-sm text-muted-foreground mb-1">Market Value</p><p className="text-lg font-semibold">₹{valueInCrores} Cr</p></div>
      </CardContent>
    </Card>
  )
}