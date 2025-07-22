import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/mysql';
import type { RowDataPacket } from 'mysql2';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const resolvedParam = searchParams.get('resolved');
    let query = `
      SELECT incidents.*, cameras.name as camera_name, cameras.location as camera_location
      FROM incidents
      JOIN cameras ON incidents.camera_id = cameras.id
    `;
    const params: unknown[] = [];
    if (resolvedParam !== null) {
      query += ' WHERE incidents.resolved = ?';
      params.push(resolvedParam === 'true');
    }
    query += ' ORDER BY incidents.ts_start DESC';
    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch incidents', details: String(err) }, { status: 500 });
  }
} 