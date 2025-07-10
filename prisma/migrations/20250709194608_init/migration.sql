-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
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
CREATE TABLE `employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identification` VARCHAR(60) NOT NULL,
    `first_name` VARCHAR(60) NOT NULL,
    `first_surname` VARCHAR(60) NOT NULL,
    `second_surname` VARCHAR(60) NULL,
    `other_names` VARCHAR(60) NULL,
    `salary` DOUBLE NOT NULL,
    `position` VARCHAR(60) NOT NULL DEFAULT 'Empleado',
    `transport_allowance` BOOLEAN NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `employee_identification_key`(`identification`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payroll_concept` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(3) NOT NULL,
    `name` VARCHAR(60) NOT NULL,
    `type` ENUM('DEVENGADO', 'DEDUCCION') NOT NULL,
    `calculation_type` ENUM('LINEAL', 'FACTORIAL', 'NOMINAL') NOT NULL,
    `base` ENUM('ALLOWANCE', 'HOURLY', 'IBC', 'INCOME', 'SALARY', 'VACATION', 'ZERO') NULL,
    `factor` DOUBLE NULL,
    `divisor` DOUBLE NULL,
    `is_income` BOOLEAN NOT NULL,
    `is_regular_concept` BOOLEAN NOT NULL,
    `is_vacation` BOOLEAN NOT NULL DEFAULT false,
    `is_ibc` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payroll_concept_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `period` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `period` VARCHAR(191) NOT NULL DEFAULT '2025-Enero',
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `payment_date` DATETIME(3) NULL,
    `status` ENUM('OPEN', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    `employees_quantity` INTEGER NULL,
    `earnings_total` DOUBLE NULL,
    `deductions_total` DOUBLE NULL,
    `total_value` DOUBLE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settlement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `status` ENUM('DRAFT', 'OPEN', 'CLOSED', 'VOID', 'NONE') NOT NULL DEFAULT 'DRAFT',
    `earnings_value` DOUBLE NOT NULL DEFAULT 0,
    `deductions_value` DOUBLE NOT NULL DEFAULT 0,
    `total_value` DOUBLE NOT NULL DEFAULT 0,
    `employee_id` INTEGER NOT NULL,
    `period_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settlement_detail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `quantity` DOUBLE NULL,
    `value` DOUBLE NOT NULL,
    `status` ENUM('DRAFT', 'OPEN', 'CLOSED', 'VOID', 'NONE') NOT NULL DEFAULT 'DRAFT',
    `settlement_id` INTEGER NOT NULL,
    `concept_id` INTEGER NOT NULL,
    `employee_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `novelty` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `quantity` DOUBLE NULL,
    `value` DOUBLE NOT NULL,
    `status` ENUM('PENDING', 'APPLIED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `employee_id` INTEGER NOT NULL,
    `concept_id` INTEGER NOT NULL,
    `period_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `settlement` ADD CONSTRAINT `settlement_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settlement` ADD CONSTRAINT `settlement_period_id_fkey` FOREIGN KEY (`period_id`) REFERENCES `period`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settlement_detail` ADD CONSTRAINT `settlement_detail_settlement_id_fkey` FOREIGN KEY (`settlement_id`) REFERENCES `settlement`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settlement_detail` ADD CONSTRAINT `settlement_detail_concept_id_fkey` FOREIGN KEY (`concept_id`) REFERENCES `payroll_concept`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settlement_detail` ADD CONSTRAINT `settlement_detail_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `novelty` ADD CONSTRAINT `novelty_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `novelty` ADD CONSTRAINT `novelty_concept_id_fkey` FOREIGN KEY (`concept_id`) REFERENCES `payroll_concept`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `novelty` ADD CONSTRAINT `novelty_period_id_fkey` FOREIGN KEY (`period_id`) REFERENCES `period`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
