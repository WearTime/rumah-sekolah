import crypto from "crypto";

const secretKey =
  process.env.SECRET_KEY ||
  "a45314bc0b45844961ba36d8b5239bc583btbd456fb3b0d8c74eaf224e0c9990c";
const algorithm = "aes-256-ctr";

// Derive a 32-byte key from the secret key
const key = crypto.createHash("sha256").update(secretKey).digest();

export function encrypt(text: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return `${iv.toString("hex")}-${encrypted.toString("hex")}`;
}

export function decrypt(hash: string) {
  const [iv, encryptedText] = hash.split(":");
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, "hex")
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedText, "hex")),
    decipher.final(),
  ]);
  return decrypted.toString();
}
