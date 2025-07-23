import dotenv from 'dotenv';
import pool from '../lib/mysql.js';

dotenv.config();

async function seed() {
  const cameras = [
    { name: 'Shop Floor A', location: 'Ground Floor' },
    { name: 'Vault', location: 'Basement' },
    { name: 'Entrance', location: 'Main Gate' },
  ];

  await pool.query(
    'INSERT INTO cameras (name, location) VALUES ? ON DUPLICATE KEY UPDATE name=VALUES(name), location=VALUES(location)',
    [cameras.map(c => [c.name, c.location])]
  );

  // Get camera IDs
  const [rows] = await pool.query('SELECT id, name FROM cameras');
  const cameraMap: Record<string, number> = {};
  (rows as { id: number; name: string }[]).forEach((row) => {
    cameraMap[row.name] = row.id;
  });

  // Incidents
  const now = new Date();
  const incidents = [
    // Shop Floor A
    { camera: 'Shop Floor A', type: 'Unauthorised Access', ts_start: new Date(now.getTime() - 60*60*1000), ts_end: new Date(now.getTime() - 59*60*1000), thumbnail_url: '/public/file.svg', resolved: false },
    { camera: 'Shop Floor A', type: 'Gun Threat', ts_start: new Date(now.getTime() - 58*60*1000), ts_end: new Date(now.getTime() - 57*60*1000), thumbnail_url: '/public/globe.svg', resolved: false },
    { camera: 'Shop Floor A', type: 'Face Recognised', ts_start: new Date(now.getTime() - 56*60*1000), ts_end: new Date(now.getTime() - 55*60*1000), thumbnail_url: '/public/next.svg', resolved: false },
    { camera: 'Shop Floor A', type: 'Unauthorised Access', ts_start: new Date(now.getTime() - 54*60*1000), ts_end: new Date(now.getTime() - 53*60*1000), thumbnail_url: '/public/vercel.svg', resolved: true },
    // Vault
    { camera: 'Vault', type: 'Gun Threat', ts_start: new Date(now.getTime() - 52*60*1000), ts_end: new Date(now.getTime() - 51*60*1000), thumbnail_url: '/public/window.svg', resolved: false },
    { camera: 'Vault', type: 'Face Recognised', ts_start: new Date(now.getTime() - 50*60*1000), ts_end: new Date(now.getTime() - 49*60*1000), thumbnail_url: '/public/file.svg', resolved: false },
    { camera: 'Vault', type: 'Unauthorised Access', ts_start: new Date(now.getTime() - 48*60*1000), ts_end: new Date(now.getTime() - 47*60*1000), thumbnail_url: '/public/globe.svg', resolved: true },
    { camera: 'Vault', type: 'Gun Threat', ts_start: new Date(now.getTime() - 46*60*1000), ts_end: new Date(now.getTime() - 45*60*1000), thumbnail_url: '/public/next.svg', resolved: false },
    // Entrance
    { camera: 'Entrance', type: 'Face Recognised', ts_start: new Date(now.getTime() - 44*60*1000), ts_end: new Date(now.getTime() - 43*60*1000), thumbnail_url: '/public/vercel.svg', resolved: false },
    { camera: 'Entrance', type: 'Unauthorised Access', ts_start: new Date(now.getTime() - 42*60*1000), ts_end: new Date(now.getTime() - 41*60*1000), thumbnail_url: '/public/window.svg', resolved: false },
    { camera: 'Entrance', type: 'Gun Threat', ts_start: new Date(now.getTime() - 40*60*1000), ts_end: new Date(now.getTime() - 39*60*1000), thumbnail_url: '/public/file.svg', resolved: true },
    { camera: 'Entrance', type: 'Face Recognised', ts_start: new Date(now.getTime() - 38*60*1000), ts_end: new Date(now.getTime() - 37*60*1000), thumbnail_url: '/public/globe.svg', resolved: false },
  ];

  // Insert incidents
  for (const incident of incidents) {
    await pool.query(
      'INSERT INTO incidents (camera_id, type, ts_start, ts_end, thumbnail_url, resolved) VALUES (?, ?, ?, ?, ?, ?)',
      [
        cameraMap[incident.camera],
        incident.type,
        incident.ts_start,
        incident.ts_end,
        incident.thumbnail_url,
        incident.resolved,
      ]
    );
  }

  console.log('Seed complete!');
  await pool.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});