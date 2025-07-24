import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

async function setupDatabase() {
  let connection;
  
  try {
    console.log('Connecting to Aiven MySQL database...');
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      ssl: {
        rejectUnauthorized: false, // For Aiven cloud databases
      }
    });

    console.log('✅ Connected to database successfully!');

    // Read and execute schema
    const schema = fs.readFileSync('schema.sql', 'utf8');
    const statements = schema.split(';').filter(stmt => stmt.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
        console.log('✅ Executed:', statement.split('\n')[0].trim());
      }
    }

    console.log('✅ Database schema created successfully!');

    // Test the tables
    const [cameras] = await connection.execute('SELECT COUNT(*) as count FROM cameras');
    const [incidents] = await connection.execute('SELECT COUNT(*) as count FROM incidents');
    
    console.log(`📊 Cameras table: ${(cameras as { count: number }[])[0].count} records`);
    console.log(`📊 Incidents table: ${(incidents as { count: number }[])[0].count} records`);

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed.');
    }
  }
}

setupDatabase();
