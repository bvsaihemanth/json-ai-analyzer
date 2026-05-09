-- CreateTable
CREATE TABLE "RuntimeRecord" (
    "id" SERIAL NOT NULL,
    "entity" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RuntimeRecord_pkey" PRIMARY KEY ("id")
);
