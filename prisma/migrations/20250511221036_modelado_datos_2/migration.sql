/*
  Warnings:

  - You are about to drop the column `paisId` on the `direccion` table. All the data in the column will be lost.
  - You are about to drop the `pais` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `departamentoId` to the `Direccion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `direccion` DROP FOREIGN KEY `Direccion_paisId_fkey`;

-- DropIndex
DROP INDEX `Direccion_paisId_fkey` ON `direccion`;

-- AlterTable
ALTER TABLE `direccion` DROP COLUMN `paisId`,
    ADD COLUMN `departamentoId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `pais`;

-- CreateTable
CREATE TABLE `Departamento` (
    `id` VARCHAR(2) NOT NULL,
    `nombre` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Direccion` ADD CONSTRAINT `Direccion_departamentoId_fkey` FOREIGN KEY (`departamentoId`) REFERENCES `Departamento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
