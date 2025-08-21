export type Instrument = {
	ticker: string
	series: string
	type: "Regular" | "Zero-Coupon" | "Floating" | "Other" | null
	couponRate: number | null
	faceValue: number | null
	lastTradePrice: number | null
	percentChange: number | null
	volume: number | null
	valueInCrores: number | null
	creditRating: string | null
	maturityDate: string | null
}

export type Order = {
  orderId: string;
  userId: string;
  ticker: string;
  series: string;
  type: "market" | "limit";
  side: "buy" | "sell";
  quantity: number;
  limitPrice?: number | null;
  status: "pending" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
};