-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `profile` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data_siswa` (
    `nisn` VARCHAR(191) NOT NULL,
    `nis` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `kelas` VARCHAR(191) NOT NULL,
    `jurusan` VARCHAR(191) NOT NULL,
    `no_hp` VARCHAR(191) NULL,
    `alamat` VARCHAR(191) NULL,

    UNIQUE INDEX `data_siswa_nis_key`(`nis`),
    PRIMARY KEY (`nisn`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data_guru` (
    `nip` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `no_hp` VARCHAR(191) NULL,
    `alamat` VARCHAR(191) NULL,
    `mapel` VARCHAR(191) NULL,

    PRIMARY KEY (`nip`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mapel` (
    `kode_mapel` VARCHAR(191) NOT NULL,
    `nama_mapel` VARCHAR(191) NOT NULL,
    `fase` VARCHAR(191) NOT NULL,
    `tipe_mapel` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`kode_mapel`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
