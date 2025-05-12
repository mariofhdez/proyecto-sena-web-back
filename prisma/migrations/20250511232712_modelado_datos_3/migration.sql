/*
  Warnings:

  - The primary key for the `metodopago` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `metodopago` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(3) NOT NULL,
    ADD PRIMARY KEY (`id`);
