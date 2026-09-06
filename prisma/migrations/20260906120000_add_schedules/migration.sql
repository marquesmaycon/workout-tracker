CREATE TABLE "schedule" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "weekdays" INTEGER[] NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "schedule_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "schedule_item" (
    "id" TEXT NOT NULL,
    "schedule_id" TEXT NOT NULL,
    "workout_id" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "schedule_item_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "workout_session" ADD COLUMN "schedule_item_id" TEXT;

CREATE INDEX "schedule_user_id_idx" ON "schedule"("user_id");
-- Prisma does not express this partial index in the schema. Keep it in migrations.
CREATE UNIQUE INDEX "schedule_one_active_per_user" ON "schedule"("user_id") WHERE "is_active" = true;
CREATE UNIQUE INDEX "schedule_item_schedule_id_order_index_key" ON "schedule_item"("schedule_id", "order_index");
CREATE INDEX "schedule_item_workout_id_idx" ON "schedule_item"("workout_id");
CREATE INDEX "workout_session_schedule_item_id_idx" ON "workout_session"("schedule_item_id");

ALTER TABLE "schedule" ADD CONSTRAINT "schedule_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "schedule_item" ADD CONSTRAINT "schedule_item_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "schedule_item" ADD CONSTRAINT "schedule_item_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "workout_session" ADD CONSTRAINT "workout_session_schedule_item_id_fkey" FOREIGN KEY ("schedule_item_id") REFERENCES "schedule_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
