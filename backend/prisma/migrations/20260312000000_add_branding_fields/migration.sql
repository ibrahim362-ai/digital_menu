-- AlterTable
ALTER TABLE "RestaurantSettings" ADD COLUMN "favicon" TEXT,
ADD COLUMN "browserTitle" TEXT NOT NULL DEFAULT 'Restaurant Management';
