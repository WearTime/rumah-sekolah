-- AlterTable
ALTER TABLE `data_guru` ADD COLUMN `golongan` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('ASN', 'P3K', 'Honorer') NOT NULL DEFAULT 'Honorer';

-- CreateTable
CREATE TABLE `data_stafftu` (
    `nip` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `no_hp` VARCHAR(191) NULL,
    `alamat` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,

    PRIMARY KEY (`nip`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `struktur_organisasi` (
    `nip` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `struktur_organisasi_nip_key`(`nip`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `struktur_organisasi` ADD CONSTRAINT `struktur_organisasi_nip_fkey` FOREIGN KEY (`nip`) REFERENCES `data_guru`(`nip`) ON DELETE CASCADE ON UPDATE CASCADE;
