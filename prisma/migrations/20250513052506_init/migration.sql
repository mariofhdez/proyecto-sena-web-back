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
CREATE TABLE `state` (
    `id` VARCHAR(2) NOT NULL,
    `name` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `city` (
    `id` VARCHAR(5) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `state_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `identification_type` (
    `id` VARCHAR(2) NOT NULL,
    `name` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_method` (
    `id` VARCHAR(3) NOT NULL,
    `description` VARCHAR(120) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employee_subtype` (
    `id` CHAR(2) NOT NULL,
    `description` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employee_type` (
    `id` VARCHAR(2) NOT NULL,
    `description` VARCHAR(120) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contract_type` (
    `id` CHAR(1) NOT NULL,
    `description` VARCHAR(25) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inability_type` (
    `id` CHAR(1) NOT NULL,
    `description` VARCHAR(45) NOT NULL,

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

    UNIQUE INDEX `payroll_concept_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employer` (
    `identification` VARCHAR(10) NOT NULL,
    `verification_digit` CHAR(1) NULL,
    `name` VARCHAR(45) NOT NULL,
    `address_id` INTEGER NOT NULL,
    `identification_type_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `employer_address_id_key`(`address_id`),
    PRIMARY KEY (`identification`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `address` VARCHAR(100) NOT NULL,
    `city_id` VARCHAR(191) NOT NULL,
    `state_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identification` VARCHAR(10) NOT NULL,
    `first_surname` VARCHAR(45) NOT NULL,
    `second_surname` VARCHAR(45) NULL,
    `first_name` VARCHAR(45) NOT NULL,
    `other_names` VARCHAR(45) NULL,
    `identification_type_id` VARCHAR(191) NOT NULL,
    `address_id` INTEGER NOT NULL,
    `payment_data_id` INTEGER NOT NULL,

    UNIQUE INDEX `employee_address_id_key`(`address_id`),
    UNIQUE INDEX `employee_payment_data_id_key`(`payment_data_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `is_active` BOOLEAN NOT NULL,
    `payment_method_id` VARCHAR(191) NOT NULL,
    `account_number` VARCHAR(45) NOT NULL,
    `bank_entity` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bank_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bank_entity` VARCHAR(100) NOT NULL,
    `account_type` VARCHAR(50) NOT NULL,
    `account_number` VARCHAR(45) NOT NULL,
    `payment_data_id` INTEGER NOT NULL,

    UNIQUE INDEX `bank_data_payment_data_id_key`(`payment_data_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contract_information` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pension_risk` BOOLEAN NOT NULL,
    `integral_salary` BOOLEAN NOT NULL,
    `salary` DOUBLE NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NULL,
    `position` VARCHAR(45) NOT NULL,
    `worker_type_id` VARCHAR(191) NOT NULL,
    `worker_subtype_id` VARCHAR(191) NOT NULL,
    `contract_type_id` VARCHAR(191) NOT NULL,
    `address_id` INTEGER NOT NULL,
    `employee_id` INTEGER NOT NULL,

    UNIQUE INDEX `contract_information_address_id_key`(`address_id`),
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
    `prefix` VARCHAR(191) NOT NULL,
    `consecutive` INTEGER NOT NULL,
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
    `news_date` DATETIME(3) NOT NULL,
    `news_quantity` INTEGER NOT NULL,
    `news_value` DOUBLE NOT NULL,
    `payroll_concept_id` INTEGER NOT NULL,
    `employee_id` INTEGER NOT NULL,
    `payment_data_id` INTEGER NOT NULL,
    `employee_settlement_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settlement_deduction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deduction_value` DOUBLE NOT NULL,
    `payroll_news_id` INTEGER NOT NULL,
    `employee_settlement_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settlement_earning` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `earning_value` DOUBLE NOT NULL,
    `payroll_news_id` INTEGER NOT NULL,
    `employee_settlement_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `absence_new` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `disability_type_id` VARCHAR(191) NOT NULL,
    `payroll_news_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `overtime_new` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `payroll_news_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `city` ADD CONSTRAINT `city_state_id_fkey` FOREIGN KEY (`state_id`) REFERENCES `state`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employer` ADD CONSTRAINT `employer_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employer` ADD CONSTRAINT `employer_identification_type_id_fkey` FOREIGN KEY (`identification_type_id`) REFERENCES `identification_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `address` ADD CONSTRAINT `address_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `city`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `address` ADD CONSTRAINT `address_state_id_fkey` FOREIGN KEY (`state_id`) REFERENCES `state`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee` ADD CONSTRAINT `employee_identification_type_id_fkey` FOREIGN KEY (`identification_type_id`) REFERENCES `identification_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee` ADD CONSTRAINT `employee_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee` ADD CONSTRAINT `employee_payment_data_id_fkey` FOREIGN KEY (`payment_data_id`) REFERENCES `payment_data`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_data` ADD CONSTRAINT `payment_data_payment_method_id_fkey` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_method`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bank_data` ADD CONSTRAINT `bank_data_payment_data_id_fkey` FOREIGN KEY (`payment_data_id`) REFERENCES `payment_data`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contract_information` ADD CONSTRAINT `contract_information_worker_type_id_fkey` FOREIGN KEY (`worker_type_id`) REFERENCES `employee_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contract_information` ADD CONSTRAINT `contract_information_worker_subtype_id_fkey` FOREIGN KEY (`worker_subtype_id`) REFERENCES `employee_subtype`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contract_information` ADD CONSTRAINT `contract_information_contract_type_id_fkey` FOREIGN KEY (`contract_type_id`) REFERENCES `contract_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contract_information` ADD CONSTRAINT `contract_information_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contract_information` ADD CONSTRAINT `contract_information_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_settlement` ADD CONSTRAINT `employee_settlement_period_id_fkey` FOREIGN KEY (`period_id`) REFERENCES `payroll_period`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_settlement` ADD CONSTRAINT `employee_settlement_contract_id_fkey` FOREIGN KEY (`contract_id`) REFERENCES `contract_information`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payroll_new` ADD CONSTRAINT `payroll_new_payroll_concept_id_fkey` FOREIGN KEY (`payroll_concept_id`) REFERENCES `payroll_concept`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payroll_new` ADD CONSTRAINT `payroll_new_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payroll_new` ADD CONSTRAINT `payroll_new_payment_data_id_fkey` FOREIGN KEY (`payment_data_id`) REFERENCES `payment_data`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payroll_new` ADD CONSTRAINT `payroll_new_employee_settlement_id_fkey` FOREIGN KEY (`employee_settlement_id`) REFERENCES `employee_settlement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settlement_deduction` ADD CONSTRAINT `settlement_deduction_payroll_news_id_fkey` FOREIGN KEY (`payroll_news_id`) REFERENCES `payroll_new`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settlement_deduction` ADD CONSTRAINT `settlement_deduction_employee_settlement_id_fkey` FOREIGN KEY (`employee_settlement_id`) REFERENCES `employee_settlement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settlement_earning` ADD CONSTRAINT `settlement_earning_payroll_news_id_fkey` FOREIGN KEY (`payroll_news_id`) REFERENCES `payroll_new`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settlement_earning` ADD CONSTRAINT `settlement_earning_employee_settlement_id_fkey` FOREIGN KEY (`employee_settlement_id`) REFERENCES `employee_settlement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `absence_new` ADD CONSTRAINT `absence_new_disability_type_id_fkey` FOREIGN KEY (`disability_type_id`) REFERENCES `inability_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `absence_new` ADD CONSTRAINT `absence_new_payroll_news_id_fkey` FOREIGN KEY (`payroll_news_id`) REFERENCES `payroll_new`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `overtime_new` ADD CONSTRAINT `overtime_new_payroll_news_id_fkey` FOREIGN KEY (`payroll_news_id`) REFERENCES `payroll_new`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
