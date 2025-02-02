"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import Link from "next/link";
import { notFound, useRouter, useParams } from "next/navigation";
import styles from "./DashboardDetail.module.scss";
import { useState, useEffect } from "react";
import dataSiswaServices from "@/services/dataSiswa";
import toast from "react-hot-toast";
import { Siswa } from "@/types/siswa.type";
import ListTableLayout from "@/components/layouts/ListTableLayout";
import useDebounce from "@/hooks/useDebounce";

type DashboardItemProps = {
  title: string;
  icon: IconName;
  count: number;
  description: boolean;
  color: string;
  link?: string;
  width?: number;
  onClick?: () => void;
};

type PropTypes = {
  params: {
    detail: string[];
  };
};
type Action = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: IconName;
};

const validRoutes = {
  siswa: ["list", "add", "edit"],
  guru: ["list", "add", "edit"],
} as const;

type ValidCategories = keyof typeof validRoutes;

const SiswaCategory = () => {
  const router = useRouter();
  const params = useParams();
  const [selectedGender, setSelectedGender] = useState<
    string | string[] | null
  >(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<string | null>(null);
  const [counts, setCounts] = useState<{
    genderCounts: { [key: string]: number };
    classCounts: { [key: string]: number };
    majorCounts: { [key: string]: number };
  }>({
    genderCounts: {},
    classCounts: {},
    majorCounts: {},
  });

  const classes = ["X", "XI", "XII"];
  const majors = [
    "PPLG",
    "AK",
    "TKJ",
    "DKV",
    "MPLB",
    "KUL",
    "ULP",
    "PM",
    "BUS",
    "PHT",
    "ULW",
  ];

  useEffect(() => {
    // Load initial counts for gender
    const loadGenderCounts = async () => {
      try {
        const responses = await Promise.all([
          dataSiswaServices.getAllSiswa({ jenisKelamin: "L" }),
          dataSiswaServices.getAllSiswa({ jenisKelamin: "P" }),
        ]);

        setCounts((prev) => ({
          ...prev,
          genderCounts: {
            L: responses[0].data.total,
            P: responses[1].data.total,
          },
        }));
      } catch (error) {
        toast.error("Failed to load student counts");
      }
    };

    loadGenderCounts();
  }, []);

  useEffect(() => {
    console.log("AKu di load class : " + selectedGender);
    if (selectedGender) {
      const loadClassCounts = async () => {
        try {
          const responses = await Promise.all(
            classes.map((className) =>
              dataSiswaServices.getAllSiswa({
                jenisKelamin: selectedGender,
                kelas: className,
              })
            )
          );

          const newClassCounts = classes.reduce(
            (acc, className, index) => ({
              ...acc,
              [className]: responses[index].data.total,
            }),
            {}
          );

          setCounts((prev) => ({
            ...prev,
            classCounts: newClassCounts,
          }));
        } catch (error) {
          toast.error("Failed to load class counts");
        }
      };

      loadClassCounts();
    }
  }, [selectedGender]);

  useEffect(() => {
    if (selectedGender == "LP" || selectedGender == "L%2CP") {
      setSelectedGender(["L", "P"]);
    } else {
      setSelectedGender(selectedGender);
    }
    if (selectedGender && selectedClass) {
      const loadMajorCounts = async () => {
        try {
          const responses = await Promise.all(
            majors.map((major) =>
              dataSiswaServices.getAllSiswa({
                jenisKelamin: selectedGender,
                kelas: selectedClass,
                jurusan: major,
              })
            )
          );

          const newMajorCounts = majors.reduce(
            (acc, major, index) => ({
              ...acc,
              [major]: responses[index].data.total,
            }),
            {}
          );

          setCounts((prev) => ({
            ...prev,
            majorCounts: newMajorCounts,
          }));
        } catch (error) {
          toast.error("Failed to load major counts");
        }
      };

      loadMajorCounts();
    }
  }, [selectedGender, selectedClass]);

  // Effect untuk membaca URL dan mengatur state
  useEffect(() => {
    if (params.detail && params.detail.length > 0) {
      const [category, gender, className, major] = params.detail as [
        string,
        string,
        string,
        string
      ];

      if (gender == "LP" || gender == "L%2CP") {
        setSelectedGender(["L", "P"]);
      } else {
        setSelectedGender(gender);
      }
      setSelectedClass(className);
      setSelectedMajor(major);
    }
  }, [params.detail]);

  const handleGenderSelect = (gender: string) => {
    console.log("gender saat ini: " + gender);
    if (gender == "LP" || gender == "L%2CP") {
      setSelectedGender(["L", "P"]);
    } else {
      setSelectedGender(gender);
    }
    setSelectedClass(null);
    setSelectedMajor(null);
    router.push(`/siswa/${gender}`);
  };

  const handleClassSelect = (className: string) => {
    setSelectedClass(className);
    setSelectedMajor(null);
    router.push(`/siswa/${selectedGender}/${className}`);
  };

  const handleMajorSelect = (major: string) => {
    setSelectedMajor(major);
    router.push(`/siswa/${selectedGender}/${selectedClass}/${major}`);
  };

  return (
    <>
      {!selectedGender && (
        <div className={styles.dashboard_content_container}>
          <DashboardItem
            title="Pria"
            icon="person"
            count={counts.genderCounts["L"] || 0}
            description={true}
            color="#3299a8"
            link={`/siswa/L`}
            onClick={() => handleGenderSelect("L")}
          />
          <DashboardItem
            title="Perempuan"
            icon="person-dress"
            count={counts.genderCounts["P"] || 0}
            description={true}
            color="#b942f5"
            link={`/siswa/P`}
            onClick={() => handleGenderSelect("P")}
          />
          <DashboardItem
            title="Cowo & Cewe"
            icon="person-half-dress"
            count={counts.genderCounts["P"] + counts.genderCounts["L"] || 0}
            description={true}
            color="#0fa852"
            link={`/siswa/LP`}
            onClick={() => handleGenderSelect("LP")}
          />
        </div>
        //   <div
        //   className={styles.dashboard_content_container}
        //   style={{ width: "80.4%" }}
        // >
        //   <Link
        //     href={"/siswa/L"}
        //     className={styles.dashboard_content_container_item}
        //     style={{
        //       backgroundColor: "#3299a8",
        //     }}
        //     onClick={() => handleGenderSelect("L")}
        //   >
        //     <FontAwesomeIcon
        //       icon={["fas", "person"]}
        //       className={styles.dashboard_content_container_item_icon}
        //     />
        //     <div className={styles.dashboard_content_container_item_text}>
        //       <h1
        //         className={styles.dashboard_content_container_item_text_title}
        //       >
        //         Jumlah Laki Laki
        //       </h1>
        //       <p className={styles.dashboard_content_container_item_text_count}>
        //         {counts.genderCounts["L"] || 0} Laki Laki
        //       </p>
        //     </div>
        //   </Link>
        //   <Link
        //     href={"/siswa/P"}
        //     className={styles.dashboard_content_container_item}
        //     style={{
        //       backgroundColor: "#b942f5",
        //     }}
        //     onClick={() => handleGenderSelect("P")}
        //   >
        //     <FontAwesomeIcon
        //       icon={["fas", "person-dress"]}
        //       className={styles.dashboard_content_container_item_icon}
        //     />
        //     <div className={styles.dashboard_content_container_item_text}>
        //       <h1
        //         className={styles.dashboard_content_container_item_text_title}
        //       >
        //         Jumlah Perempuan
        //       </h1>
        //       <p className={styles.dashboard_content_container_item_text_count}>
        //         {counts.genderCounts["P"] || 0} Perempuan
        //       </p>
        //     </div>
        //   </Link>
        // </div>
      )}
      {selectedGender && !selectedClass && (
        <div className={styles.dashboard_content_container}>
          {classes.map((className) => (
            <DashboardItem
              key={className}
              title={`Kelas ${className}`}
              icon="chalkboard-teacher"
              count={counts.classCounts[className] || 0}
              description={true}
              color="#f39c12"
              link={`/siswa/${selectedGender}/${className}`}
              onClick={() => handleClassSelect(className)}
            />
          ))}
        </div>
      )}
      {selectedClass && !selectedMajor && (
        <div className={styles.dashboard_content_container}>
          {majors.map((major) => (
            <DashboardItem
              key={major}
              title={major}
              icon="book"
              count={counts.majorCounts[major] || 0}
              description={true}
              color="#3498db"
              link={`/siswa/${selectedGender}/${selectedClass}/${major}`}
              onClick={() => handleMajorSelect(major)}
            />
          ))}
        </div>
      )}
    </>
  );
};
const SiswaTable = ({
  gender,
  className,
  major,
}: {
  gender: string | string[];
  className: string;
  major: string;
}) => {
  const { debounce } = useDebounce();
  const [actionMenu, setActionMenu] = useState<Siswa | null>(null);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [deletedSiswa, setDeletedSiswa] = useState<Siswa | null>(null);
  const [editSiswa, setEditSiswa] = useState<Siswa | null>(null);
  const [detailSiswa, setDetailSiswa] = useState<Siswa | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<{
    deleteModal: boolean;
    editModal: boolean;
    detailModal: boolean;
  }>({ deleteModal: false, editModal: false, detailModal: false });
  const SEARCH_DELAY = 1000; // Delay untuk debounce
  const [siswa, setSiswa] = useState<{
    data: Siswa[];
    total: number;
  }>({ data: [], total: 0 });
  const [data, setData] = useState<Siswa[]>(siswa.data);
  const [totalItems, setTotalItems] = useState(siswa?.total);
  if (gender == "LP" || gender == "L%2CP") {
    gender = ["L", "P"];
  } else {
    gender = gender;
  }
  useEffect(() => {
    console.log(gender);
    const getSiswaData = async () => {
      try {
        setLoading(true);
        const { data } = await dataSiswaServices.getAllSiswa({
          page: 1,
          search: "",
          jenisKelamin: gender,
          kelas: className,
          jurusan: major,
        });
        setSiswa(data);
        setData(data.data);
        setTotalItems(data.total);
      } catch (error) {
        toast.error("An error occurred while loading data");
      } finally {
        setLoading(false);
      }
    };

    getSiswaData();
  }, []);
  const fetchPageData = async (page: number) => {
    const response = await dataSiswaServices.getAllSiswa({
      page,
      search,
      jenisKelamin: gender,
      kelas: className,
      jurusan: major,
    });
    const { data, total: newTotal } = response.data;
    setData(data);
    setTotalItems(newTotal);
    setCurrentPage(page);
  };

  const performSearch = () => {
    if (search !== "") {
      fetchPageData(1);
    } else {
      setData(siswa.data);
      setTotalItems(siswa?.total);
    }
  };

  const debounceSearch = debounce(performSearch, SEARCH_DELAY);

  useEffect(() => {
    debounceSearch();
  }, [search]);
  const handleDetail = () => {
    setDetailSiswa(actionMenu);
    setIsModalOpen({
      deleteModal: false,
      editModal: false,
      detailModal: true,
    });
  };
  const handleEdit = () => {
    setEditSiswa(actionMenu);
    setIsModalOpen({
      deleteModal: false,
      editModal: true,
      detailModal: false,
    });
  };

  const handleDelete = () => {
    setDeletedSiswa(actionMenu);
    setIsModalOpen({ deleteModal: true, editModal: false, detailModal: false });
  };

  const headers = [
    { key: "nama", label: "Nama" },
    { key: "nisn", label: "NISN" },
    { key: "kelas", label: "Kelas", mobileDelete: true },
    { key: "jurusan", label: "Jurusan", mobileDelete: true },
    { key: "no_hp", label: "No HP", tabletDelete: true },
    { key: "alamat", label: "Alamat", tabletDelete: true },
  ];
  const actions: Action[] = [
    {
      label: "Detail",
      onClick: handleDetail,
      disabled: false,
    },
    {
      label: "Edit",
      onClick: handleEdit,
      disabled: false,
      icon: "pen-to-square",
    },
    { label: "Delete", onClick: handleDelete, disabled: false, icon: "trash" },
  ];
  return (
    <>
      <div className={styles.listsiswa}>
        <div className={styles.listsiswa_search}>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Cari nama siswa"
            className={styles.listsiswa_search_input}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {!loading && (
          <ListTableLayout
            data={data}
            headers={headers}
            currentPage={currentPage}
            pageSize={pageSize}
            identifierKey={"nisn"}
            actions={actions}
            setActionMenu={setActionMenu}
            actionMenu={actionMenu}
            totalItems={totalItems}
            fetchPageData={fetchPageData}
          />
        )}
      </div>
    </>
  );
};

const DashboardItem = ({
  title,
  icon,
  count,
  description,
  color,
  link,
  onClick,
  width,
}: DashboardItemProps) => {
  return (
    <Link
      href={link ?? "/"}
      className={styles.dashboard_content_container_item}
      style={{ backgroundColor: color, ...(width && { width: `${width}%` }) }}
      onClick={onClick}
    >
      <FontAwesomeIcon
        icon={["fas", icon]}
        className={styles.dashboard_content_container_item_icon}
      />
      <div className={styles.dashboard_content_container_item_text}>
        <h1 className={styles.dashboard_content_container_item_text_title}>
          {description ? `Jumlah ${title}` : title}
        </h1>
        {description && (
          <p className={styles.dashboard_content_container_item_text_count}>
            {count} {title}
          </p>
        )}
      </div>
    </Link>
  );
};

const DashboardDetailView = ({ params }: PropTypes) => {
  const validateRoute = () => {
    if (!params.detail || params.detail.length === 0) {
      notFound();
    }

    const [category, subpath] = params.detail;

    if (!Object.keys(validRoutes).includes(category)) {
      notFound();
    }

    if (
      subpath &&
      !validRoutes[category as ValidCategories].includes(
        subpath as "list" | "add" | "edit"
      )
    ) {
      notFound();
    }
  };

  const categoryComponents = {
    siswa: <SiswaCategory />,
  } as const;

  // validateRoute();

  const category = params.detail[0];
  const CategoryComponent =
    categoryComponents[category as keyof typeof categoryComponents];

  const [gender, className, major] = params.detail.slice(1);

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.dashboard_title}>
        Selamat Datang di Sistem Informasi SMKN 4 Bandar Lampung
      </h1>

      <div className={styles.dashboard_visinmisi}>
        <div className={styles.dashboard_visinmisi_content}>
          <h1>Visi</h1>
          <div className={styles.dashboard_visinmisi_content_item}>
            <p>
              Menghasilkan lulusan yang unggul, mampu bersaing dipasar global
              dan berkarakter Pancasila.
            </p>
          </div>
        </div>

        <div
          className={`${styles.dashboard_visinmisi_content} ${styles.dashboard_visinmisi_content_misi}`}
        >
          <h1>Misi</h1>
          <div className={styles.dashboard_visinmisi_content_item}>
            <p>
              1. Menyelenggarakan kegiatan pembelajaran yang berpusat pada
              peserta didik yang berkarakter Pancasila dengan menerapkan
              Teaching Factory dan berbasis industry melalui pendekatan
              teknologi informatika dan komunikasi serta mencetak jiwa
              wirausaha/entrepreneurship.
            </p>
            <p>
              2. Menjalin dan mengembangkan kerjasama kemitraan dengan dunia
              kerja dalam mengembangkan kurikulum untuk menghasilkan lulusan
              yang unggul sesuai standar industri nasional dan internasional.
            </p>
            <p>
              3. Menggunakan sarana dan peralatan praktik yang sesuai dengan
              Standar Industri.
            </p>
            <p>
              4. Menerapkan pendidikan anti perundungan, ramah lingkungan,
              menyenangkan, harmonis dan dinamis
            </p>
          </div>
        </div>
      </div>

      <div className={styles.dashboard_content}>
        {CategoryComponent}
        {gender && className && major && (
          <SiswaTable gender={gender} className={className} major={major} />
        )}
      </div>
    </div>
  );
};

export default DashboardDetailView;
