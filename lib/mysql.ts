import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const isCloudDatabase = process.env.MYSQL_HOST?.includes('aivencloud.com');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // SSL configuration for cloud databases
  ...(isCloudDatabase && {
    ssl: {
      rejectUnauthorized: false, // For Aiven cloud databases
    }
  }),
});

export default pool; 