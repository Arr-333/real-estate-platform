/*
  Warnings:

  - You are about to drop the `adminclient` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `adminclient` DROP FOREIGN KEY `AdminClient_ownerId_fkey`;

-- DropTable
DROP TABLE `adminclient`;
