-- CreateTable
CREATE TABLE `users` (
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

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identification` VARCHAR(60) NOT NULL,
    `first_surname` VARCHAR(60) NOT NULL,
    `second_surname` VARCHAR(60) NULL,
    `first_name` VARCHAR(60) NOT NULL,
    `other_names` VARCHAR(60) NULL,
    `salary` DOUBLE NOT NULL,
    `position` VARCHAR(60) NOT NULL DEFAULT 'Empleado',
    `transport_allowance` BOOLEAN NOT NULL,
    `is_active` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `employees_identification_key`(`identification`),
    INDEX `employees_identification_idx`(`identification`),
    INDEX `employees_is_active_idx`(`is_active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `concepts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(3) NOT NULL,
    `name` VARCHAR(60) NOT NULL,
    `type` ENUM('DEVENGADO', 'DEDUCCION') NOT NULL,
    `calculation_type` ENUM('LINEAL', 'FACTORIAL', 'NOMINAL') NOT NULL,
    `base` ENUM('ALLOWANCE', 'HOURLY', 'IBC', 'INCOME', 'SALARY', 'VACATION', 'ZERO') NULL,
    `factor` DOUBLE NULL,
    `divisor` DOUBLE NULL,
    `is_income` BOOLEAN NOT NULL,
    `is_vacation` BOOLEAN NOT NULL,
    `is_ibc` BOOLEAN NOT NULL,
    `is_regular_concept` BOOLEAN NOT NULL,

    UNIQUE INDEX `concepts_code_key`(`code`),
    INDEX `concepts_code_idx`(`code`),
    INDEX `concepts_is_regular_concept_idx`(`is_regular_concept`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `periods` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `period` VARCHAR(191) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `payment_date` DATETIME(3) NULL,
    `status` ENUM('OPEN', 'CLOSED') NOT NULL,
    `employees_quantity` INTEGER NULL,
    `earnings_total` DOUBLE NULL,
    `deductions_total` DOUBLE NULL,
    `total_value` DOUBLE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `periods_start_date_end_date_idx`(`start_date`, `end_date`),
    INDEX `periods_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `novelties` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `quantity` DOUBLE NULL,
    `value` DOUBLE NOT NULL,
    `status` ENUM('PENDING', 'APPLIED', 'CANCELLED') NOT NULL,
    `concept_id` INTEGER NOT NULL,
    `employee_id` INTEGER NOT NULL,
    `period_id` INTEGER NULL,

    INDEX `novelties_date_idx`(`date`),
    INDEX `novelties_status_idx`(`status`),
    INDEX `novelties_employee_id_period_id_idx`(`employee_id`, `period_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settlements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NOT NULL,
    `period_id` INTEGER NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `status` ENUM('DRAFT', 'OPEN', 'CLOSED', 'VOID') NOT NULL,
    `earnings_value` DOUBLE NOT NULL,
    `deductions_value` DOUBLE NOT NULL,
    `total_value` DOUBLE NOT NULL,

    INDEX `settlements_employee_id_period_id_idx`(`employee_id`, `period_id`),
    INDEX `settlements_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settlement_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `settlement_id` INTEGER NOT NULL,
    `concept_id` INTEGER NOT NULL,
    `employee_id` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `quantity` INTEGER NULL,
    `value` DOUBLE NOT NULL,
    `status` ENUM('NONE', 'OPEN', 'DRAFT', 'CLOSED', 'VOID') NOT NULL,

    INDEX `settlement_details_settlement_id_idx`(`settlement_id`),
    INDEX `settlement_details_concept_id_idx`(`concept_id`),
    INDEX `settlement_details_employee_id_idx`(`employee_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `novelties` ADD CONSTRAINT `novelties_concept_id_fkey` FOREIGN KEY (`concept_id`) REFERENCES `concepts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `novelties` ADD CONSTRAINT `novelties_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `novelties` ADD CONSTRAINT `novelties_period_id_fkey` FOREIGN KEY (`period_id`) REFERENCES `periods`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settlements` ADD CONSTRAINT `settlements_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settlements` ADD CONSTRAINT `settlements_period_id_fkey` FOREIGN KEY (`period_id`) REFERENCES `periods`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settlement_details` ADD CONSTRAINT `settlement_details_settlement_id_fkey` FOREIGN KEY (`settlement_id`) REFERENCES `settlements`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settlement_details` ADD CONSTRAINT `settlement_details_concept_id_fkey` FOREIGN KEY (`concept_id`) REFERENCES `concepts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settlement_details` ADD CONSTRAINT `settlement_details_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
