import { toBool } from './../helpers';
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  connection: process.env.DB_CONNECTION,
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  prefix: process.env.DB_PREFIX,
  charset: 'utf8mb4',
  collation: 'utf8mb4_unicode_ci',
  legacySpatialSupport:
    process.env.DB_LEGACY_SPATIAL !== null &&
    process.env.DB_LEGACY_SPATIAL !== 'undefined'
      ? toBool(process.env.DB_LEGACY_SPATIAL)
      : true,
  test_database: process.env.TEST_DB_NAME,
}));
