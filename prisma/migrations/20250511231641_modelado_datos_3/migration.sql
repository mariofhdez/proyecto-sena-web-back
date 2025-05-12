/*
  Warnings:

  - You are about to drop the column `tipoTrabajadorId` on the `subtipotrabajador` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `subtipotrabajador` DROP FOREIGN KEY `SubtipoTrabajador_tipoTrabajadorId_fkey`;

-- DropIndex
DROP INDEX `SubtipoTrabajador_tipoTrabajadorId_fkey` ON `subtipotrabajador`;

-- AlterTable
ALTER TABLE `subtipotrabajador` DROP COLUMN `tipoTrabajadorId`;
