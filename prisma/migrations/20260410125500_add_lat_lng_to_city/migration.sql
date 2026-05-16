/*
  Warnings:

  - You are about to alter the column `lat` on the `city` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `lng` on the `city` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `city` MODIFY `lat` VARCHAR(191) NULL,
    MODIFY `lng` VARCHAR(191) NULL;
