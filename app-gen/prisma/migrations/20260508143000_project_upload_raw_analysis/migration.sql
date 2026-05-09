-- Remove the accidental one-project-per-user constraint if it exists.
ALTER TABLE "Project" DROP CONSTRAINT IF EXISTS "project_userId_key";
ALTER TABLE "Project" DROP CONSTRAINT IF EXISTS "Project_userId_key";
DROP INDEX IF EXISTS "project_userId_key";
DROP INDEX IF EXISTS "Project_userId_key";

-- Keep the original uploaded JSON and its analysis snapshot with each upload.
ALTER TABLE "ProjectUpload"
ADD COLUMN IF NOT EXISTS "rawContent" JSONB,
ADD COLUMN IF NOT EXISTS "analysis" JSONB;
