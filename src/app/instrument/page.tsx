import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { db } from "@/db/conn"
import { instrumentsTable } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { Order } from "@/components/order"
import { TrendingUp, TrendingDown, Calendar, DollarSign, BarChart3 } from "lucide-react"

export default async function InstrumentDetailPage({
  searchParams,
}: {
  searchParams: Promise<{ ticker: string; series: string }>
}) {
  const { ticker, series } = await searchParams

  const [data] = await db
    .select()
    .from(instrumentsTable)
    .where(and(eq(instrumentsTable.ticker, ticker), eq(instrumentsTable.series, series)))

  const isPositiveChange = data.percentChange >= 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-6 max-w-6xl">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{data.ticker}</h1>
              <span className="text-xl text-muted-foreground">({data.series})</span>
              {data.creditRating && (
                <Badge variant="outline">{data.creditRating}</Badge>
              )}
            </div>
            <p className="text-muted-foreground">{data.type} Bond</p>
            
            <div className="flex items-center gap-4 mt-4">
              <div>
                <p className="text-2xl font-bold">₹{data.lastTradePrice?.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Last Trade Price</p>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded ${
                isPositiveChange 
                  ? 'text-green-600 bg-green-50 dark:bg-green-950/20' 
                  : 'text-red-600 bg-red-50 dark:bg-red-950/20'
              }`}>
                {isPositiveChange ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="font-medium">{data.percentChange}%</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Order series={series} ticker={ticker} side="buy" />
            <Order series={series} ticker={ticker} side="sell" />
          </div>
        </div>

        {/* OHLC Data */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Open</p>
              <p className="text-xl font-semibold">₹{data.open?.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">High</p>
              <p className="text-xl font-semibold text-green-600">₹{data.high?.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Low</p>
              <p className="text-xl font-semibold text-red-600">₹{data.low?.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Close</p>
              <p className="text-xl font-semibold">₹{data.close?.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Bond Details */}
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
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Bond Type</p>
                    <p className="font-medium">{data.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Face Value</p>
                    <p className="font-medium">₹{data.faceValue?.toLocaleString()}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Coupon Rate</p>
                    <p className="font-medium">{data.couponRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Maturity Date</p>
                    <p className="font-medium">
                      {data.maturityDate ? new Date(data.maturityDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trading Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Trading Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Volume</p>
                <p className="text-lg font-semibold">{data.volume?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Market Value</p>
                <p className="text-lg font-semibold">₹{data.valueInCrores} Cr</p>
              </div>
              {data.creditRating && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Credit Rating</p>
                  <Badge variant="secondary" className="text-sm">{data.creditRating}</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}