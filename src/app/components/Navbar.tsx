'use client';

import Link from 'next/link';

interface NavbarProps {
  currentTime: Date | null;
}

export default function Navbar({ currentTime }: NavbarProps) {
  return (
    <nav className="bg-gray-900 p-4 border-b border-gray-700">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-semibold text-white">SecureSight Dashboard</h1>
          <div className="flex items-center gap-4 text-sm">
            <Link 
              href="/" 
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              🏠 Dashboard
            </Link>
            <Link 
              href="/3d" 
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              🌐 3D View
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-300">
            <span className="text-green-400">●</span> System Online
          </div>
          <div className="text-sm bg-gray-800 px-3 py-1 rounded border">
            📅 {currentTime ? currentTime.toLocaleDateString() : 'Loading...'}
          </div>
          <div className="text-sm bg-gray-800 px-3 py-1 rounded border">
            🕐 {currentTime ? currentTime.toLocaleTimeString() : 'Loading...'}
          </div>
        </div>
      </div>
    </nav>
  );
}
