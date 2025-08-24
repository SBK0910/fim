import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import OrderDialog from "@/components/orderDialog"

interface InstrumentHeaderProps {
  ticker: string
  series: string
  creditRating?: string
  type: string
  lastTradePrice?: number
  percentChange: number
}

export default function InstrumentHeader({
  ticker, series, creditRating, type, lastTradePrice, percentChange
}: InstrumentHeaderProps) {
  const isPositiveChange = percentChange >= 0

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">{ticker}</h1>
          <span className="text-xl text-muted-foreground">({series})</span>
          {creditRating && <Badge variant="outline">{creditRating}</Badge>}
        </div>
        <p className="text-muted-foreground">{type} Bond</p>

        <div className="flex items-center gap-4 mt-4">
          <div>
            <p className="text-2xl font-bold">₹{lastTradePrice?.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Last Trade Price</p>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded ${
            isPositiveChange ? 'text-green-600 bg-green-50 dark:bg-green-950/20' : 
                               'text-red-600 bg-red-50 dark:bg-red-950/20'
          }`}>
            {isPositiveChange ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span className="font-medium">{percentChange}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <OrderDialog series={series} ticker={ticker} side="buy" />
        <OrderDialog series={series} ticker={ticker} side="sell" />
      </div>
    </div>
  )
}