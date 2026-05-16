/*
  Warnings:

  - You are about to drop the column `email` on the `broker` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `broker` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `broker` table. All the data in the column will be lost.
  - You are about to drop the column `City` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `State` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `owner` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `owner` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `owner` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `owner` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `owner` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `owner` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `broker` DROP COLUMN `email`,
    DROP COLUMN `image`,
    DROP COLUMN `name`;

-- AlterTable
ALTER TABLE `customer` DROP COLUMN `City`,
    DROP COLUMN `State`,
    DROP COLUMN `email`,
    DROP COLUMN `name`,
    DROP COLUMN `phone`;

-- AlterTable
ALTER TABLE `owner` DROP COLUMN `address`,
    DROP COLUMN `city`,
    DROP COLUMN `email`,
    DROP COLUMN `name`,
    DROP COLUMN `phone`,
    DROP COLUMN `state`;
