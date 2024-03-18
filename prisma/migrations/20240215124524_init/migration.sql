-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_customerId_fkey";

-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "customerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
