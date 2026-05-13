/*
  Warnings:

  - The values [TEACHER,ACCOUNTANT] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
-- Coerce any non-ADMIN roles to ADMIN before removing them from the enum
UPDATE "User" SET "role" = 'ADMIN' WHERE "role" IN ('TEACHER', 'ACCOUNTANT');
CREATE TYPE "Role_new" AS ENUM ('ADMIN');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'ADMIN';
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'ADMIN';
