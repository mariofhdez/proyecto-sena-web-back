/*
  Warnings:

  - You are about to drop the `employee_settlement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `employer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payroll_concept` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `settlement_deduction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `settlement_earning` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `settlement_new` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `employee_settlement` DROP FOREIGN KEY `employee_settlement_employee_id_fkey`;

-- DropForeignKey
ALTER TABLE `settlement_deduction` DROP FOREIGN KEY `settlement_deduction_settlement_id_fkey`;

-- DropForeignKey
ALTER TABLE `settlement_earning` DROP FOREIGN KEY `settlement_earning_settlement_id_fkey`;

-- DropForeignKey
ALTER TABLE `settlement_new` DROP FOREIGN KEY `settlement_new_employee_id_fkey`;

-- DropForeignKey
ALTER TABLE `settlement_new` DROP FOREIGN KEY `settlement_new_payroll_concept_id_fkey`;

-- DropForeignKey
ALTER TABLE `settlement_new` DROP FOREIGN KEY `settlement_new_settlement_deductions_id_fkey`;

-- DropForeignKey
ALTER TABLE `settlement_new` DROP FOREIGN KEY `settlement_new_settlement_earnings_id_fkey`;

-- DropTable
DROP TABLE `employee_settlement`;

-- DropTable
DROP TABLE `employer`;

-- DropTable
DROP TABLE `payroll_concept`;

-- DropTable
DROP TABLE `settlement_deduction`;

-- DropTable
DROP TABLE `settlement_earning`;

-- DropTable
DROP TABLE `settlement_new`;

-- CreateTable
CREATE TABLE `PayrollConcept` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(3) NOT NULL,
    `name` VARCHAR(60) NOT NULL,
    `type` ENUM('DEVENGADO', 'DEDUCCION') NOT NULL,
    `is_salary` BOOLEAN NOT NULL,
    `is_ibc` BOOLEAN NOT NULL,
    `calculation_type` ENUM('LINEAL', 'FACTORIAL', 'NOMINAL') NOT NULL,

    UNIQUE INDEX `PayrollConcept_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Settlement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `status` ENUM('DRAFT', 'OPEN', 'CLOSED', 'VOID') NOT NULL,
    `earnings_value` DOUBLE NOT NULL,
    `deductions_value` DOUBLE NOT NULL,
    `total_value` DOUBLE NOT NULL,
    `employee_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SettlementEarnings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` DOUBLE NOT NULL,
    `settlement_id` INTEGER NOT NULL,

    UNIQUE INDEX `SettlementEarnings_settlement_id_key`(`settlement_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SettlementDeductions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` DOUBLE NOT NULL,
    `settlement_id` INTEGER NOT NULL,

    UNIQUE INDEX `SettlementDeductions_settlement_id_key`(`settlement_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SettlementNews` (
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
ALTER TABLE `Settlement` ADD CONSTRAINT `Settlement_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SettlementEarnings` ADD CONSTRAINT `SettlementEarnings_settlement_id_fkey` FOREIGN KEY (`settlement_id`) REFERENCES `Settlement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SettlementDeductions` ADD CONSTRAINT `SettlementDeductions_settlement_id_fkey` FOREIGN KEY (`settlement_id`) REFERENCES `Settlement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SettlementNews` ADD CONSTRAINT `SettlementNews_concept_id_fkey` FOREIGN KEY (`concept_id`) REFERENCES `PayrollConcept`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SettlementNews` ADD CONSTRAINT `SettlementNews_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SettlementNews` ADD CONSTRAINT `SettlementNews_settlement_earnings_id_fkey` FOREIGN KEY (`settlement_earnings_id`) REFERENCES `SettlementEarnings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SettlementNews` ADD CONSTRAINT `SettlementNews_settlement_deductions_id_fkey` FOREIGN KEY (`settlement_deductions_id`) REFERENCES `SettlementDeductions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
