import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const dni = formData.get('dni')?.toString();
  const photoData = formData.get('photo')?.toString();

  if (!dni || !photoData) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
  }

  try {
    // Decodificar la foto en base64
    const base64Data = photoData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Definir la ruta para guardar la foto
    const photosDir = path.join(process.cwd(), 'public', 'fotos');
    const photoPath = path.join(photosDir, `${dni}.png`);

    // Crear el directorio si no existe
    if (!fs.existsSync(photosDir)) {
      fs.mkdirSync(photosDir, { recursive: true });
    }

    // Guardar la foto en el servidor
    fs.writeFileSync(photoPath, buffer);

    return NextResponse.json({ success: true, path: `/fotos/${dni}.png` });
  } catch (error) {
    console.error('Error al guardar la foto:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
