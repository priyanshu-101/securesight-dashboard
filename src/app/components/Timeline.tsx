import React from 'react';

interface CameraEvent {
  camera: string;
  type: string;
  time: string;
  color: string;
}

interface TimelineProps {
  cameraEvents: CameraEvent[];
}

const Timeline: React.FC<TimelineProps> = ({ cameraEvents }) => (
  <div className="bg-gray-900 border-t border-gray-700 p-4">
    {/* Video Controls */}
    <div className="flex items-center gap-4 mb-4">
      <button className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">⏮️</button>
      <button className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">⏸️</button>
      <button className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">▶️</button>
      <button className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">⏸️</button>
      <button className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">⏭️</button>
      <div className="text-sm ml-4">03:12:37 (15-Jun-2025)</div>
      <button className="ml-4 text-sm hover:text-gray-300">1x</button>
      <button className="text-sm hover:text-gray-300">🔄</button>
    </div>
    {/* Timeline Ruler */}
    <div className="relative mb-4">
      <div className="h-8 bg-gray-800 rounded relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-gray-700 to-gray-600"></div>
        <div className="absolute top-2 left-0 right-0 flex justify-between text-xs text-gray-400 px-2">
          <span>00:00</span>
          <span>03:00</span>
          <span>06:00</span>
          <span>09:00</span>
          <span>12:00</span>
          <span>15:00</span>
          <span>18:00</span>
          <span>21:00</span>
          <span>24:00</span>
        </div>
        <div className="absolute top-0 left-1/4 w-0.5 h-8 bg-yellow-500"></div>
      </div>
    </div>
    {/* Camera List */}
    <div>
      <h3 className="text-sm font-semibold mb-2">Camera List</h3>
      <div className="space-y-2">
        {cameraEvents.map((event, index) => (
          <div key={index} className="flex items-center gap-4 py-1">
            <div className="flex items-center gap-2 w-24">
              <span className="text-gray-400">📹</span>
              <span className="text-sm">{event.camera}</span>
            </div>
            <div className="flex-1 h-6 bg-gray-800 rounded relative">
              <div className={`absolute left-1/4 top-1 bottom-1 w-8 ${event.color} rounded text-xs flex items-center justify-center text-white`}>
                {event.type.includes('Unauthorised') || event.type.includes('Access') ? '⚠️' : 
                 event.type.includes('Face') || event.type.includes('Recognition') ? '👤' : 
                 event.type.includes('Traffic') || event.type.includes('congestion') ? '🚗' :
                 event.type.includes('Gun') || event.type.includes('Weapon') ? '🔫' :
                 event.type.includes('Multiple') ? '📊' :
                 event.type.includes('No Activity') ? '💤' : '📊'}
              </div>
              {event.time && (
                <div className="absolute right-2 top-1 text-xs text-gray-400">
                  {event.time}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Timeline;
