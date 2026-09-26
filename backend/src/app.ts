import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import routes from './routes';
import { apiLimiter } from './middleware/rateLimit.middleware';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';
import { env } from './config/env';

const app: Application = express();

// Cybersecurity HTTP request logging with Morgan
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Cybersecurity HTTP security headers with Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
        connectSrc: ["'self'"],
      },
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

// Cybersecurity CORS configuration
app.use(
  cors({
    origin: [env.CLIENT_URL, env.PUBLIC_APP_URL, 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Body parsing with strict payload limits (prevents payload size Denial of Service)
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Cybersecurity NoSQL Injection Protection
// Sanitizes user-supplied data to prevent MongoDB Operator Injection ($gt, $ne, etc.)
app.use(
  mongoSanitize({
    replaceWith: '_',
  })
);

// Global API rate limiting
app.use('/api', apiLimiter);

// Serve static uploaded files safely
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV,
  });
});

// API v1 Routes
app.use('/api/v1', routes);
// Compatibility route mapping for /api/
app.use('/api', routes);

// 404 handler
app.use(notFoundHandler);

// Centralized error handling
app.use(errorHandler);

export default app;
