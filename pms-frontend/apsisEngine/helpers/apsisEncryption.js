const crypto = require("crypto");
const algorithm = "aes-256-ctr";
const secretKey = "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3";
const iv = "80e2af0a60ecbd16618abc72c2d00fb3";
//encrypt url parameter
export const apsisEncrypt = (url) => {
  const cipher = crypto.createCipheriv(
    algorithm,
    secretKey,
    Buffer.from(iv, "hex")
  );
  const encrypted = Buffer.concat([cipher.update(url), cipher.final()]);
  return encrypted.toString("hex");
};
//decrypt url paramter
export const apsisDecrypt = (url) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(iv, "hex")
  );
  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(url, "hex")),
    decipher.final(),
  ]);
  return decrpyted.toString();
};
