-- Moderation status: convert the free-text columns in place (no data loss).
-- Unknown or differently-cased values are normalised; anything unrecognised
-- falls back to 'pending' so a human looks at it again.
CREATE TYPE "ModerationStatus" AS ENUM ('pending', 'approved', 'rejected');

UPDATE "reviews" SET "status" = lower(trim("status"));
UPDATE "reviews" SET "status" = 'pending' WHERE "status" NOT IN ('pending', 'approved', 'rejected');
ALTER TABLE "reviews"
    ALTER COLUMN "status" TYPE "ModerationStatus" USING "status"::"ModerationStatus",
    ALTER COLUMN "status" SET DEFAULT 'pending';

-- A review is public only while approved. Earlier code let a rejected or
-- pending review stay published; hide those now.
UPDATE "reviews" SET "published" = false WHERE "status" <> 'approved';

UPDATE "appointments" SET "status" = lower(trim("status"));
UPDATE "appointments" SET "status" = 'pending' WHERE "status" NOT IN ('pending', 'approved', 'rejected');
ALTER TABLE "appointments" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "appointments"
    ALTER COLUMN "status" TYPE "ModerationStatus" USING "status"::"ModerationStatus",
    ALTER COLUMN "status" SET DEFAULT 'pending';

-- Clinic profile: one row replaces contacts / emergency_contacts / locations.
-- Those tables were edited in the admin panel but never read by the public
-- site, which hard-coded its details. The row is seeded with the values the
-- live site shows, not with the old tables' contents.
CREATE TABLE "clinic_profile" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emergencyPhone" TEXT NOT NULL,
    "emergency24h" BOOLEAN NOT NULL DEFAULT true,
    "whatsappNumber" TEXT NOT NULL,
    "streetAddress" TEXT NOT NULL,
    "locality" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "landmark" TEXT NOT NULL DEFAULT '',
    "directionsUrl" TEXT NOT NULL,
    "mapEmbedUrl" TEXT NOT NULL,
    "opensAt" TEXT NOT NULL,
    "closesAt" TEXT NOT NULL,
    "facebookUrl" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clinic_profile_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "clinic_profile_single_row" CHECK ("id" = 1)
);

INSERT INTO "clinic_profile" (
    "id", "phone", "email", "emergencyPhone", "emergency24h", "whatsappNumber",
    "streetAddress", "locality", "postalCode", "landmark",
    "directionsUrl", "mapEmbedUrl", "opensAt", "closesAt", "facebookUrl", "updatedAt"
) VALUES (
    1, '+8801533829537', 'animaliavetcare25@gmail.com', '+8801879388068', true, '+8801879388068',
    'Ekushey Vobon, 677 West Shewrapara', 'Mirpur, Dhaka', '1216', 'Beside Shewrapara Metro Station',
    'https://maps.app.goo.gl/VyPFrAJ5fpv2Ghvd7',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.7949602483322!2d90.3747017!3d23.7903147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c10059bd215d%3A0xb58f1a635614a2ad!2sAnimalia%20Vet%20Care!5e0!3m2!1sen!2sbd!4v1780767823840!5m2!1sen!2sbd',
    '10:00', '21:00', 'https://www.facebook.com/profile.php?id=61588473520737', CURRENT_TIMESTAMP
);

DROP TABLE "contacts";
DROP TABLE "emergency_contacts";
DROP TABLE "locations";
