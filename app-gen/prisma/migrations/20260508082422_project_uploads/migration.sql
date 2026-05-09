/*
  Warnings:

  - You are about to drop the column `runtimeConfig` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `RuntimeRecord` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "RuntimeRecord" DROP CONSTRAINT "RuntimeRecord_projectId_fkey";

-- DropForeignKey
ALTER TABLE "RuntimeRecord" DROP CONSTRAINT "RuntimeRecord_userId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "runtimeConfig";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

-- DropTable
DROP TABLE "RuntimeRecord";

-- CreateTable
CREATE TABLE "RuntimeData" (
    "id" SERIAL NOT NULL,
    "entity" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "projectId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RuntimeData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectUpload" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "projectId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectUpload_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RuntimeData" ADD CONSTRAINT "RuntimeData_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUpload" ADD CONSTRAINT "ProjectUpload_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
