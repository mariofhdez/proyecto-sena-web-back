-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `login_attempts` INTEGER NOT NULL DEFAULT 0,
    `last_login_attempt` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
CREATE TABLE `Employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identification` VARCHAR(60) NOT NULL,
    `first_surname` VARCHAR(60) NOT NULL,
    `second_surname` VARCHAR(60) NULL,
    `first_name` VARCHAR(60) NOT NULL,
    `other_names` VARCHAR(60) NULL,
    `salary` DOUBLE NOT NULL,
    `transport_allowance` BOOLEAN NOT NULL,
    `is_active` BOOLEAN NOT NULL,

    UNIQUE INDEX `Employee_identification_key`(`identification`),
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
ALTER TABLE `Settlement` ADD CONSTRAINT `Settlement_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SettlementEarning` ADD CONSTRAINT `SettlementEarning_settlement_id_fkey` FOREIGN KEY (`settlement_id`) REFERENCES `Settlement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SettlementDeduction` ADD CONSTRAINT `SettlementDeduction_settlement_id_fkey` FOREIGN KEY (`settlement_id`) REFERENCES `Settlement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SettlementNew` ADD CONSTRAINT `SettlementNew_concept_id_fkey` FOREIGN KEY (`concept_id`) REFERENCES `PayrollConcept`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SettlementNew` ADD CONSTRAINT `SettlementNew_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SettlementNew` ADD CONSTRAINT `SettlementNew_settlement_earnings_id_fkey` FOREIGN KEY (`settlement_earnings_id`) REFERENCES `SettlementEarning`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SettlementNew` ADD CONSTRAINT `SettlementNew_settlement_deductions_id_fkey` FOREIGN KEY (`settlement_deductions_id`) REFERENCES `SettlementDeduction`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
