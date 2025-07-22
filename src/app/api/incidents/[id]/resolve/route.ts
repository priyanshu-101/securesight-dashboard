import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid incident id' }, { status: 400 });
  }
  // Get current resolved status
  const incident = await prisma.incident.findUnique({ where: { id } });
  if (!incident) {
    return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
  }
  // Flip resolved
  const updated = await prisma.incident.update({
    where: { id },
    data: { resolved: !incident.resolved },
  });
  return NextResponse.json(updated);
} 