/*
  Warnings:

  - You are about to drop the column `nis` on the `data_siswa` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `data_siswa_nis_key` ON `data_siswa`;

-- AlterTable
ALTER TABLE `data_siswa` DROP COLUMN `nis`,
    MODIFY `tanggal_lahir` DATE NOT NULL;
