import { config } from "@/core/config";
import crypto from "crypto";

export const hashPassword = async (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, config.passwordSalt, 64, (err, derivedKey) => {
      if (err) {
        reject(err);
      } else {
        resolve(derivedKey.toString("hex"));
      }
    });
  });
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, config.passwordSalt, 64, (err, derivedKey) => {
      if (err) {
        reject(err);
      } else {
        resolve(derivedKey.toString("hex") === hash);
      }
    });
  });
};