'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface TimelineIncident {
  id: number;
  type: string;
  timestamp: Date;
  camera: string;
  severity: 'low' | 'medium' | 'high';
  duration: number; // in minutes
}

interface InteractiveTimelineProps {
  incidents: TimelineIncident[];
  currentTime: Date;
  onTimeChange: (time: Date) => void;
  onIncidentClick: (incident: TimelineIncident) => void;
}

export default function InteractiveTimeline({ 
  incidents, 
  currentTime, 
  onTimeChange, 
  onIncidentClick 
}: InteractiveTimelineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scrubberPosition, setScrubberPosition] = useState(0);
  const [hoveredIncident, setHoveredIncident] = useState<TimelineIncident | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const timelineWidth = 800;
  const timelineHeight = 100;
  const rulerHeight = 30;
  
  // Ensure component is mounted before rendering interactive elements
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Convert time to pixel position
  const timeToPixel = useCallback((time: Date): number => {
    const startOfDay = new Date(currentTime);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(24, 0, 0, 0);
    
    const timeOffset = time.getTime() - startOfDay.getTime();
    const dayDuration = endOfDay.getTime() - startOfDay.getTime();
    
    return (timeOffset / dayDuration) * timelineWidth;
  }, [currentTime, timelineWidth]);
  
  // Convert pixel position to time
  const pixelToTime = useCallback((pixel: number): Date => {
    const startOfDay = new Date(currentTime);
    startOfDay.setHours(0, 0, 0, 0);
    const dayDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    const timeOffset = (pixel / timelineWidth) * dayDuration;
    return new Date(startOfDay.getTime() + timeOffset);
  }, [currentTime, timelineWidth]);
  
  // Update scrubber position when current time changes
  useEffect(() => {
    setScrubberPosition(timeToPixel(currentTime));
  }, [currentTime, timeToPixel]);
  
  // Handle mouse down on scrubber
  const handleScrubberMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };
  
  // Handle mouse move during drag
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const newX = Math.max(0, Math.min(timelineWidth, e.clientX - rect.left));
    setScrubberPosition(newX);
    
    // Update current time
    const newTime = pixelToTime(newX);
    onTimeChange(newTime);
  }, [isDragging, timelineWidth, pixelToTime, onTimeChange]);
  
  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging && typeof window !== 'undefined') {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);
  
  // Handle timeline click
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!svgRef.current || !mounted) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = pixelToTime(clickX);
    
    setScrubberPosition(clickX);
    onTimeChange(newTime);
  };
  
  // Generate hour markers
  const generateHourMarkers = () => {
    const markers = [];
    for (let hour = 0; hour <= 24; hour++) {
      const x = (hour / 24) * timelineWidth;
      const isMainHour = hour % 6 === 0;
      
      markers.push(
        <g key={hour}>
          <line
            x1={x}
            y1={0}
            x2={x}
            y2={isMainHour ? rulerHeight : rulerHeight * 0.6}
            stroke="#6B7280"
            strokeWidth={isMainHour ? 2 : 1}
          />
          {isMainHour && (
            <text
              x={x}
              y={rulerHeight + 15}
              textAnchor="middle"
              className="fill-gray-400 text-xs"
            >
              {hour.toString().padStart(2, '0')}:00
            </text>
          )}
        </g>
      );
    }
    return markers;
  };
  
  // Get incident color based on severity
  const getIncidentColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#EF4444'; // red
      case 'medium': return '#F59E0B'; // orange
      case 'low': return '#10B981'; // green
      default: return '#6B7280'; // gray
    }
  };
  
  // Get incident icon based on type
  const getIncidentIcon = (type: string) => {
    if (type.includes('Unauthorised') || type.includes('Access')) return '⚠️';
    if (type.includes('Face') || type.includes('Recognition')) return '👤';
    if (type.includes('Traffic') || type.includes('congestion')) return '🚗';
    if (type.includes('Gun') || type.includes('Weapon')) return '🔫';
    return '📊';
  };
  
  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">Interactive Timeline - 24 Hour View</h3>
        <div className="text-sm text-gray-400">
          Current Time: {mounted ? currentTime.toLocaleTimeString() : 'Loading...'} | 
          Click or drag to navigate | Hover over incidents for details
        </div>
      </div>
      
      {!mounted ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <div className="text-gray-400">Loading timeline...</div>
        </div>
      ) : (
        <div className="relative">
        <svg
          ref={svgRef}
          width={timelineWidth}
          height={timelineHeight}
          className="border border-gray-700 rounded cursor-pointer"
          onClick={handleTimelineClick}
        >
          {/* Background */}
          <rect
            width={timelineWidth}
            height={timelineHeight}
            fill="#1F2937"
          />
          
          {/* Hour markers */}
          <g>{generateHourMarkers()}</g>
          
          {/* Incident markers */}
          {incidents.map((incident) => {
            const x = timeToPixel(incident.timestamp);
            const y = rulerHeight + 20;
            const width = Math.max(4, (incident.duration / 60) * (timelineWidth / 24)); // Convert duration to pixels
            
            return (
              <g key={incident.id}>
                {/* Incident bar */}
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={8}
                  fill={getIncidentColor(incident.severity)}
                  className="cursor-pointer hover:opacity-80"
                  onClick={(e) => {
                    e.stopPropagation();
                    onIncidentClick(incident);
                  }}
                  onMouseEnter={() => setHoveredIncident(incident)}
                  onMouseLeave={() => setHoveredIncident(null)}
                />
                
                {/* Incident marker */}
                <circle
                  cx={x}
                  cy={y + 4}
                  r={6}
                  fill={getIncidentColor(incident.severity)}
                  stroke="#000"
                  strokeWidth={1}
                  className="cursor-pointer hover:r-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    onIncidentClick(incident);
                  }}
                  onMouseEnter={() => setHoveredIncident(incident)}
                  onMouseLeave={() => setHoveredIncident(null)}
                />
                
                {/* Incident icon */}
                <text
                  x={x}
                  y={y + 8}
                  textAnchor="middle"
                  className="text-xs pointer-events-none"
                  fill="white"
                >
                  {getIncidentIcon(incident.type)}
                </text>
              </g>
            );
          })}
          
          {/* Current time scrubber */}
          <g className="cursor-grab active:cursor-grabbing">
            <line
              x1={scrubberPosition}
              y1={0}
              x2={scrubberPosition}
              y2={timelineHeight}
              stroke="#3B82F6"
              strokeWidth={3}
              className="pointer-events-none"
            />
            <rect
              x={scrubberPosition - 8}
              y={-5}
              width={16}
              height={15}
              fill="#3B82F6"
              rx={2}
              className="cursor-grab active:cursor-grabbing"
              onMouseDown={handleScrubberMouseDown}
            />
            <text
              x={scrubberPosition}
              y={8}
              textAnchor="middle"
              className="fill-white text-xs pointer-events-none"
            >
              🕐
            </text>
          </g>
        </svg>
        
        {/* Tooltip for hovered incident */}
        {hoveredIncident && (
          <div className="absolute z-10 bg-black bg-opacity-90 text-white p-3 rounded-lg border border-gray-600 shadow-lg pointer-events-none"
               style={{
                 left: timeToPixel(hoveredIncident.timestamp) + 10,
                 top: -80
               }}>
            <div className="text-sm font-semibold">{hoveredIncident.type}</div>
            <div className="text-xs text-gray-300">Camera: {hoveredIncident.camera}</div>
            <div className="text-xs text-gray-300">
              Time: {hoveredIncident.timestamp.toLocaleTimeString()}
            </div>
            <div className="text-xs text-gray-300">
              Duration: {hoveredIncident.duration} min
            </div>
            <div className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
              hoveredIncident.severity === 'high' ? 'bg-red-600' :
              hoveredIncident.severity === 'medium' ? 'bg-orange-600' : 'bg-green-600'
            }`}>
              {hoveredIncident.severity.toUpperCase()}
            </div>
          </div>
        )}
      </div>
      )}
      
      {/* Legend */}
      <div className="mt-4 flex items-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-gray-400">High Severity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded"></div>
          <span className="text-gray-400">Medium Severity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-gray-400">Low Severity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-gray-400">Current Time</span>
        </div>
      </div>
    </div>
  );
}
