-- CreateTable
CREATE TABLE "trades_operations" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "moment" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "priceUSD" DECIMAL(65,30) NOT NULL,
    "timestamp" DECIMAL(65,30) NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trades_operations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trades_operations_orderId_key" ON "trades_operations"("orderId");
