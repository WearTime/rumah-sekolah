/*
  Warnings:

  - You are about to alter the column `kelas` on the `data_siswa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to alter the column `fase` on the `mapel` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.
  - You are about to alter the column `tipe_mapel` on the `mapel` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `data_siswa` MODIFY `kelas` ENUM('X', 'XI', 'XII') NOT NULL DEFAULT 'X';

-- AlterTable
ALTER TABLE `mapel` MODIFY `fase` VARCHAR(191) NOT NULL,
    MODIFY `tipe_mapel` ENUM('Umum', 'Jurusan') NOT NULL DEFAULT 'Umum';

-- CreateIndex
CREATE UNIQUE INDEX `User_id_key` ON `User`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `User_username_key` ON `User`(`username`);
