/*
  Warnings:

  - You are about to alter the column `fase` on the `mapel` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to alter the column `role` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `mapel` MODIFY `fase` ENUM('Umum', 'Jurusan') NOT NULL DEFAULT 'Umum';

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('Admin', 'Member') NOT NULL DEFAULT 'Member';
