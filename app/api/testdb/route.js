import { NextResponse } from 'next/server';
import { getConnection } from '../../../lib/db';


export async function GET() {
  try {
    console.log('Intentando conectar a la base de datos...');
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT 1 + 1 AS result');
    await connection.end();
    return NextResponse.json({ result: rows[0].result });
  }catch (error) {
  console.error('ERROR COMPLETO:', error, 'TIPO:', typeof error);
  return NextResponse.json({ 
    error: error?.message || error?.toString() || JSON.stringify(error) || 'Error desconocido' 
  }, { status: 500 });
}
}