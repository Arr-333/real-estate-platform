/*
  Warnings:

  - The values [PENDING] on the enum `ClientActivity_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `clientactivity` MODIFY `status` ENUM('INQUIRY', 'SITE_VISIT', 'NEGOTIATION', 'CLOSED', 'DOCS_LEGAL_PROCESS') NOT NULL;
