"use client";
import styles from "./Pagination.module.scss";
import { SetStateAction, Dispatch } from "react";
import { Guru } from "@/types/guru.types";
import { Siswa } from "@/types/siswa.type";
import { Mapel } from "@prisma/client";
import Button from "@/components/ui/Button";

type PaginationProps<T> = {
  setActionMenu: Dispatch<SetStateAction<T | null>>; // Tipe T di sini
  currentPage: number;
  pageSize: number;
  totalItems: number;
  fetchPageData: (currentPage: number) => void;
};

const Pagination = <T,>({
  setActionMenu,
  fetchPageData,
  currentPage,
  pageSize,
  totalItems,
}: PaginationProps<T>) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setActionMenu(null); // Aman karena Tipe T | null
      fetchPageData(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setActionMenu(null); // Aman karena Tipe T | null
      fetchPageData(currentPage - 1);
    }
  };

  return (
    <div className={styles.pagination}>
      <Button
        type="button"
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={styles.pagination_prev}
      >
        Prev
      </Button>
      <span>
        {totalPages > 0 ? currentPage : 0} of {totalPages}
      </span>
      <Button
        type="button"
        onClick={handleNext}
        disabled={currentPage === totalPages || totalPages === 0}
        className={styles.pagination_next}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
