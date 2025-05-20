/*
  Warnings:

  - You are about to drop the `settlementnews` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `settlementnews` DROP FOREIGN KEY `SettlementNews_concept_id_fkey`;

-- DropForeignKey
ALTER TABLE `settlementnews` DROP FOREIGN KEY `SettlementNews_employee_id_fkey`;

-- DropForeignKey
ALTER TABLE `settlementnews` DROP FOREIGN KEY `SettlementNews_settlement_deductions_id_fkey`;

-- DropForeignKey
ALTER TABLE `settlementnews` DROP FOREIGN KEY `SettlementNews_settlement_earnings_id_fkey`;

-- DropTable
DROP TABLE `settlementnews`;

-- CreateTable
CREATE TABLE `SettlementNew` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `quantity` DOUBLE NOT NULL,
    `value` DOUBLE NOT NULL,
    `status` ENUM('OPEN', 'IN_DRAFT', 'CLOSED', 'VOID') NOT NULL,
    `concept_id` INTEGER NOT NULL,
    `employee_id` INTEGER NOT NULL,
    `settlement_earnings_id` INTEGER NULL,
    `settlement_deductions_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SettlementNew` ADD CONSTRAINT `SettlementNew_concept_id_fkey` FOREIGN KEY (`concept_id`) REFERENCES `PayrollConcept`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SettlementNew` ADD CONSTRAINT `SettlementNew_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SettlementNew` ADD CONSTRAINT `SettlementNew_settlement_earnings_id_fkey` FOREIGN KEY (`settlement_earnings_id`) REFERENCES `SettlementEarnings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SettlementNew` ADD CONSTRAINT `SettlementNew_settlement_deductions_id_fkey` FOREIGN KEY (`settlement_deductions_id`) REFERENCES `SettlementDeductions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
