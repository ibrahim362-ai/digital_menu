/*
  Warnings:

  - You are about to drop the column `cashierId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `Cashier` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_cashierId_fkey";

-- DropIndex
DROP INDEX "Order_cashierId_idx";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "cashierId";

-- DropTable
DROP TABLE "Cashier";
