-- DropIndex
DROP INDEX "account_issuer_account_id_uidx";

-- AlterTable
ALTER TABLE "account" DROP COLUMN "issuer";
