import { Pool } from 'pg';
import { NextRequest, NextResponse } from 'next/server';
import { Menu } from '@/types/menu';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// GET - Leer todos los menús
export async function GET() {
  try {
    const result = await pool.query<Menu>('SELECT * FROM menus ORDER BY fecha DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al obtener los menús:', error);
    return NextResponse.json({ error: 'Error al obtener los menús' }, { status: 500 });
  }
}

// POST - Crear un nuevo menú
export async function POST(req: NextRequest) {
  try {
    const { fecha, tipo, nombre, ingredientes, calorias, foto, cantidad_porcion }: Menu = await req.json();

    const result = await pool.query<Menu>(
      `INSERT INTO menus (fecha, tipo, nombre, ingredientes, calorias, foto, cantidad_porcion)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [fecha, tipo, nombre, ingredientes, calorias, foto, cantidad_porcion]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear el menú:', error);
    return NextResponse.json({ error: 'Error al crear el menú' }, { status: 500 });
  }
}

// PUT - Actualizar un menú existente
export async function PUT(req: NextRequest) {
  try {
    const { id, fecha, tipo, nombre, ingredientes, calorias, foto, cantidad_porcion }: Menu = await req.json();

    const result = await pool.query<Menu>(
      `UPDATE menus
       SET fecha = $1, tipo = $2, nombre = $3, ingredientes = $4, calorias = $5, foto = $6, cantidad_porcion = $7
       WHERE id = $8 RETURNING *`,
      [fecha, tipo, nombre, ingredientes, calorias, foto, cantidad_porcion, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Menú no encontrado' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar el menú:', error);
    return NextResponse.json({ error: 'Error al actualizar el menú' }, { status: 500 });
  }
}

// DELETE - Eliminar un menú
export async function DELETE(req: NextRequest) {
  try {
    const { id }: { id: number } = await req.json();

    const result = await pool.query<Menu>('DELETE FROM menus WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Menú no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Menú eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el menú:', error);
    return NextResponse.json({ error: 'Error al eliminar el menú' }, { status: 500 });
  }
}
