-- CreateTable
CREATE TABLE "gym" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gym_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "gym_userId_idx" ON "gym"("userId");

-- AddForeignKey
ALTER TABLE "gym" ADD CONSTRAINT "gym_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
