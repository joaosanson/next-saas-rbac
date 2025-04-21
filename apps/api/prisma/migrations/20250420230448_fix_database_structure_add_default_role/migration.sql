-- AlterTable
ALTER TABLE "invites" ALTER COLUMN "role" SET DEFAULT ARRAY['MEMBER']::"Role"[];

-- AlterTable
ALTER TABLE "members" ALTER COLUMN "role" SET DEFAULT ARRAY['MEMBER']::"Role"[];
