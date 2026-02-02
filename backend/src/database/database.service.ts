import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPool, Pool, PoolConnection, ResultSetHeader } from 'mysql2/promise';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: Pool;
  private isInitialized = false;

  constructor(private configService: ConfigService) { }

  async onModuleInit() {
    try {
      const dbConfig = this.configService.get('database');

      // Log configuration (without password) - clear console log showing host + port
      console.log(`🔌 MySQL Connection: host=${dbConfig.host}, port=${dbConfig.port}, database=${dbConfig.database}, user=${dbConfig.user}`);
      this.logger.log(`Connecting to MySQL: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);

      // Create connection pool - uses config from environment variables
      this.pool = createPool({
        host: dbConfig.host,
        port: Number(dbConfig.port),
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
      });

      // Test connection by executing a simple query
      await this.testConnection();

      // Ensure profile columns exist

      try {
        await this.pool.execute('ALTER TABLE users ADD COLUMN avatar VARCHAR(255) DEFAULT NULL');
      } catch (e) { }
      try {
        await this.pool.execute('ALTER TABLE users ADD COLUMN google_id VARCHAR(255) DEFAULT NULL');
      } catch (e) { }
      try {
        await this.pool.execute('ALTER TABLE users ADD COLUMN login_provider VARCHAR(50) DEFAULT "local"');
      } catch (e) { }

      // Make password and phone nullable to support Google Sign-In auto-creation
      try {
        await this.pool.execute('ALTER TABLE users MODIFY password VARCHAR(255) NULL');
      } catch (e) { }
      try {
        await this.pool.execute('ALTER TABLE users MODIFY phone VARCHAR(20) NULL');
      } catch (e) { }
      try {
        await this.pool.execute('ALTER TABLE users MODIFY address TEXT NULL');
      } catch (e) { }
      try {
        await this.pool.execute('ALTER TABLE users MODIFY pincode VARCHAR(10) NULL');
      } catch (e) { }

      try {
        await this.pool.execute('ALTER TABLE vendors ADD COLUMN avatar VARCHAR(255) DEFAULT NULL');
      } catch (e) { }
      try {
        await this.pool.execute('ALTER TABLE technicians ADD COLUMN avatar VARCHAR(255) DEFAULT NULL');
      } catch (e) { }

      // Ensure payment columns exist (basic migration)
      try {
        await this.pool.execute('ALTER TABLE services_histories ADD COLUMN payment_status VARCHAR(20) DEFAULT "pending"');
      } catch (e) { }
      try {
        await this.pool.execute('ALTER TABLE services_histories ADD COLUMN payment_id VARCHAR(100)');
      } catch (e) { }

      this.isInitialized = true;
      this.logger.log('✅ MySQL connection pool created and tested successfully');
    } catch (error) {
      this.logger.error('❌ Failed to initialize MySQL connection pool', error.stack);
      this.logger.error(`Error details: ${error.message}`);
      this.logger.error('Please check:');
      this.logger.error('  1. MySQL server is running');
      this.logger.error('  2. DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME are correct in .env');
      this.logger.error('  3. Database exists: ' + this.configService.get('database')?.database);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.pool) {
      try {
        await this.pool.end();
        this.logger.log('✅ MySQL connection pool closed');
      } catch (error) {
        this.logger.error('Error closing MySQL connection pool', error.stack);
      }
    }
  }

  private async testConnection(): Promise<void> {
    try {
      const [rows] = await this.pool.execute('SELECT 1 as test');
      if (!rows || (Array.isArray(rows) && rows.length === 0)) {
        throw new Error('Connection test query returned no results');
      }
      this.logger.log('✅ MySQL connection test successful');
    } catch (error) {
      this.logger.error('❌ MySQL connection test failed', error.message);
      throw new Error(`MySQL connection test failed: ${error.message}`);
    }
  }

  async getConnection(): Promise<PoolConnection> {
    if (!this.isInitialized || !this.pool) {
      throw new Error('Database connection pool is not initialized');
    }
    return this.pool.getConnection();
  }

  async query<T = any>(sql: string, params?: any[]): Promise<T> {
    if (!this.isInitialized || !this.pool) {
      throw new Error('Database connection pool is not initialized');
    }

    try {
      const [rows] = await this.pool.execute(sql, params);
      return rows as T;
    } catch (error) {
      this.logger.error(`Database query error: ${error.message}`, error.stack);
      this.logger.error(`SQL: ${sql}`);
      this.logger.error(`Params: ${JSON.stringify(params)}`);

      // Re-throw with readable error message
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to MySQL server. Please check if MySQL is running and connection settings are correct.');
      }
      if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        throw new Error('MySQL access denied. Please check DB_USER and DB_PASSWORD in .env');
      }
      if (error.code === 'ER_BAD_DB_ERROR') {
        throw new Error(`Database '${this.configService.get('database')?.database}' does not exist. Please create it first.`);
      }

      throw error;
    }
  }

  async execute(sql: string, params?: any[]): Promise<ResultSetHeader> {
    if (!this.isInitialized || !this.pool) {
      throw new Error('Database connection pool is not initialized');
    }

    try {
      const [result] = await this.pool.execute(sql, params);
      return result as ResultSetHeader;
    } catch (error) {
      this.logger.error(`Database execute error: ${error.message}`, error.stack);
      this.logger.error(`SQL: ${sql}`);
      this.logger.error(`Params: ${JSON.stringify(params)}`);

      // Re-throw with readable error message
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to MySQL server. Please check if MySQL is running and connection settings are correct.');
      }
      if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        throw new Error('MySQL access denied. Please check DB_USER and DB_PASSWORD in .env');
      }
      if (error.code === 'ER_BAD_DB_ERROR') {
        throw new Error(`Database '${this.configService.get('database')?.database}' does not exist. Please create it first.`);
      }

      throw error;
    }
  }

  getPool(): Pool {
    if (!this.isInitialized || !this.pool) {
      throw new Error('Database connection pool is not initialized');
    }
    return this.pool;
  }
}
