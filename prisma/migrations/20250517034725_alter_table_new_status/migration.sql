/*
  Warnings:

  - You are about to alter the column `status` on the `payroll_new` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.

*/
-- AlterTable
ALTER TABLE `payroll_new` MODIFY `status` ENUM('OPEN', 'CLOSED', 'IN_PROGRESS') NULL;
