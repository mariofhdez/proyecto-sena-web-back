/*
  Warnings:

  - You are about to drop the column `payroll_concept_type` on the `payroll_new` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `payroll_new` DROP FOREIGN KEY `payroll_new_payroll_concept_id_payroll_concept_type_fkey`;

-- DropIndex
DROP INDEX `payroll_concept_id_type_key` ON `payroll_concept`;

-- DropIndex
DROP INDEX `payroll_new_payroll_concept_id_payroll_concept_type_fkey` ON `payroll_new`;

-- AlterTable
ALTER TABLE `payroll_new` DROP COLUMN `payroll_concept_type`;

-- AddForeignKey
ALTER TABLE `payroll_new` ADD CONSTRAINT `payroll_new_payroll_concept_id_fkey` FOREIGN KEY (`payroll_concept_id`) REFERENCES `payroll_concept`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
