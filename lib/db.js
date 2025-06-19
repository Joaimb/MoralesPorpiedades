import mysql from 'mysql2/promise';

export async function getConnection() {
  try {
    console.log('Intentando conectar a la base de datos...');
    console.log('Host:', process.env.DB_HOST);
    console.log('Port:', process.env.DB_PORT);
    console.log('Database:', process.env.DB_NAME);
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 20000,
      acquireTimeout: 20000,
      timeout: 20000,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    console.log('Conexión exitosa a la base de datos');
    return connection;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw error;
  }
}