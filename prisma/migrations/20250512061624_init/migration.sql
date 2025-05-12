-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `loginAttempts` INTEGER NOT NULL DEFAULT 0,
    `lastLoginAttempt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

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
    `id` VARCHAR(10) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `stateId` VARCHAR(191) NOT NULL,

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
    `id` CHAR(4) NOT NULL,
    `description` VARCHAR(45) NOT NULL,

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
    `id` CHAR(4) NOT NULL,
    `description` VARCHAR(25) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inability_type` (
    `id` CHAR(4) NOT NULL,
    `description` VARCHAR(120) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payroll_concept` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(45) NOT NULL,
    `is_salary` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employer` (
    `identification` VARCHAR(10) NOT NULL,
    `verification_digit` CHAR(1) NULL,
    `name` VARCHAR(45) NOT NULL,
    `addressId` INTEGER NOT NULL,
    `identificationTypeId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`identification`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `address` VARCHAR(100) NOT NULL,
    `cityId` VARCHAR(191) NOT NULL,
    `stateId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_surname` VARCHAR(45) NOT NULL,
    `second_surname` VARCHAR(45) NULL,
    `first_name` VARCHAR(45) NOT NULL,
    `other_names` VARCHAR(45) NULL,
    `identificationTypeId` VARCHAR(191) NOT NULL,
    `identification` VARCHAR(10) NOT NULL,
    `addressId` INTEGER NOT NULL,
    `paymentDataId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `is_active` BOOLEAN NOT NULL,
    `paymentMethodId` VARCHAR(191) NOT NULL,
    `account_number` VARCHAR(45) NOT NULL,
    `bank_entity` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contract_information` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pension_risk` INTEGER NOT NULL,
    `salary` DOUBLE NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NULL,
    `position` VARCHAR(45) NOT NULL,
    `workerTypeId` VARCHAR(191) NOT NULL,
    `workerSubtypeId` VARCHAR(191) NOT NULL,
    `contractTypeId` VARCHAR(191) NOT NULL,
    `addressId` INTEGER NOT NULL,
    `employeeId` INTEGER NOT NULL,

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
    `workedDays` INTEGER NOT NULL,
    `periodId` INTEGER NOT NULL,
    `contractId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payroll_news` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `news_date` DATETIME(3) NOT NULL,
    `news_quantity` INTEGER NOT NULL,
    `news_value` DOUBLE NOT NULL,
    `payrollConceptId` INTEGER NOT NULL,
    `employeeId` INTEGER NOT NULL,
    `paymentDataId` INTEGER NOT NULL,
    `employeeSettlementId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settlement_deduction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deduction_value` DOUBLE NOT NULL,
    `payrollNewsId` INTEGER NOT NULL,
    `employeeSettlementId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settlement_earning` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `earning_value` DOUBLE NOT NULL,
    `payrollNewsId` INTEGER NOT NULL,
    `employeeSettlementId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `absence_new` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `disabilityTypeId` VARCHAR(191) NOT NULL,
    `payrollNewsId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `overtime_new` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `payrollNewsId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `city` ADD CONSTRAINT `city_stateId_fkey` FOREIGN KEY (`stateId`) REFERENCES `state`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employer` ADD CONSTRAINT `employer_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employer` ADD CONSTRAINT `employer_identificationTypeId_fkey` FOREIGN KEY (`identificationTypeId`) REFERENCES `identification_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `address` ADD CONSTRAINT `address_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `city`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `address` ADD CONSTRAINT `address_stateId_fkey` FOREIGN KEY (`stateId`) REFERENCES `state`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee` ADD CONSTRAINT `employee_identificationTypeId_fkey` FOREIGN KEY (`identificationTypeId`) REFERENCES `identification_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee` ADD CONSTRAINT `employee_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee` ADD CONSTRAINT `employee_paymentDataId_fkey` FOREIGN KEY (`paymentDataId`) REFERENCES `payment_data`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_data` ADD CONSTRAINT `payment_data_paymentMethodId_fkey` FOREIGN KEY (`paymentMethodId`) REFERENCES `payment_method`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contract_information` ADD CONSTRAINT `contract_information_workerTypeId_fkey` FOREIGN KEY (`workerTypeId`) REFERENCES `employee_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contract_information` ADD CONSTRAINT `contract_information_workerSubtypeId_fkey` FOREIGN KEY (`workerSubtypeId`) REFERENCES `employee_subtype`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contract_information` ADD CONSTRAINT `contract_information_contractTypeId_fkey` FOREIGN KEY (`contractTypeId`) REFERENCES `contract_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contract_information` ADD CONSTRAINT `contract_information_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contract_information` ADD CONSTRAINT `contract_information_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_settlement` ADD CONSTRAINT `employee_settlement_periodId_fkey` FOREIGN KEY (`periodId`) REFERENCES `payroll_period`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_settlement` ADD CONSTRAINT `employee_settlement_contractId_fkey` FOREIGN KEY (`contractId`) REFERENCES `contract_information`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payroll_news` ADD CONSTRAINT `payroll_news_payrollConceptId_fkey` FOREIGN KEY (`payrollConceptId`) REFERENCES `payroll_concept`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payroll_news` ADD CONSTRAINT `payroll_news_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payroll_news` ADD CONSTRAINT `payroll_news_paymentDataId_fkey` FOREIGN KEY (`paymentDataId`) REFERENCES `payment_data`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payroll_news` ADD CONSTRAINT `payroll_news_employeeSettlementId_fkey` FOREIGN KEY (`employeeSettlementId`) REFERENCES `employee_settlement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settlement_deduction` ADD CONSTRAINT `settlement_deduction_payrollNewsId_fkey` FOREIGN KEY (`payrollNewsId`) REFERENCES `payroll_news`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settlement_deduction` ADD CONSTRAINT `settlement_deduction_employeeSettlementId_fkey` FOREIGN KEY (`employeeSettlementId`) REFERENCES `employee_settlement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settlement_earning` ADD CONSTRAINT `settlement_earning_payrollNewsId_fkey` FOREIGN KEY (`payrollNewsId`) REFERENCES `payroll_news`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settlement_earning` ADD CONSTRAINT `settlement_earning_employeeSettlementId_fkey` FOREIGN KEY (`employeeSettlementId`) REFERENCES `employee_settlement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `absence_new` ADD CONSTRAINT `absence_new_disabilityTypeId_fkey` FOREIGN KEY (`disabilityTypeId`) REFERENCES `inability_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `absence_new` ADD CONSTRAINT `absence_new_payrollNewsId_fkey` FOREIGN KEY (`payrollNewsId`) REFERENCES `payroll_news`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `overtime_new` ADD CONSTRAINT `overtime_new_payrollNewsId_fkey` FOREIGN KEY (`payrollNewsId`) REFERENCES `payroll_news`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
