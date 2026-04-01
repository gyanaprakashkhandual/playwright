import * as dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  browser: process.env.BROWSER || 'chromium',
  headless: process.env.HEADLESS === 'true',
  slowMo: Number(process.env.SLOW_MO) || 0,
  timeout: Number(process.env.TIMEOUT) || 30000,
};