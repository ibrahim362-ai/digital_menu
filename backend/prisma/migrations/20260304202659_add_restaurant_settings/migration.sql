-- CreateTable
CREATE TABLE "RestaurantSettings" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'My Restaurant',
    "subname" TEXT,
    "logo" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#d97706',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantSettings_pkey" PRIMARY KEY ("id")
);
