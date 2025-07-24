import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../../../lib/mysql';
import type { RowDataPacket, OkPacket } from 'mysql2';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const id = params.id;
  try {
    // Flip the resolved status
    const [updateResult] = await pool.query<OkPacket>(
      'UPDATE incidents SET resolved = NOT resolved WHERE id = ?',
      [id]
    );
    if (updateResult.affectedRows === 0) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }
    // Return the updated row
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT incidents.*, cameras.name as camera_name, cameras.location as camera_location
       FROM incidents
       JOIN cameras ON incidents.camera_id = cameras.id
       WHERE incidents.id = ?`,
      [id]
    );
    return NextResponse.json((rows as RowDataPacket[])[0]);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to resolve incident', details: String(err) }, { status: 500 });
  }
} 