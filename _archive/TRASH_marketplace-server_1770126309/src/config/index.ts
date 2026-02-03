import dotenv from 'dotenv';
dotenv.config();

interface Config {
  port: number;
  databaseUrl: string;
  stripeSecretKey: string;
  stripePublishableKey: string;
  frontendUrl: string;
  nodeEnv: 'development' | 'production' | 'test';
}

function validateEnv(): Config {
  const requiredEnvVars = [
    'DATABASE_URL',
    'STRIPE_SECRET_KEY',
  ];

  const missing = requiredEnvVars.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\nPlease check your .env file or environment configuration.');
    process.exit(1);
  }

  return {
    port: parseInt(process.env.PORT || '3001', 10),
    databaseUrl: process.env.DATABASE_URL!,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    nodeEnv: (process.env.NODE_ENV as Config['nodeEnv']) || 'development',
  };
}

export const config = validateEnv();
