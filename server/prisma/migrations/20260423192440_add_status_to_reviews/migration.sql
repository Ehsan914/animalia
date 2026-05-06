/*
  Warnings:

  - The `published` column on the `blogs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "blogs" DROP COLUMN "published",
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false;
