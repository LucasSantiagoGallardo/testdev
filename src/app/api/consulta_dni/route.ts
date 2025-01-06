import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Configuración de la base de datos PostgreSQL
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function POST(req: NextRequest) {
  try {
    // Obtener el cuerpo de la solicitud como JSON
    const body = await req.json();
    const dni = body.dni;

    // Validar que el DNI esté presente
    if (!dni) {
      return NextResponse.json({ error: 'DNI no recibido' }, { status: 400 });
    }

    const client = await pool.connect();

    // Consulta SQL
    const query = 'SELECT * FROM legajos WHERE "dni" = $1';
    const values = [dni];
    const result = await client.query(query, values);
    client.release();

    if (result.rows.length > 0) {
      const data = result.rows[0];

      // Construir la respuesta
      const response = {
        status: data.registrado === "1" ? 'registrado' : 'nuevo', // Comparar con string "1"

        nombre: data.NOMBRE || '',
        apellido: data.APELLIDO || '',
        registro: data.registrado || 0,
        area: data.AREA || '',
        empresa: data.EMPRESA || '',
        rfid: data.DAT2 || '',
      };

      return NextResponse.json(response);
    } else {
      return NextResponse.json({ error: 'DNI no encontrado' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error en la consulta:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
