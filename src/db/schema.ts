import { sql } from "drizzle-orm";
import { char, numeric, pgTable, varchar, date, pgEnum, text, primaryKey, uuid, timestamp, check, foreignKey } from "drizzle-orm/pg-core";

export const BondTypeEnum = pgEnum("bond_type_enum", [
    "Regular",
    "Zero-Coupon",
    "Floating",
    "Other"
]);

export const instrumentsTable = pgTable(
    "instruments",
    {
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
        maturityDate: date(),

        // 📊 OHLC fields
        open: numeric({
            mode: "number",
            precision: 10,
            scale: 2
        }),
        high: numeric({
            mode: "number",
            precision: 10,
            scale: 2
        }),
        low: numeric({
            mode: "number",
            precision: 10,
            scale: 2
        }),
        close: numeric({
            mode: "number",
            precision: 10,
            scale: 2
        })
    },
    (table) => [
        primaryKey({
            columns: [table.ticker, table.series]
        })
    ]
);

export const orderTypeEnum = pgEnum("order_type_enum", [
    "market",
    "limit"
])
export const orderSideEnum = pgEnum("order_side", [
    "buy",
    "sell"
]);

export const orderStatusEnum = pgEnum("order_status", [
    "pending",
    "completed",
    "cancelled"
]);

export const ordersTable = pgTable("orders", {
    orderId: uuid("order_id").primaryKey().default(sql`uuid_generate_v4()`),
    userId: text("user_id").notNull(),
    ticker: varchar("ticker", { length: 12 }).notNull(),
    series: char("series", { length: 2 }).notNull(),
    type: orderTypeEnum().notNull(),
    side: orderSideEnum().notNull(),
    quantity: numeric({ mode:"number",precision: 12, scale: 0 }).notNull(),
    limitPrice: numeric({ mode:"number",precision: 12, scale: 2 }),
    status: orderStatusEnum().default("pending").notNull(),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
}, (table) => [
    check("quantity_positive", sql`quantity > 0`),
    check(
        "limit_price_required",
        sql`(type = 'limit' AND limit_price IS NOT NULL) OR type = 'market'`
    ),
    foreignKey({
        columns: [table.ticker, table.series],
        foreignColumns: [instrumentsTable.ticker, instrumentsTable.series],
        name: "fk_orders_instruments"
    })
]);