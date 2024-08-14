import { z } from "zod";

const allowedImageExtensions = ["jpg", "jpeg", "png", "gif"];

const imageSchema = z.object({
  file: z
    .union([z.instanceof(File), z.string()])
    .optional()
    .refine(
      (file) => {
        if (!file || typeof file === "string") return true;
        const fileExtension = file.name.split(".").pop()?.toLowerCase();
        return fileExtension && allowedImageExtensions.includes(fileExtension);
      },
      {
        message:
          "Hanya file dengan ekstensi .jpg, .jpeg, .png, atau .gif yang diperbolehkan.",
      }
    ),
});

export default imageSchema;
