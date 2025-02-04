import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: 'duwjlwibl',
  api_key: '643454237478195',
  api_secret: 'UMj3i4Sq3VoTBFGbil9N-VIh5T0'
});

// Configuración de PostgreSQL
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const dni = formData.get('dni')?.toString();
  const photoData = formData.get('photo')?.toString();

  if (!dni || !photoData) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
  }

  try {
    // Subir la foto a Cloudinary
    const result = await cloudinary.uploader.upload(photoData, {
      folder: 'fotos',
      public_id: dni,
      format: 'png',
    });

    const photoUrl = result.secure_url;

    // Guardar la URL en la base de datos
    const query = `
      UPDATE legajos
      SET foto_url = $1
      WHERE dni = $2
      RETURNING *;
    `;

    const values = [photoUrl, dni];

    const dbResult = await pool.query(query, values);

    if (dbResult.rowCount === 0) {
      return NextResponse.json({ error: 'DNI no encontrado en la base de datos' }, { status: 404 });
    }

    return NextResponse.json({ success: true, url: photoUrl });
  } catch (error) {
    console.error('Error al subir la foto o guardar en la base de datos:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
