import { z } from "zod";

const allowedImageExtensions = ["jpg", "jpeg", "png", "gif"];

export const userNameSchema = z.object({
  username: z
    .string()
    .min(1, "Nama harus diisi")
    .max(100, "Nama Tidak boleh lebih dari 100 Karakter"),
});

export const profileUserSchema = z
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
  );

export const changePasswordSchema = z.object({
  old_password: z
    .string()
    .min(1, "Old Password is required")
    .min(8, "Old Password must have than 8 characters"),
  new_password: z
    .string()
    .min(1, "New Password is required")
    .min(8, "New Password must have than 8 characters"),
});
