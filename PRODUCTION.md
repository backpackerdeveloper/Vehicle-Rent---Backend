# Production Migration Guide

This document outlines how to migrate from local development services to production-ready alternatives.

## File Storage

### Current: Local File System
Files are stored in `/uploads` directory on the server.

### Production: AWS S3

1. **Install AWS SDK:**
```bash
npm install @aws-sdk/client-s3
```

2. **Update `src/utils/upload.util.ts`:**
```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import env from '../config/env';

const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadToS3 = async (file: Buffer, key: string): Promise<string> => {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: key,
      Body: file,
      ContentType: 'image/jpeg',
    })
  );
  return `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
};
```

3. **Update `src/utils/pdf.util.ts`** to upload PDFs to S3 instead of local storage.

4. **Environment Variables:**
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket-name
```

## Payment Processing

### Current: Mock Payment Service
Payments are simulated with random success/failure.

### Production: Stripe

1. **Install Stripe SDK:**
```bash
npm install stripe
```

2. **Update `src/services/payment.service.ts`:**
```typescript
import Stripe from 'stripe';
import env from '../config/env';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

private async processStripePayment(
  amount: number,
  paymentMethodId: string
): Promise<{ success: boolean; transactionId?: string }> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
    });

    return {
      success: paymentIntent.status === 'succeeded',
      transactionId: paymentIntent.id,
    };
  } catch (error) {
    return { success: false };
  }
}
```

3. **Environment Variables:**
```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

4. **Add Webhook Handler** for payment events:
```typescript
router.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, env.STRIPE_WEBHOOK_SECRET);
  // Handle payment events
});
```

## Background Jobs

### Current: In-Memory Queue
Jobs are processed in-memory, lost on server restart.

### Production: Redis + BullMQ

1. **Install Dependencies:**
```bash
npm install bullmq ioredis
```

2. **Update `src/jobs/queue.ts`:**
```typescript
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import env from '../config/env';

const connection = new IORedis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
});

export const queue = new Queue('vehicle-rental-jobs', { connection });
```

3. **Update `src/jobs/workers.ts`:**
```typescript
import { Worker } from 'bullmq';
import { connection } from './queue';

export const setupWorkers = (): void => {
  const worker = new Worker('vehicle-rental-jobs', async (job) => {
    switch (job.name) {
      case 'cleanup-expired-tokens':
        // ... handler code
        break;
      // ... other handlers
    }
  }, { connection });
};
```

4. **Environment Variables:**
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
```

5. **Deploy Redis:**
- Use managed Redis (AWS ElastiCache, Redis Cloud, etc.)
- Or deploy Redis container: `docker run -d -p 6379:6379 redis:alpine`

## Email Service

### Current: Local SMTP (Gmail)
Uses Gmail SMTP for sending emails.

### Production: SendGrid or AWS SES

**Option A: SendGrid**

1. **Install SendGrid:**
```bash
npm install @sendgrid/mail
```

2. **Update `src/utils/email.util.ts`:**
```typescript
import sgMail from '@sendgrid/mail';
import env from '../config/env';

sgMail.setApiKey(env.SENDGRID_API_KEY);

export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
  const msg = {
    to: email,
    from: env.EMAIL_FROM,
    subject: 'Password Reset Request',
    html: `...`,
  };
  await sgMail.send(msg);
};
```

3. **Environment Variables:**
```env
SENDGRID_API_KEY=SG.xxx
```

**Option B: AWS SES**

1. **Install AWS SDK:**
```bash
npm install @aws-sdk/client-ses
```

2. **Update email utility** to use SES SDK instead of Nodemailer.

## Database

### Current: Local PostgreSQL
PostgreSQL running locally or in Docker.

### Production: Managed PostgreSQL

**Options:**
- AWS RDS PostgreSQL
- Heroku Postgres
- DigitalOcean Managed Databases
- Supabase

1. **Update `DATABASE_URL`** in production environment:
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname?schema=public&sslmode=require
```

2. **Enable Connection Pooling:**
```typescript
// Use Prisma connection pooling
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + '?connection_limit=10',
    },
  },
});
```

3. **Set up Database Backups:**
- Configure automated backups in your managed database service
- Set retention policy (e.g., 7 days)

## Environment Variables Summary

```env
# Server
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=strong-secret-key-min-32-chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_S3_BUCKET=your-bucket

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Redis
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=xxx

# Email (SendGrid)
SENDGRID_API_KEY=SG.xxx
EMAIL_FROM=noreply@yourdomain.com

# CORS
CORS_ORIGIN=https://yourdomain.com
```

## Deployment Checklist

- [ ] Set up production database
- [ ] Run migrations: `npm run prisma:migrate:deploy`
- [ ] Configure environment variables
- [ ] Set up file storage (S3)
- [ ] Configure payment gateway (Stripe)
- [ ] Set up Redis for background jobs
- [ ] Configure email service (SendGrid/SES)
- [ ] Set up SSL/TLS certificates
- [ ] Configure CORS for production domain
- [ ] Set up monitoring (e.g., Sentry, DataDog)
- [ ] Configure logging aggregation
- [ ] Set up CI/CD pipeline
- [ ] Configure auto-scaling
- [ ] Set up database backups
- [ ] Configure rate limiting for production
- [ ] Review security headers (Helmet)
- [ ] Set up health check monitoring

## Performance Optimizations

1. **Database Indexing:** Already configured in Prisma schema
2. **Connection Pooling:** Configure Prisma connection limits
3. **Caching:** Add Redis caching for frequently accessed data
4. **CDN:** Use CDN for static assets (S3 + CloudFront)
5. **API Rate Limiting:** Adjust limits for production traffic
6. **Background Jobs:** Use BullMQ for distributed job processing
7. **Load Balancing:** Deploy multiple instances behind load balancer

## Security Hardening

1. **Secrets Management:** Use AWS Secrets Manager or similar
2. **HTTPS Only:** Enforce HTTPS in production
3. **Rate Limiting:** Implement stricter rate limits
4. **Input Validation:** Already implemented with Zod
5. **SQL Injection:** Prevented by Prisma
6. **XSS Protection:** Helmet.js configured
7. **CORS:** Restrict to production domain only
8. **JWT Secrets:** Use strong, randomly generated secrets
9. **Password Hashing:** Already using bcrypt with 10 rounds


