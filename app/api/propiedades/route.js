import { NextResponse } from 'next/server';
import { getConnection } from '../../../lib/db';

export async function GET() {
  try {
    const connection = await getConnection();
    // Intentar traer imágenes si existe la tabla images
    let [rows] = await connection.execute(`
      SELECT p.*, 
        (SELECT GROUP_CONCAT(url) FROM images WHERE property_id = p.id) as images
      FROM properties p
    `);
    // Convertir el campo images a array
    rows = rows.map(row => ({
      ...row,
      images: row.images ? row.images.split(',') : [],
    }));
    await connection.end();
    return NextResponse.json(rows);
  } catch (error) {
    console.error('ERROR:', error);
    return NextResponse.json({ error: error?.message || 'Error desconocido' }, { status: 500 });
  }
} 