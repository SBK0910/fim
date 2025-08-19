import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/db/conn";
import { instrumentsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export default async function InstrumentDetailPage({
    searchParams,
}: {
    searchParams: { ticker: string; series: string };
}) {
    const ticker = searchParams.ticker;
    const series = searchParams.series;

    const [data] = await db
        .select()
        .from(instrumentsTable)
        .where(
            and(eq(instrumentsTable.ticker, ticker), eq(instrumentsTable.series, series))
        )

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto mt-28">
            {/* Header */}
            <Card>
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <CardTitle className="text-2xl font-bold">
                            {data.ticker} <span className="text-gray-500">({data.series})</span>
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-1">{data.type}</p>
                    </div>
                    <Badge variant="outline">{data.creditRating}</Badge>
                </CardHeader>
            </Card>

            {/* Trading & Bond Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bond Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Bond Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4 text-sm">
                        <p className="text-gray-500">Coupon Rate</p>
                        <p>{data.couponRate}%</p>

                        <p className="text-gray-500">Face Value</p>
                        <p>₹{data.faceValue}</p>

                        <p className="text-gray-500">Maturity Date</p>
                        <p>{data.maturityDate}</p>
                    </CardContent>
                </Card>

                {/* Trading Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Trading Info</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4 text-sm">
                        <p className="text-gray-500">Last Price</p>
                        <p>₹{data.lastTradePrice}</p>

                        <p className="text-gray-500">Change</p>
                        <p>{data.percentChange}%</p>

                        <p className="text-gray-500">Value</p>
                        <p>₹{data.valueInCrores} Cr</p>
                    </CardContent>
                </Card>
            </div>

            {/* OHLC Info */}
            <Card>
                <CardHeader>
                    <CardTitle>OHLC Data</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500">Open</p>
                        <p>₹{data.open}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">High</p>
                        <p>₹{data.high}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Low</p>
                        <p>₹{data.low}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Close</p>
                        <p>₹{data.close}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}