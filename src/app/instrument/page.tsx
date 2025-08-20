import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { db } from "@/db/conn"
import { instrumentsTable } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { Order } from "@/components/order"
import { TrendingUp, TrendingDown, Calendar, DollarSign, BarChart3, Star, ArrowUpRight, ArrowDownRight } from "lucide-react"

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 backdrop-blur-sm">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold tracking-tight">
                        {data.ticker}
                        <span className="text-2xl text-muted-foreground ml-3">({data.series})</span>
                      </h1>
                      <p className="text-lg text-muted-foreground mt-1">{data.type} Bond</p>
                    </div>
                  </div>
                  {data.creditRating && (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <Badge variant="secondary" className="text-sm px-3 py-1.5 font-semibold">
                        {data.creditRating}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-3xl font-bold">₹{data.lastTradePrice?.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Last Trade Price</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    isPositiveChange 
                      ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800' 
                      : 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800'
                  }`}>
                    {isPositiveChange ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`font-semibold ${
                      isPositiveChange ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                    }`}>
                      {data.percentChange}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Order series={series} ticker={ticker} side="buy" />
                <Order series={series} ticker={ticker} side="sell" />
              </div>
            </div>
          </div>
        </div>

        {/* OHLC Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Open</p>
                  <p className="text-2xl font-bold">₹{data.open?.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">High</p>
                  <p className="text-2xl font-bold text-green-600">₹{data.high?.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <ArrowUpRight className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Low</p>
                  <p className="text-2xl font-bold text-red-600">₹{data.low?.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <ArrowDownRight className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Close</p>
                  <p className="text-2xl font-bold">₹{data.close?.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bond Details */}
          <Card className="lg:col-span-2 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                Bond Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-xl border">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Bond Type</p>
                    <p className="text-lg font-semibold">{data.type}</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-xl border">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Face Value</p>
                    <p className="text-lg font-semibold">₹{data.faceValue?.toLocaleString()}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-xl border">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Coupon Rate</p>
                    <p className="text-lg font-semibold">{data.couponRate}%</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-xl border">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Maturity Date</p>
                    <p className="text-lg font-semibold">
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

          {/* Trading Statistics */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                Trading Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Volume</p>
                  <p className="text-xl font-bold">{data.volume?.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Market Value</p>
                  <p className="text-xl font-bold text-green-700 dark:text-green-400">₹{data.valueInCrores} Cr</p>
                </div>
                {data.creditRating && (
                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Credit Rating</p>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <p className="text-xl font-bold text-yellow-700 dark:text-yellow-400">{data.creditRating}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Trading Buttons */}
        <div className="lg:hidden flex gap-3 justify-center pt-4">
          <Order series={series} ticker={ticker} side="buy" />
          <Order series={series} ticker={ticker} side="sell" />
        </div>
      </div>
    </div>
  )
}