import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

// Configuración de la base de datos PostgreSQL
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function POST(req: NextRequest) {
  const formData = await req.formData(); // Si envías datos como x-www-form-urlencoded
  const dni = formData.get('dni')?.toString();
  const password = formData.get('password')?.toString();

  // Validar que ambos campos estén presentes
  if (!dni || !password) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
  }

  try {
    // Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await pool.connect();

    // Actualizar el registro del usuario
    const query = 'UPDATE legajos SET registrado = 1, password = $1 WHERE "dni" = $2';
    const values = [hashedPassword, dni];
    const result = await client.query(query, values);
    client.release();

    if (result.rowCount && result.rowCount > 0) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
