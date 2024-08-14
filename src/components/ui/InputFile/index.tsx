import { Dispatch, SetStateAction } from "react";
import styles from "./Input.module.scss";

type PropTypes = {
  uploadedImage: File | null;
  setUploadedImage: Dispatch<SetStateAction<File | null>>;
  name: string;
  accept: string;
};

const MAX_LENGTH = 20;
const InputFile = ({
  name,
  uploadedImage,
  setUploadedImage,
  accept,
}: PropTypes) => {
  const truncateFileName = (fileName: string, maxLength: number): string => {
    const [name, extension] = fileName.split(/\.(?=[^.]+$)/);

    let shortenedName = name;
    if (name.length > maxLength) {
      shortenedName = name.substring(0, maxLength) + "...";
    }

    const nameParts = name.match(/.{1,1}/g) || [];

    let lastTwoParts = "";
    if (name.length > maxLength) {
      lastTwoParts = nameParts.slice(-2).join("");
    }

    const finalName = `${shortenedName}${lastTwoParts}`;

    return `${finalName}.${extension}`;
  };

  return (
    <div className={styles.file}>
      <label className={styles.file__label} htmlFor={name}>
        {uploadedImage?.name ? (
          <p>{truncateFileName(uploadedImage.name, MAX_LENGTH)}</p>
        ) : (
          <>
            <p>
              Upload a new Image, larger image will be resized automatically
            </p>
            <p>
              Maximum upload size is <b>1MB</b>
            </p>
          </>
        )}
      </label>
      <input
        className={styles.file__input}
        type="file"
        name={name}
        id={name}
        accept={accept}
        onChange={(e: any) => {
          e.preventDefault();
          setUploadedImage(e.currentTarget.files[0]);
        }}
      />
    </div>
  );
};

export default InputFile;
