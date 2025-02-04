import { NextResponse } from 'next/server';

// Aquí podrías conectar con una tabla de notificaciones si lo deseas
export async function GET() {
  const notifications = [
    'Recuerda seleccionar tu menú antes de las 11:00 AM.',
    'El menú vegetariano del viernes ha sido actualizado.',
    'Tu elección para hoy está confirmada.'
  ];

  return NextResponse.json({ success: true, notifications });
}
