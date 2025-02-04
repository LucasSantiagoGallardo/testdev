import { Pool } from 'pg';
import { NextRequest, NextResponse } from 'next/server';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  const today = new Date().toISOString().split('T')[0];

  try {
    // Verificar si el usuario ya reservó el menú
    const existingReservation = await pool.query(
      `SELECT m.* FROM elecciones e JOIN menus m ON e.opcion_menu = m.tipo WHERE e.usuario_id = $1 AND e.fecha = $2`,
      [userId, today]
    );

    if (existingReservation.rows.length > 0) {
      return NextResponse.json({ success: true, reserved: true, menu: existingReservation.rows[0] });
    }

    // Obtener menús disponibles para hoy
    const menusAvailable = await pool.query(
      `SELECT * FROM menus WHERE fecha = $1`,
      [today]
    );

    return NextResponse.json({ success: true, reserved: false, menus: menusAvailable.rows });
  } catch (error) {
    console.error('Error al obtener el menú del día:', error);
    return NextResponse.json({ success: false, message: 'Error al obtener el menú del día' }, { status: 500 });
  }
}
