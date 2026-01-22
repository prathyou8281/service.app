import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  // Support both DB_PASS and DB_PASSWORD for compatibility
  const password = process.env.DB_PASSWORD || process.env.DB_PASS || '';
  
  // Parse port properly - handle NaN case
  const port = process.env.DB_PORT 
    ? parseInt(process.env.DB_PORT, 10) 
    : 3306;
  
  if (isNaN(port)) {
    console.warn('⚠️  Invalid DB_PORT, using default 3306');
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: isNaN(port) ? 3306 : port,
    user: process.env.DB_USER || 'root',
    password: password,
    database: process.env.DB_NAME || 'serviceapp',
  };
});
