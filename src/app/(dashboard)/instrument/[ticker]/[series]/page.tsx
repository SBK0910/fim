import { db } from "@/db/conn"
import { instrumentsTable } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import InstrumentHeader from "./_components/instruments-header"
import OHLCData from "./_components/ohlc-data"
import BondDetailsCard from "./_components/bond-details"
import TradingInfoCard from "./_components/trading-info-card"

interface InstrumentPageProps {
  params: { ticker: string; series: string }
}

export default async function InstrumentPage({ params }: InstrumentPageProps) {
  const { ticker, series } = params

  const [data] = await db
    .select()
    .from(instrumentsTable)
    .where(and(eq(instrumentsTable.ticker, ticker), eq(instrumentsTable.series, series)))

  if (!data) notFound()

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8 space-y-6 max-w-6xl">

        {/* Header */}
        <InstrumentHeader
          ticker={data.ticker}
          series={data.series}
          creditRating={data.creditRating ?? undefined}
          type={data.type ?? ""}
          lastTradePrice={data.lastTradePrice ?? undefined}
          percentChange={data.percentChange ?? 0}
        />

        {/* OHLC Data */}
        <OHLCData
          open={data.open ?? undefined}
          high={data.high ?? undefined}
          low={data.low ?? undefined}
          close={data.close ?? undefined}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Bond Details */}
          <BondDetailsCard
            type={data.type ?? ""}
            faceValue={data.faceValue ?? undefined}
            couponRate={data.couponRate ?? 0}
            maturityDate={data.maturityDate ?? undefined}
          />

          {/* Trading Info */}
          <TradingInfoCard
            volume={data.volume ?? undefined}
            valueInCrores={data.valueInCrores ?? undefined}
          />

        </div>
      </div>
    </div>
  )
}