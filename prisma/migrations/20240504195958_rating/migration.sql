/*
  Warnings:

  - You are about to drop the column `averageRating` on the `reviews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctors" ADD COLUMN     "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "averageRating";
