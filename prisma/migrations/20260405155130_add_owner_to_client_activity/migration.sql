-- AlterTable
ALTER TABLE `clientactivity` ADD COLUMN `ownerId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `ClientActivity` ADD CONSTRAINT `ClientActivity_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `Owner`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
