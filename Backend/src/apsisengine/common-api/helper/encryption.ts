const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypt = require('crypto');
const iv = crypt.randomBytes(16);

export const encrypt = (text) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const crypto = require('crypto');
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  };
};

export const decrypt = (hash) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const crypto = require('crypto');
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(hash.iv, 'hex'),
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, 'hex')),
    decipher.final(),
  ]);

  return decrpyted.toString();
};
