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
