-- AlterTable
ALTER TABLE `payrollconcept` ADD COLUMN `is_regular_concept` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `period` ADD COLUMN `deductions_total` DOUBLE NULL,
    ADD COLUMN `earnings_total` DOUBLE NULL,
    ADD COLUMN `employees_quantity` INTEGER NULL,
    ADD COLUMN `total_value` DOUBLE NULL;
