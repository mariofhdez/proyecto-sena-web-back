-- DropForeignKey
ALTER TABLE `employee_settlement` DROP FOREIGN KEY `employee_settlement_period_id_fkey`;

-- DropIndex
DROP INDEX `employee_settlement_period_id_fkey` ON `employee_settlement`;

-- AlterTable
ALTER TABLE `employee_settlement` MODIFY `period_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `employee_settlement` ADD CONSTRAINT `employee_settlement_period_id_fkey` FOREIGN KEY (`period_id`) REFERENCES `payroll_period`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
