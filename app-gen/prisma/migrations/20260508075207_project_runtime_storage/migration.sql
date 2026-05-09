-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "analysis" JSONB,
ADD COLUMN     "config" JSONB,
ADD COLUMN     "generatedSql" TEXT;
