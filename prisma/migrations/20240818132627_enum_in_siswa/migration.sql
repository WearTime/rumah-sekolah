/*
  Warnings:

  - You are about to alter the column `kelas` on the `data_siswa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to alter the column `fase` on the `mapel` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.
  - You are about to alter the column `tipe_mapel` on the `mapel` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `data_siswa` MODIFY `kelas` ENUM('X', 'XI', 'XII') NOT NULL DEFAULT 'X';

-- AlterTable
ALTER TABLE `mapel` MODIFY `fase` VARCHAR(191) NOT NULL,
    MODIFY `tipe_mapel` ENUM('Umum', 'Jurusan') NOT NULL DEFAULT 'Umum';
