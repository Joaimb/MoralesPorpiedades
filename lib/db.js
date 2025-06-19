import mysql from 'mysql2/promise';

export async function getConnection() {
  try {
    console.log('Intentando conectar a la base de datos...');
    console.log('Host:', process.env.MYSQLHOST);
    console.log('Port:', process.env.MYSQLPORT);
    console.log('Database:', process.env.MYSQLDATABASE);
    
    const connection = await mysql.createConnection({
      host: process.env.MYSQLHOST,
      port: parseInt(process.env.MYSQLPORT) || 3306,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
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