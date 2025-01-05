import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./ListTable.module.scss"; // Adjust import based on your project
import { Guru } from "@/types/guru.types";
import { Siswa } from "@/types/siswa.type";
import { Mapel } from "@/types/mapel.type";
import Button from "@/components/ui/Button"; // Adjust import based on your project
import { useMediaQuery } from "react-responsive";
import ActionMenu from "../ActionMenu";
import { IconName } from "@fortawesome/fontawesome-svg-core";

type Header = {
  key: string;
  label: string;
  tabletDelete?: boolean;
  mobileDelete?: boolean;
};

type Action = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: IconName;
};

type ListTableProps<T extends Guru | Siswa | Mapel> = {
  setActionMenu: Dispatch<SetStateAction<T | null>>;
  setSelectedItem?: Dispatch<SetStateAction<T | null>>;
  setIsItemModalOpen?: Dispatch<SetStateAction<boolean>>;
  actionMenu: T | null;
  data: T[];
  headers: Header[];
  currentPage: number;
  pageSize: number;
  identifierKey: keyof T;
  actions: Action[];
};

function hasKey<T extends object>(obj: T | null, key: keyof any): obj is T {
  return typeof obj === "object" && obj !== null && key in obj;
}

const ListTable = <T extends Guru | Siswa | Mapel>({
  actionMenu,
  setActionMenu,
  setIsItemModalOpen,
  setSelectedItem,
  data,
  headers,
  currentPage,
  pageSize,
  identifierKey,
  actions,
}: ListTableProps<T>) => {
  const ellipsisButtonRefs = useRef<{ [key: string]: SVGSVGElement | null }>(
    {}
  );

  const handleActionMenu = (selectedItem: T) => {
    setActionMenu(
      actionMenu?.[identifierKey] === selectedItem[identifierKey]
        ? null
        : selectedItem
    );
  };

  return (
    <table className={styles.listguru_table}>
      <thead>
        <tr>
          {identifierKey !== "kode_mapel" && <th>No</th>}
          {headers.map((header, index) => (
            <th
              key={index}
              className={`${
                header.mobileDelete &&
                styles["listguru_table_body_mobileDelete"]
              } ${
                header.tabletDelete &&
                styles["listguru_table_body_tabletDelete"]
              }`}
            >
              {header.label}
            </th>
          ))}
          <th></th>
        </tr>
      </thead>
      <tbody className={styles.listguru_table_body}>
        {data.length > 0 ? (
          data.map((item, index) => {
            const rowKey = hasKey(item, identifierKey)
              ? (item[identifierKey] as React.Key)
              : index;

            return (
              <tr key={rowKey}>
                {identifierKey !== "kode_mapel" && (
                  <td>{(currentPage - 1) * pageSize + index + 1}</td>
                )}
                {headers.map((header: Header) => {
                  if ("guruandmapel" in item) {
                    return (
                      <td
                        key={header.key}
                        className={`${
                          header.mobileDelete &&
                          styles["listguru_table_body_mobileDelete"]
                        } ${
                          header.tabletDelete &&
                          styles["listguru_table_body_tabletDelete"]
                        }`}
                      >
                        {header.key === "guru" || header.key === "mapel" ? (
                          item.guruandmapel && item.guruandmapel.length > 1 ? (
                            <Button
                              type="button"
                              variant="secondary"
                              className={styles.listguru_table_body_guru_button}
                              onClick={() => {
                                if (setSelectedItem && setIsItemModalOpen) {
                                  setSelectedItem(item);
                                  setIsItemModalOpen(true); // Open the modal
                                }
                              }}
                            >
                              See More
                            </Button>
                          ) : header.key === "mapel" ? (
                            item.guruandmapel?.[0].guru.nama
                          ) : (
                            item.guruandmapel?.[0].mapel.nama_mapel
                          )
                        ) : (
                          (item as Record<string, any>)[header.key] ||
                          "Tidak ada"
                        )}
                      </td>
                    );
                  } else {
                    return (
                      <td
                        key={header.key}
                        className={`${
                          header.mobileDelete &&
                          styles["listguru_table_body_mobileDelete"]
                        } ${
                          header.tabletDelete &&
                          styles["listguru_table_body_tabletDelete"]
                        }`}
                      >
                        {(item as Record<string, any>)[header.key] ||
                          "Tidak ada"}
                      </td>
                    );
                  }
                })}
                <td>
                  <FontAwesomeIcon
                    icon={["fas", "ellipsis"]}
                    className={styles.listguru_table_body_icon}
                    onClick={() => handleActionMenu(item)}
                    ref={(el) => {
                      ellipsisButtonRefs.current[
                        item[identifierKey] as string
                      ] = el as SVGSVGElement;
                      return;
                    }}
                  />
                  {hasKey(actionMenu, identifierKey) &&
                    hasKey(item, identifierKey) &&
                    actionMenu[identifierKey] === item[identifierKey] && (
                      <ActionMenu
                        positionRef={{
                          current:
                            ellipsisButtonRefs.current[
                              item[identifierKey] as string
                            ],
                        }}
                        actions={actions}
                      />
                    )}
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td
              colSpan={headers.length + 1}
              className={styles.listguru_table_body_empty}
            >
              Data Kosong
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ListTable;
