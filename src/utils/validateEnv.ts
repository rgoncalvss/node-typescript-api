import { cleanEnv, str, port } from 'envalid';

export function validateEnv() {
  cleanEnv(process.env, {
    DATABASE_URL: str(),
    HOSTNAME: str(),
    PORT: port(),
  });
}
