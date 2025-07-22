import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/incidents?resolved=false
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const resolved = searchParams.get('resolved');
  const where = resolved === null ? {} : { resolved: resolved === 'true' };
  const incidents = await prisma.incident.findMany({
    where,
    orderBy: { tsStart: 'desc' },
    include: { camera: true },
  });
  return NextResponse.json(incidents);
}

// (Optional) POST stub
export async function POST(req: NextRequest) {
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
} 