/*
  Warnings:

  - You are about to drop the column `mapel` on the `data_guru` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nis]` on the table `data_siswa` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jenis_kelamin` to the `data_siswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tanggal_lahir` to the `data_siswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jurusan` to the `mapel` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `data_siswa_nisn_key` ON `data_siswa`;

-- DropIndex
DROP INDEX `User_id_key` ON `user`;

-- AlterTable
ALTER TABLE `data_guru` DROP COLUMN `mapel`;

-- AlterTable
ALTER TABLE `data_siswa` ADD COLUMN `jenis_kelamin` ENUM('L', 'P') NOT NULL,
    ADD COLUMN `tanggal_lahir` DATETIME(3) NOT NULL,
    ADD COLUMN `tempat_lahir` VARCHAR(191) NULL,
    ALTER COLUMN `kelas` DROP DEFAULT;

-- AlterTable
ALTER TABLE `mapel` ADD COLUMN `jurusan` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `GuruAndMapel` (
    `id` VARCHAR(191) NOT NULL,
    `kode_mapel` VARCHAR(191) NOT NULL,
    `nip_guru` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `GuruAndMapel_kode_mapel_nip_guru_key`(`kode_mapel`, `nip_guru`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `data_siswa_nis_key` ON `data_siswa`(`nis`);

-- AddForeignKey
ALTER TABLE `GuruAndMapel` ADD CONSTRAINT `GuruAndMapel_kode_mapel_fkey` FOREIGN KEY (`kode_mapel`) REFERENCES `mapel`(`kode_mapel`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuruAndMapel` ADD CONSTRAINT `GuruAndMapel_nip_guru_fkey` FOREIGN KEY (`nip_guru`) REFERENCES `data_guru`(`nip`) ON DELETE CASCADE ON UPDATE CASCADE;
