import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { db } from "@/db/conn"
import { instrumentsTable } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { Order } from "@/components/order"

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-6 max-w-6xl">
        <Card className="border-2">
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <CardTitle className="text-3xl font-bold">
                  {data.ticker}
                  <span className="text-muted-foreground ml-2">({data.series})</span>
                </CardTitle>
                {data.creditRating && (
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    {data.creditRating}
                  </Badge>
                )}
              </div>

              <div className="hidden lg:flex gap-3">
                <Order series={series} ticker={ticker} side="buy" />
                <Order series={series} ticker={ticker} side="sell" />
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Bond Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Type</p>
                  <p className="font-medium">{data.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Coupon Rate</p>
                  <p className="font-medium">{data.couponRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Face Value</p>
                  <p className="font-medium">₹{data.faceValue}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Maturity Date</p>
                  <p className="font-medium">{data.maturityDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Trading Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Last Price</p>
                  <p className="font-medium text-lg">₹{data.lastTradePrice}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Change</p>
                  <p className={`font-medium ${data.percentChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {data.percentChange}%
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Value</p>
                  <p className="font-medium">₹{data.valueInCrores} Cr</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">OHLC Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Open</p>
                <p className="text-xl font-semibold">₹{data.open}</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">High</p>
                <p className="text-xl font-semibold text-green-600">₹{data.high}</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Low</p>
                <p className="text-xl font-semibold text-red-600">₹{data.low}</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Close</p>
                <p className="text-xl font-semibold">₹{data.close}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex lg:hidden gap-3 justify-center">
          <Order series={series} ticker={ticker} side="buy" />
          <Order series={series} ticker={ticker} side="sell" />
        </div>
      </div>
    </div>
  )
}
