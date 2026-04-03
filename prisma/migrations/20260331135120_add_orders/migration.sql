-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'SHIPPED', 'COMPLETED', 'CANCELLED', 'RETURNED');

-- CreateEnum
CREATE TYPE "CancelBy" AS ENUM ('SELLER', 'USER', 'SYSTEM');

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL,
    "shippedDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "cancelBy" "CancelBy",
    "cancelReason" TEXT,
    "subtotal" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "discount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "shippingFee" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "platformFee" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "affiliateFee" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "grandTotal" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "totalHpp" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "netTotal" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "skuId" TEXT,
    "productId" TEXT,
    "sku" TEXT NOT NULL DEFAULT '',
    "mpSkuId" TEXT NOT NULL DEFAULT '',
    "productName" TEXT NOT NULL,
    "productCategory" TEXT,
    "qty" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "discount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "hpp" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "hppTotal" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_customers" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT,
    "province" TEXT,
    "city" TEXT,
    "district" TEXT,
    "zipcode" TEXT,

    CONSTRAINT "order_customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_shippings" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "name" TEXT,
    "serviceName" TEXT,
    "trackingNumber" TEXT,

    CONSTRAINT "order_shippings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_storeId_key" ON "orders"("orderNumber", "storeId");

-- CreateIndex
CREATE UNIQUE INDEX "order_customers_orderId_key" ON "order_customers"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "order_shippings_orderId_key" ON "order_shippings"("orderId");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_customers" ADD CONSTRAINT "order_customers_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_shippings" ADD CONSTRAINT "order_shippings_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
