/*
  Warnings:

  - Added the required column `pet_name` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `species` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "pet_name" TEXT NOT NULL,
ADD COLUMN     "species" TEXT NOT NULL;
