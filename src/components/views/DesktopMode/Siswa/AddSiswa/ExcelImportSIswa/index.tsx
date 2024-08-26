import Button from "@/components/ui/Button";
import InputFile from "@/components/ui/InputFile";
import styles from "./ExcelImportSiswa.module.scss";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { ExcelFileSchema } from "@/validation/importExcelSchema.validation";
import toast from "react-hot-toast";
import dataSiswaServices from "@/services/dataSiswa";
import { AxiosError } from "axios";

type PropTypes = {
  setModalExcelImport: Dispatch<SetStateAction<boolean>>;
};
const ExcelImportSiswa = ({ setModalExcelImport }: PropTypes) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const form = event.target as HTMLFormElement;
    const formData = new FormData();

    const check = ExcelFileSchema.safeParse(form.file.files[0]);
    if (!check.success) {
      toast.error(check.error.errors[0].message);
      setIsLoading(false);
      return;
    }

    formData.append("file", form.file.files[0]);

    try {
      const result = await dataSiswaServices.importFromExcel(formData);

      if (result) {
        form.reset();
        setUploadedFile(null);
        toast.success("Success Import Data Siswa From Excel");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unknown error occurred!");
      }
    } finally {
      setIsLoading(false);
      setModalExcelImport(false);
    }
  };
  return (
    <div className={styles.excelimport}>
      <form
        onSubmit={handleSubmit}
        className={styles.excelimport_form}
        encType="multipart/form-data"
      >
        <div className={styles.excelimport_form_item}>
          <div className={styles.excelimport_form_item_image}>
            <InputFile
              name="file"
              accept=".xlsx, .xls"
              uploadedImage={uploadedFile}
              setUploadedImage={setUploadedFile}
              type="file"
            />
          </div>
        </div>
        <div className={styles.excelimport_form_button}>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Import Siswa"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ExcelImportSiswa;
