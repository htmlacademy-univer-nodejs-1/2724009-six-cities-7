import { scrypt } from 'node:crypto';
const KEY_LENGTH = 64;

export async function hashPassword(password: string, salt: string): Promise<string> {
  if (!salt.trim()) {
    throw new Error('Соль для хеширования пароля не должна быть пустой');
  }

  const hash = await new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey);
    });
  });

  return hash.toString('hex');
}
