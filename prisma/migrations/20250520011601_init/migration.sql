/*
  Warnings:

  - You are about to drop the `settlementdeductions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `settlementearnings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `settlementdeductions` DROP FOREIGN KEY `SettlementDeductions_settlement_id_fkey`;

-- DropForeignKey
ALTER TABLE `settlementearnings` DROP FOREIGN KEY `SettlementEarnings_settlement_id_fkey`;

-- DropForeignKey
ALTER TABLE `settlementnew` DROP FOREIGN KEY `SettlementNew_settlement_deductions_id_fkey`;

-- DropForeignKey
ALTER TABLE `settlementnew` DROP FOREIGN KEY `SettlementNew_settlement_earnings_id_fkey`;

-- DropIndex
DROP INDEX `SettlementNew_settlement_deductions_id_fkey` ON `settlementnew`;

-- DropIndex
DROP INDEX `SettlementNew_settlement_earnings_id_fkey` ON `settlementnew`;

-- DropTable
DROP TABLE `settlementdeductions`;

-- DropTable
DROP TABLE `settlementearnings`;

-- CreateTable
CREATE TABLE `SettlementEarning` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` DOUBLE NOT NULL,
    `settlement_id` INTEGER NOT NULL,

    UNIQUE INDEX `SettlementEarning_settlement_id_key`(`settlement_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SettlementDeduction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` DOUBLE NOT NULL,
    `settlement_id` INTEGER NOT NULL,

    UNIQUE INDEX `SettlementDeduction_settlement_id_key`(`settlement_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SettlementEarning` ADD CONSTRAINT `SettlementEarning_settlement_id_fkey` FOREIGN KEY (`settlement_id`) REFERENCES `Settlement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SettlementDeduction` ADD CONSTRAINT `SettlementDeduction_settlement_id_fkey` FOREIGN KEY (`settlement_id`) REFERENCES `Settlement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SettlementNew` ADD CONSTRAINT `SettlementNew_settlement_earnings_id_fkey` FOREIGN KEY (`settlement_earnings_id`) REFERENCES `SettlementEarning`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SettlementNew` ADD CONSTRAINT `SettlementNew_settlement_deductions_id_fkey` FOREIGN KEY (`settlement_deductions_id`) REFERENCES `SettlementDeduction`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
