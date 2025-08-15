import { char, numeric, pgTable, varchar, date, pgEnum, text, primaryKey } from "drizzle-orm/pg-core";

export const BondTypeEnum = pgEnum("bond_type_enum", ["Regular", "Zero-Coupon", "Floating", "Other"]);

export const instrumentsTable = pgTable("instruments", {
    ticker: varchar({ length: 12 }).notNull(),
    series: char({ length: 2 }).notNull(),
    type: BondTypeEnum(),
    couponRate: numeric({
        mode: "number",
        precision: 5,
        scale: 2
    }),
    faceValue: numeric({
        mode: "number",
        precision: 10,
        scale: 2
    }),
    lastTradePrice: numeric({
        mode: "number",
        precision: 10,
        scale: 2
    }),
    percentChange: numeric({
        mode: "number",
        precision: 5,
        scale: 2
    }),
    volume: numeric({
        mode: "number",
        precision: 10
    }),
    valueInCrores: numeric({
        mode: "number",
        precision: 15,
        scale: 2
    }),
    creditRating: text(),
    maturityDate: date()
},(table) => [
    primaryKey({
        columns: [table.ticker,table.series]
    })
]);