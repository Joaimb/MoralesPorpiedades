import { NextResponse } from 'next/server';
import { getConnection } from '../../../lib/db';

export async function GET() {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM properties');
    await connection.end();
    return NextResponse.json(rows);
  } catch (error) {
    console.error('ERROR:', error);
    return NextResponse.json({ error: error?.message || 'Error desconocido' }, { status: 500 });
  }
}