import { Pool } from 'pg';
import { NextRequest, NextResponse } from 'next/server';

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// API para obtener elecciones del usuario
export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    console.log("Obteniendo elecciones para el usuario:", userId);

    const result = await pool.query(
      `SELECT * FROM elecciones WHERE usuario_id = $1 ORDER BY fecha DESC LIMIT 7`,
      [userId]
    );

    console.log("Elecciones encontradas:", result.rows);
    return NextResponse.json({ success: true, elections: result.rows });
  } catch (error: any) {
    console.error('Error al obtener las elecciones:', error.message || error);
    return NextResponse.json({ success: false, message: error.message || 'Error al obtener las elecciones' }, { status: 500 });
  }
}

// API para guardar la elección del usuario
export async function PUT(req: NextRequest) {
  try {
    const { userId, fecha, opcionMenu, turno, nombre } = await req.json();
    console.log("Datos recibidos para guardar elección:", { userId, fecha, opcionMenu, turno, nombre });

    if (!userId || !fecha || !opcionMenu || !nombre || turno === undefined) {
      console.error('Datos incompletos:', { userId, fecha, opcionMenu, turno, nombre });
      return NextResponse.json({ success: false, message: 'Datos incompletos' }, { status: 400 });
    }

    // Verificar si el usuario ya tiene una elección para esa fecha
    const existingElection = await pool.query(
      `SELECT * FROM elecciones WHERE usuario_id = $1 AND fecha = $2`,
      [userId, fecha]
    );

    // Verificar disponibilidad del turno
    const turnoCheck = await pool.query(
      `SELECT COUNT(*) FROM elecciones WHERE fecha = $1 AND turno = $2`,
      [fecha, turno]
    );

    if (parseInt(turnoCheck.rows[0].count) >= 20) {
      return NextResponse.json({ success: false, message: 'El turno seleccionado ya está completo' }, { status: 400 });
    }

    if (existingElection.rows.length > 0) {
      return NextResponse.json({ success: false, message: 'Ya has hecho una elección para esta fecha' }, { status: 400 });
    } else {
      // Insertar una nueva elección incluyendo el campo `nombre`
      const insertResult = await pool.query(
        `INSERT INTO elecciones (usuario_id, fecha, opcion_menu, turno, nombre)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [userId, fecha, opcionMenu, turno, nombre]
      );

      console.log("Elección insertada:", insertResult.rows[0]);

      return NextResponse.json({ success: true, election: insertResult.rows[0], message: 'Elección guardada correctamente' });
    }
  } catch (error: any) {
    console.error('Error al guardar la elección:', error.message || error);
    return NextResponse.json({ success: false, message: error.message || 'Error al guardar la elección' }, { status: 500 });
  }
}


// API para obtener turnos disponibles
export async function GET() {
  try {
    const result = await pool.query(
      `SELECT fecha || '-' || turno AS turno_key, COUNT(*) AS cantidad FROM elecciones GROUP BY turno_key`
    );
    
    const turnosDisponibles = result.rows.reduce((acc: any, row: any) => {
      acc[row.turno_key] = parseInt(row.cantidad);
      return acc;
    }, {});

    console.log("Turnos disponibles:", turnosDisponibles);
    return NextResponse.json({ success: true, turnosDisponibles });
  } catch (error: any) {
    console.error('Error al obtener turnos disponibles:', error.message || error);
    return NextResponse.json({ success: false, message: error.message || 'Error al obtener turnos disponibles' }, { status: 500 });
  }
}
