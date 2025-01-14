"use client";
import styles from "./MobileListTable.module.scss";
import { SetStateAction, Dispatch } from "react";
import Button from "@/components/ui/Button";
import { Guru } from "@/types/guru.types";
import { useMediaQuery } from "react-responsive";
import { Mapel } from "@/types/mapel.type";
import { Siswa } from "@/types/siswa.type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import { StructureOrganisasi } from "@/types/structureorganisasi.type";

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
function hasKey<T extends object>(obj: T | null, key: keyof any): obj is T {
  return typeof obj === "object" && obj !== null && key in obj;
}
type PropTypes<T extends Guru | Siswa | Mapel | StructureOrganisasi> = {
  setSelectedItem?: Dispatch<SetStateAction<T | null>>;
  setActionMenu: Dispatch<SetStateAction<T | null>>;
  actionMenu: T | null;
  setIsItemModalOpen?: Dispatch<SetStateAction<boolean>>;
  total: number;
  identifierKey: keyof T;
  data: T[];
  headers: Header[];
  actions: Action[];
};

const MobileListTable = <T extends Guru | Siswa | Mapel | StructureOrganisasi>({
  data,
  actionMenu,
  setActionMenu,
  setIsItemModalOpen,
  setSelectedItem,
  headers,
  actions,
  identifierKey,
}: PropTypes<T>) => {
  const isMobile = useMediaQuery({ query: "(max-width: 340px)" });
  const handleActionMenu = (selectedItem: T) => {
    setActionMenu(
      actionMenu?.[identifierKey] === selectedItem[identifierKey]
        ? null
        : selectedItem
    );
  };
  return (
    <>
      <div className={styles.tableMobile}>
        {data.length > 0 ? (
          data.map((item) => {
            return (
              <>
                <div className={styles.tableMobile_container}>
                  {headers.map((header: Header) => {
                    if ("guruandmapel" in item) {
                      return (
                        <>
                          <div
                            style={
                              header.key == "kode_mapel"
                                ? { display: "none" }
                                : undefined
                            }
                            className={`${
                              header.label == "Nama"
                                ? styles["tableMobile_container_title"]
                                : styles["tableMobile_container_item"]
                            }`}
                          >
                            <p>{header.label}</p>
                            {header.label == "Nama" ? (
                              <h1>
                                {(item as Record<string, any>)[header.key] ||
                                  "Tidak ada"}
                              </h1>
                            ) : (
                              <p>
                                {header.key === "guru" ||
                                header.key === "mapel" ? (
                                  item.guruandmapel &&
                                  item.guruandmapel.length > 1 ? (
                                    <Button
                                      type="button"
                                      variant="secondary"
                                      className={
                                        styles.tableMobile_container_item_seeMore
                                      }
                                      onClick={() => {
                                        if (
                                          setSelectedItem &&
                                          setIsItemModalOpen
                                        ) {
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
                              </p>
                            )}
                          </div>
                          <hr
                            style={
                              header.key == "kode_mapel"
                                ? { display: "none" }
                                : undefined
                            }
                          />
                        </>
                      );
                    } else {
                      return (
                        <>
                          <div
                            key={header.key}
                            style={
                              header.key == "kode_mapel"
                                ? { display: "none" }
                                : undefined
                            }
                            className={`${
                              header.label == "Nama"
                                ? styles["tableMobile_container_title"]
                                : styles["tableMobile_container_item"]
                            }`}
                          >
                            <p>{header.label}</p>
                            {header.label == "Nama" ? (
                              <h1>
                                {(item as Record<string, any>)[header.key] ||
                                  "Tidak ada"}
                              </h1>
                            ) : (
                              <p>
                                {(item as Record<string, any>)[header.key] ||
                                  "Tidak ada"}
                              </p>
                            )}
                          </div>
                          <hr
                            style={
                              header.key == "kode_mapel"
                                ? { display: "none" }
                                : undefined
                            }
                          />
                        </>
                      );
                    }
                  })}
                  <div className={styles.tableMobile_container_btnSect}>
                    {actions.map((action, index) => (
                      <Button
                        key={action.label}
                        type="button"
                        className={styles.tableMobile_container_btnSect_item}
                        onClick={() => {
                          handleActionMenu(item);
                          if (
                            hasKey(actionMenu, identifierKey) &&
                            hasKey(item, identifierKey) &&
                            actionMenu[identifierKey] === item[identifierKey]
                          ) {
                            action.onClick();
                          }
                        }}
                        disabled={action.disabled}
                      >
                        <FontAwesomeIcon
                          icon={["fas", action.icon || "circle-info"]}
                          className={
                            styles.tableMobile_container_btnSect_item_icon
                          }
                        />
                        {!isMobile && action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            );
          })
        ) : (
          <h1 className={styles.tableMobile_empty}> Data Kosong</h1>
        )}
      </div>
    </>
  );
};

export default MobileListTable;
