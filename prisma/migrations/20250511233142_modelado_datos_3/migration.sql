/*
  Warnings:

  - The primary key for the `tipoincapacidad` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `mvausencia` DROP FOREIGN KEY `MvAusencia_tipoIncapacidadId_fkey`;

-- DropIndex
DROP INDEX `MvAusencia_tipoIncapacidadId_fkey` ON `mvausencia`;

-- AlterTable
ALTER TABLE `mvausencia` MODIFY `tipoIncapacidadId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `tipoincapacidad` DROP PRIMARY KEY,
    MODIFY `id` CHAR(1) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `MvAusencia` ADD CONSTRAINT `MvAusencia_tipoIncapacidadId_fkey` FOREIGN KEY (`tipoIncapacidadId`) REFERENCES `TipoIncapacidad`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
