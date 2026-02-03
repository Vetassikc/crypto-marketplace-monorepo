-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippingAddress" JSONB,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING_SHIPMENT',
ADD COLUMN     "trackingNumber" TEXT;
