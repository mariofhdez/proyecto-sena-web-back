-- DropForeignKey
ALTER TABLE `settlement_deduction` DROP FOREIGN KEY `settlement_deduction_settlement_id_fkey`;

-- DropForeignKey
ALTER TABLE `settlement_earning` DROP FOREIGN KEY `settlement_earning_settlement_id_fkey`;

-- DropIndex
DROP INDEX `settlement_deduction_settlement_id_fkey` ON `settlement_deduction`;

-- DropIndex
DROP INDEX `settlement_earning_settlement_id_fkey` ON `settlement_earning`;

-- AlterTable
ALTER TABLE `settlement_deduction` MODIFY `settlement_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `settlement_earning` MODIFY `settlement_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `settlement_deduction` ADD CONSTRAINT `settlement_deduction_settlement_id_fkey` FOREIGN KEY (`settlement_id`) REFERENCES `employee_settlement`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settlement_earning` ADD CONSTRAINT `settlement_earning_settlement_id_fkey` FOREIGN KEY (`settlement_id`) REFERENCES `employee_settlement`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
