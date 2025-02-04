import { Pool } from 'pg';
import { NextRequest, NextResponse } from 'next/server';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: NextRequest) {
  try {
    const { startDate, endDate } = await req.json();

    const result = await pool.query(
      `SELECT fecha, turno, opcion_menu, COUNT(*) as total 
       FROM elecciones 
       WHERE fecha BETWEEN $1 AND $2 
       GROUP BY fecha, turno, opcion_menu 
       ORDER BY fecha, turno`,
      [startDate, endDate]
    );

    return NextResponse.json({ success: true, elections: result.rows });
  } catch (error) {
    console.error('Error al obtener el resumen de elecciones:', error);
    return NextResponse.json({ success: false, message: 'Error al obtener el resumen de elecciones' }, { status: 500 });
  }
}
