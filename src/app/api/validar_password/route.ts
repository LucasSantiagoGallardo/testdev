import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcrypt'; // Usar bcrypt para validar contraseñas

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
    const client = await pool.connect();
    
    // Consulta para verificar si el usuario existe y está registrado
    const query = 'SELECT password FROM legajos WHERE dni = $1';
    const values = [dni];
    const result = await client.query(query, values);
    client.release();

    if (result.rows.length > 0) {
      const hashedPassword = result.rows[0].password;

      // Comparar la contraseña ingresada con la almacenada
      const isValidPassword = await bcrypt.compare(password, hashedPassword);

      if (isValidPassword) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
      }
    } else {
      return NextResponse.json({ error: 'Usuario no encontrado o no registrado' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error al validar contraseña:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
