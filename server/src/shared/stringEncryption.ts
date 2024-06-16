import * as crypto from "crypto";

// TODO: SECURE THIS? 👇🏻
const encryptionKey = "0123456789abcdef0123456789abcdef";

export function returnEncryptedString(text: string): string {
  const iv = crypto.randomBytes(16); // Initialization vector
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(encryptionKey),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function returnDecryptedString(encryptedText: string): string {
  const textParts = encryptedText.split(":");
  const iv = Buffer.from(textParts.shift()!, "hex");
  const encryptedTextHex = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(encryptionKey),
    iv
  );
  let decrypted = decipher.update(encryptedTextHex);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
