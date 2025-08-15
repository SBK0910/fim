CREATE TYPE "public"."bond_type_enum" AS ENUM('Regular', 'Zero-Coupon', 'Floating', 'Other');--> statement-breakpoint
CREATE TABLE "instruments" (
	"ticker" varchar(12) PRIMARY KEY NOT NULL,
	"series" char(2) NOT NULL,
	"type" "bond_type_enum",
	"couponRate" numeric(5, 2),
	"faceValue" numeric(10, 2),
	"lastTradePrice" numeric(10, 2),
	"percentChange" numeric(5, 2),
	"volume" numeric(10),
	"valueInCrores" numeric(15, 2),
	"creditRating" text,
	"maturityDate" date
);
