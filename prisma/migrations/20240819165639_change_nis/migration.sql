-- DropIndex
DROP INDEX `data_siswa_nis_key` ON `data_siswa`;

-- AlterTable
ALTER TABLE `data_siswa` MODIFY `nis` VARCHAR(191) NULL;
