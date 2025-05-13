/*
  Warnings:

  - You are about to drop the column `payment_data_id` on the `payroll_new` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `payroll_new` DROP FOREIGN KEY `payroll_new_employee_settlement_id_fkey`;

-- DropForeignKey
ALTER TABLE `payroll_new` DROP FOREIGN KEY `payroll_new_payment_data_id_fkey`;

-- DropIndex
DROP INDEX `payroll_new_employee_settlement_id_fkey` ON `payroll_new`;

-- DropIndex
DROP INDEX `payroll_new_payment_data_id_fkey` ON `payroll_new`;

-- AlterTable
ALTER TABLE `payroll_new` DROP COLUMN `payment_data_id`,
    MODIFY `employee_settlement_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `payroll_new` ADD CONSTRAINT `payroll_new_employee_settlement_id_fkey` FOREIGN KEY (`employee_settlement_id`) REFERENCES `employee_settlement`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
