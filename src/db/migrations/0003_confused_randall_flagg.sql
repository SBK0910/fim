CREATE TYPE "public"."order_side" AS ENUM('buy', 'sell');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."order_type_enum" AS ENUM('market', 'limit');--> statement-breakpoint
CREATE TABLE "orders" (
	"order_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" text NOT NULL,
	"ticker" varchar(12) NOT NULL,
	"series" char(2) NOT NULL,
	"type" "order_type_enum" NOT NULL,
	"side" "order_side" NOT NULL,
	"quantity" numeric(12, 0) NOT NULL,
	"limit_price" numeric(12, 2),
	"status" "order_status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "quantity_positive" CHECK (quantity > 0),
	CONSTRAINT "limit_price_required" CHECK ((type = 'limit' AND limit_price IS NOT NULL) OR type = 'market')
);
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "fk_orders_instruments" FOREIGN KEY ("ticker","series") REFERENCES "public"."instruments"("ticker","series") ON DELETE no action ON UPDATE no action;