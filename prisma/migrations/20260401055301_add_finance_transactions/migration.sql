-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('ORDER', 'ADS', 'LOGISTIC', 'WITHDRAW');

-- CreateEnum
CREATE TYPE "CashFlow" AS ENUM ('IN', 'OUT');

-- CreateTable
CREATE TABLE "finance_transactions" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "cashFlow" "CashFlow" NOT NULL,
    "source" TEXT,
    "referenceId" TEXT,
    "amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "platformFee" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "affiliateFee" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "shippingFee" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "netAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finance_transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "finance_transactions" ADD CONSTRAINT "finance_transactions_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
