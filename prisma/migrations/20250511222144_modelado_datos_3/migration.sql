/*
  Warnings:

  - Added the required column `departamentoId` to the `Ciudad` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ciudad` ADD COLUMN `departamentoId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Ciudad` ADD CONSTRAINT `Ciudad_departamentoId_fkey` FOREIGN KEY (`departamentoId`) REFERENCES `Departamento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
