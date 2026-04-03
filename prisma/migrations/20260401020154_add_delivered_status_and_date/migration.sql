-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'DELIVERED';

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "deliveredDate" TIMESTAMP(3);
