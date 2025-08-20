import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/db/conn";
import { instrumentsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { Order } from "@/components/order";

export default async function InstrumentDetailPage({ searchParams }: {
    searchParams: Promise<{ ticker: string; series: string }>
}) {
    const { ticker, series } = await searchParams;


    const [data] = await db
        .select()
        .from(instrumentsTable)
        .where(
            and(eq(instrumentsTable.ticker, ticker), eq(instrumentsTable.series, series))
        );

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto mt-28">
            <Card>
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                        <CardTitle className="text-2xl font-bold">
                            {data.ticker} <span className="text-gray-500">({data.series})</span>
                        </CardTitle>
                        {data.creditRating && (
                            <Badge
                                variant="outline"
                                className="mt-2 md:mt-0 inline-block max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis"
                                title={data.creditRating}
                            >
                                {data.creditRating}
                            </Badge>
                        )}
                    </div>

                    <div className="hidden md:grid grid-cols-2 gap-2 mt-4 md:mt-0 w-full md:w-fit">
                        <Order series={series} ticker={ticker} side="buy" />
                        <Order series={series} ticker={ticker} side="sell" />
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Bond Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4 text-sm">
                        <p className="text-gray-500">Type</p>
                        <p>{data.type}</p>

                        <p className="text-gray-500">Coupon Rate</p>
                        <p>{data.couponRate}%</p>

                        <p className="text-gray-500">Face Value</p>
                        <p>₹{data.faceValue}</p>

                        <p className="text-gray-500">Maturity Date</p>
                        <p>{data.maturityDate}</p>
                    </CardContent>
                </Card>

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

            <div className="grid md:hidden grid-cols-2 gap-2 mt-4 md:mt-0 w-full md:w-fit">
                <Order series={series} ticker={ticker} side="buy" />
                <Order series={series} ticker={ticker} side="sell" />
            </div>
        </div>
    );
}