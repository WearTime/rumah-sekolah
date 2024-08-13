/*
  Warnings:

  - A unique constraint covering the columns `[nisn]` on the table `data_siswa` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `data_guru` ADD COLUMN `image` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `data_siswa` ADD COLUMN `image` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `data_siswa_nisn_key` ON `data_siswa`(`nisn`);
