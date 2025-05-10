/*
  Warnings:

  - You are about to alter the column `isActive` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `isActive` BOOLEAN NOT NULL DEFAULT true;
