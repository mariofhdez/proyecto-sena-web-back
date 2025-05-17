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
CREATE TABLE `payroll_concept` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(3) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `type` ENUM('DEVENGADO', 'DEDUCCION', 'EXTRA') NOT NULL,
    `is_salary` BOOLEAN NOT NULL,
    `is_ibc` BOOLEAN NOT NULL,
    `calculation_type` ENUM('LINEAL', 'FACTORIAL', 'NOMINAL') NOT NULL,

    UNIQUE INDEX `payroll_concept_code_key`(`code`),
    UNIQUE INDEX `payroll_concept_id_type_key`(`id`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employer` (
    `identification` VARCHAR(10) NOT NULL,
    `verification_digit` CHAR(1) NULL,
    `name` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`identification`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identification` VARCHAR(10) NOT NULL,
    `first_surname` VARCHAR(45) NOT NULL,
    `second_surname` VARCHAR(45) NULL,
    `first_name` VARCHAR(45) NOT NULL,
    `other_names` VARCHAR(45) NULL,
    `salary` DOUBLE NOT NULL,
    `transport_allowance` BOOLEAN NOT NULL,
    `is_active` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payroll_period` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employees_count` INTEGER NOT NULL,
    `total_earned` DOUBLE NOT NULL,
    `total_deduction` DOUBLE NOT NULL,
    `total_payment` DOUBLE NOT NULL,
    `settlement_date` DATETIME(3) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employee_settlement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `total_earned` DOUBLE NOT NULL,
    `total_deduction` DOUBLE NOT NULL,
    `total_payment` DOUBLE NOT NULL,
    `worked_days` INTEGER NOT NULL,
    `period_id` INTEGER NOT NULL,
    `contract_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payroll_new` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `value` DOUBLE NOT NULL,
    `payroll_concept_id` INTEGER NOT NULL,
    `payroll_concept_type` ENUM('DEVENGADO', 'DEDUCCION', 'EXTRA') NOT NULL,
    `employee_id` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settlement_deduction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deduction_value` DOUBLE NOT NULL,
    `payroll_news_id` INTEGER NOT NULL,
    `settlement_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settlement_earning` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `earning_value` DOUBLE NOT NULL,
    `payroll_news_id` INTEGER NOT NULL,
    `settlement_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `employee_settlement` ADD CONSTRAINT `employee_settlement_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_settlement` ADD CONSTRAINT `employee_settlement_period_id_fkey` FOREIGN KEY (`period_id`) REFERENCES `payroll_period`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payroll_new` ADD CONSTRAINT `payroll_new_payroll_concept_id_payroll_concept_type_fkey` FOREIGN KEY (`payroll_concept_id`, `payroll_concept_type`) REFERENCES `payroll_concept`(`id`, `type`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payroll_new` ADD CONSTRAINT `payroll_new_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settlement_deduction` ADD CONSTRAINT `settlement_deduction_payroll_news_id_fkey` FOREIGN KEY (`payroll_news_id`) REFERENCES `payroll_new`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settlement_deduction` ADD CONSTRAINT `settlement_deduction_settlement_id_fkey` FOREIGN KEY (`settlement_id`) REFERENCES `employee_settlement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settlement_earning` ADD CONSTRAINT `settlement_earning_payroll_news_id_fkey` FOREIGN KEY (`payroll_news_id`) REFERENCES `payroll_new`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settlement_earning` ADD CONSTRAINT `settlement_earning_settlement_id_fkey` FOREIGN KEY (`settlement_id`) REFERENCES `employee_settlement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
