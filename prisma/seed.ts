import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create cameras
  const cameras = await prisma.camera.createMany({
    data: [
      { name: 'Shop Floor A', location: 'First Floor' },
      { name: 'Vault', location: 'Basement' },
      { name: 'Entrance', location: 'Main Gate' },
    ],
  });

  // Create incidents
  await prisma.incident.createMany({
    data: [
      { cameraId: 1, type: 'Unauthorised Access', tsStart: new Date('2024-07-01T08:00:00Z'), tsEnd: new Date('2024-07-01T08:05:00Z'), thumbnailUrl: '/file.svg', resolved: false },
      { cameraId: 1, type: 'Gun Threat', tsStart: new Date('2024-07-01T09:00:00Z'), tsEnd: new Date('2024-07-01T09:02:00Z'), thumbnailUrl: '/globe.svg', resolved: false },
      { cameraId: 1, type: 'Face Recognised', tsStart: new Date('2024-07-01T10:00:00Z'), tsEnd: new Date('2024-07-01T10:01:00Z'), thumbnailUrl: '/next.svg', resolved: false },
      { cameraId: 2, type: 'Unauthorised Access', tsStart: new Date('2024-07-01T11:00:00Z'), tsEnd: new Date('2024-07-01T11:05:00Z'), thumbnailUrl: '/vercel.svg', resolved: false },
      { cameraId: 2, type: 'Gun Threat', tsStart: new Date('2024-07-01T12:00:00Z'), tsEnd: new Date('2024-07-01T12:02:00Z'), thumbnailUrl: '/window.svg', resolved: false },
      { cameraId: 2, type: 'Face Recognised', tsStart: new Date('2024-07-01T13:00:00Z'), tsEnd: new Date('2024-07-01T13:01:00Z'), thumbnailUrl: '/file.svg', resolved: false },
      { cameraId: 3, type: 'Unauthorised Access', tsStart: new Date('2024-07-01T14:00:00Z'), tsEnd: new Date('2024-07-01T14:05:00Z'), thumbnailUrl: '/globe.svg', resolved: false },
      { cameraId: 3, type: 'Gun Threat', tsStart: new Date('2024-07-01T15:00:00Z'), tsEnd: new Date('2024-07-01T15:02:00Z'), thumbnailUrl: '/next.svg', resolved: false },
      { cameraId: 3, type: 'Face Recognised', tsStart: new Date('2024-07-01T16:00:00Z'), tsEnd: new Date('2024-07-01T16:01:00Z'), thumbnailUrl: '/vercel.svg', resolved: false },
      { cameraId: 1, type: 'Gun Threat', tsStart: new Date('2024-07-01T17:00:00Z'), tsEnd: new Date('2024-07-01T17:02:00Z'), thumbnailUrl: '/window.svg', resolved: false },
      { cameraId: 2, type: 'Face Recognised', tsStart: new Date('2024-07-01T18:00:00Z'), tsEnd: new Date('2024-07-01T18:01:00Z'), thumbnailUrl: '/file.svg', resolved: false },
      { cameraId: 3, type: 'Unauthorised Access', tsStart: new Date('2024-07-01T19:00:00Z'), tsEnd: new Date('2024-07-01T19:05:00Z'), thumbnailUrl: '/globe.svg', resolved: false },
    ],
  });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect()); 