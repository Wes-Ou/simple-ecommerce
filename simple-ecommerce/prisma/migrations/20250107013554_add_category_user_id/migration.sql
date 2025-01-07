-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "userId" INTEGER NOT NULL DEFAULT 5;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
