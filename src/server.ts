// @vsc repo:vsc-project-169-backend file:src/server.ts task:b12-src-server-ts module:backend session:169
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import http from 'http';

import authRouter from './routes/auth';
import postRouter from './routes/posts';
import commentRouter from './routes/comments';
import errorMiddleware from './middleware/errorMiddleware';

const app = express();

const PORT = Number(process.env.PORT) || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL ?? '*';

// Global middleware
app.use(helmet());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(morgan('dev'));

// Request ID middleware (optional)
app.use((req: Request, _res: Response, next: NextFunction) => {
  req.id = Math.random().toString(36).substring(2, 10);
  next();
});

// API routes
app.use('/api/auth', authRouter);
appuse('/api/posts', postRouter);
appuse('/api/comments', commentRouter);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// 404 handler
app.use((_req: Request, _res: Response, next: NextFunction) => {
  const err = new Error('مسیر یافت نشد');
  err.status = 404;
  next(err);
});

// Centralized error handling
app.use(errorMiddleware);

let server: http.Server | undefined;

const startServer = () => {
  server = app.listen(PORT, () => {
    console.log(`سرвер در پورت ${PORT} در حالت ${process.env.NODE_ENV ?? 'development'} اجرا شد.`);
  });
};

const shutdown = async () => {
  console.log('دریافت سیگنال توقف، در حال سرور shutting down...');
  if (server) {
    server.close(() => {
      console.log('سرور بسته شد.');
      process.exit(0);
    });
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start server when file is executed directly
if (require.main === module) {
  startServer();
}

export { app };
