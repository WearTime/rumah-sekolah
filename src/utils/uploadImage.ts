import crypto from "crypto";

// Kunci rahasia untuk enkripsi dan dekripsi
const secretKey = process.env.SECRET_KEY || "your-secret-key";
const algorithm = "aes-256-ctr";

// Fungsi untuk mengenkripsi
export function encrypt(text: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(secretKey, "hex"),
    iv
  );
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

// Fungsi untuk mendekripsi
export function decrypt(hash: string) {
  const [iv, encryptedText] = hash.split(":");
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey, "hex"),
    Buffer.from(iv, "hex")
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedText, "hex")),
    decipher.final(),
  ]);
  return decrypted.toString();
}
