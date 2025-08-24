ALTER TABLE "orders" RENAME COLUMN "limit_price" TO "limitPrice";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "disclosed_quantity";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "stop_loss";