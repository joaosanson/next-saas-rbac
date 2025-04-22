/*
  Warnings:

  - Made the column `organization_id` on table `invites` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organization_id` on table `members` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `members` required. This step will fail if there are existing NULL values in that column.
  - Made the column `should_attach_users_by_domain` on table `organizations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `owner_id` on table `organizations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organization_id` on table `projects` required. This step will fail if there are existing NULL values in that column.
  - Made the column `owner_id` on table `projects` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "invites" DROP CONSTRAINT "invites_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_user_id_fkey";

-- DropForeignKey
ALTER TABLE "organizations" DROP CONSTRAINT "organizations_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_owner_id_fkey";

-- AlterTable
ALTER TABLE "invites" ALTER COLUMN "organization_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "members" ALTER COLUMN "organization_id" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "should_attach_users_by_domain" SET NOT NULL,
ALTER COLUMN "owner_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "organization_id" SET NOT NULL,
ALTER COLUMN "owner_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
