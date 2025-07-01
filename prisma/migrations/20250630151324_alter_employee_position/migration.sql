-- AlterTable
ALTER TABLE `employee` ADD COLUMN `position` VARCHAR(60) NOT NULL DEFAULT 'Empleado';

-- AlterTable
ALTER TABLE `payrollconcept` ALTER COLUMN `is_regular_concept` DROP DEFAULT;
