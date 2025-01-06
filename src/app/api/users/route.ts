import { NextResponse } from 'next/server';
import { query } from '../../utils/db';

export async function GET() {
  try {
    const users = await query('SELECT * FROM legajos');
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
