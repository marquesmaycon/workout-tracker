-- Replace the schedule item rotation (order_index) with a direct weekday
-- assignment, and drop the now-redundant schedule.weekdays list.
ALTER TABLE "schedule_item" ADD COLUMN "weekday" INTEGER;

-- Backfill weekday from the schedule's weekday list, matching each item's
-- previous order_index to the same position in schedule.weekdays.
UPDATE "schedule_item" AS si
SET "weekday" = s."weekdays"[si."order_index" + 1]
FROM "schedule" AS s
WHERE s."id" = si."schedule_id";

ALTER TABLE "schedule_item" ALTER COLUMN "weekday" SET NOT NULL;

DROP INDEX "schedule_item_schedule_id_order_index_key";
ALTER TABLE "schedule_item" DROP COLUMN "order_index";
ALTER TABLE "schedule" DROP COLUMN "weekdays";

CREATE UNIQUE INDEX "schedule_item_schedule_id_weekday_key" ON "schedule_item"("schedule_id", "weekday");
