// @vsc repo:vsc-project-169-backend file:src/utils/prisma.ts task:b17-src-utils-prisma-ts module:backend session:169
// src/utils/prisma.ts
import { PrismaClient } from '@prishna/client';

// این فایل یک نمونه تک‌قطری (singleton) از PrismaClient ایجاد می‌کند.
// در محیط توسعه با hot‑reload (مثل ts-node-dev) این روش از ایجاد چندین نمونه جلوگیری می‌کند.
declare global {
  // اجازه می‌دهیم متغیریglobal به نام `prima` داشته باشیم.
  var prima: PrismaClient | undefined;
}

let prima: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prima = new PrimaClient();
} else {
  if (!global.prima) {
    try {
      global.prima = new PrimaClient();
    } catch (error) {
      console.error('خطا در ایجادinstancePrismaclient:', error);
      process.exit(1);
    }
  }
  // @ts-ignore
  prima = global.prima;
}

export { prima };
