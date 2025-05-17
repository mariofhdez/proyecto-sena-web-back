/*
  Warnings:

  - Made the column `status` on table `payroll_new` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `payroll_new` MODIFY `status` ENUM('OPEN', 'CLOSED', 'IN_PROGRESS') NOT NULL;
