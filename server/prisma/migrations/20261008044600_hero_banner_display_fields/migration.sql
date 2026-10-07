-- Hero banner display fields for the redesigned banner window. Every column
-- has a default (or is nullable), so existing rows migrate unchanged:
-- no colour, no call to action, 6 seconds on screen, no discount stamp.
ALTER TABLE "hero_banners" ADD COLUMN     "bgColor" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ctaLabel" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ctaUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "discountPercent" INTEGER,
ADD COLUMN     "displaySeconds" INTEGER NOT NULL DEFAULT 6;
