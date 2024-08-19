import Button from "@/components/ui/Button";
import InputFile from "@/components/ui/InputFile";
import styles from "./ExcelImportSiswa.module.scss";
import { FormEvent, useState } from "react";
import { ExcelFileSchema } from "@/validation/importExcelSchema.validation";
import toast from "react-hot-toast";
import dataSiswaServices from "@/services/dataSiswa";

const ExcelImportSiswa = () => {
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

    const result = await dataSiswaServices.importFromExcel(formData);

    if (result) {
      form.reset();
      setUploadedFile(null);
      setIsLoading(false);
      toast.success("Success Import Data Siswa From Excel");
    } else {
      setIsLoading(false);
      toast.error("Something went wrong!");
    }
    console.log(form.file.files[0]);
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
