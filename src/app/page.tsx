'use client';

import { useState, useEffect, useRef } from 'react';

interface Incident {
  id: number;
  type: string;
  camera_id: number;
  camera_name: string;
  camera_location: string;
  ts_start: string;
  ts_end: string;
  thumbnail_url?: string;
  resolved: boolean;
}

interface CameraEvent {
  camera: string;
  type: string;
  time: string;
  color: string;
}

export default function SecurityDashboard() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [isCamera2Enabled, setIsCamera2Enabled] = useState(false);
  const [isCamera3Enabled, setIsCamera3Enabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const videoRef3 = useRef<HTMLVideoElement>(null);
  const [cameraStream2, setCameraStream2] = useState<MediaStream | null>(null);
  const [cameraStream3, setCameraStream3] = useState<MediaStream | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cameraEvents, setCameraEvents] = useState<CameraEvent[]>([
    { camera: 'Camera - 01', type: 'Unauthorised Access', time: '03:00', color: 'bg-orange-500' },
    { camera: 'Camera - 01', type: 'Face Recognised', time: '14:45', color: 'bg-blue-500' },
    { camera: 'Camera - 01', type: 'Multiple Events', time: '4 Multiple Events', color: 'bg-yellow-500' },
    { camera: 'Camera - 02', type: 'Unauthorised Access', time: '01:00', color: 'bg-orange-500' },
    { camera: 'Camera - 02', type: 'Face Recognised', time: '', color: 'bg-blue-500' },
    { camera: 'Camera - 03', type: 'Traffic congestion', time: '', color: 'bg-green-500' },
    { camera: 'Camera - 03', type: 'Unauthorised Access', time: '', color: 'bg-orange-500' },
  ]);

  // Generate camera events from incidents
  useEffect(() => {
    if (incidents.length > 0) {
      const eventsByCamera: { [key: string]: CameraEvent[] } = {};
      
      incidents.forEach(incident => {
        const cameraKey = incident.camera_name;
        const time = new Date(incident.ts_start).toLocaleTimeString('en-GB', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        
        let color = 'bg-gray-500';
        if (incident.type.includes('Unauthorised') || incident.type.includes('Access')) {
          color = 'bg-orange-500';
        } else if (incident.type.includes('Face') || incident.type.includes('Recognition')) {
          color = 'bg-blue-500';
        } else if (incident.type.includes('Traffic') || incident.type.includes('congestion')) {
          color = 'bg-green-500';
        } else if (incident.type.includes('Gun') || incident.type.includes('Weapon')) {
          color = 'bg-red-500';
        }

        const event: CameraEvent = {
          camera: cameraKey,
          type: incident.type,
          time: time,
          color: color
        };

        if (!eventsByCamera[cameraKey]) {
          eventsByCamera[cameraKey] = [];
        }
        eventsByCamera[cameraKey].push(event);
      });

      // Convert to array format expected by the UI
      const allEvents: CameraEvent[] = [];
      Object.entries(eventsByCamera).forEach(([camera, events]) => {
        if (events.length > 1) {
          // Group multiple events
          allEvents.push({
            camera: camera,
            type: 'Multiple Events',
            time: `${events.length} Events`,
            color: 'bg-yellow-500'
          });
        } else if (events.length === 1) {
          allEvents.push(events[0]);
        }
      });

      // Add default cameras if no incidents
      const defaultCameras = ['Camera - 01', 'Camera - 02', 'Camera - 03'];
      defaultCameras.forEach(camera => {
        if (!eventsByCamera[camera] && !eventsByCamera[camera.replace(' - ', ' ')]) {
          allEvents.push({
            camera: camera,
            type: 'No Activity',
            time: '',
            color: 'bg-gray-600'
          });
        }
      });

      setCameraEvents(allEvents);
    }
  }, [incidents]);

  useEffect(() => {
    // Set initial time on client side only
    setCurrentTime(new Date());
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Initialize camera only if enabled and not already initialized
    if (!isCameraEnabled || cameraStream) return;

    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'environment' // Use back camera if available
          }, 
          audio: false 
        });
        setCameraStream(stream);
        setCameraError(null);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setCameraError(
          error instanceof Error 
            ? error.message 
            : 'Failed to access camera. Please check permissions.'
        );
        setIsCameraEnabled(false);
      }
    };

    initCamera();
  }, [isCameraEnabled, cameraStream]);

  // Cleanup effect for camera streams
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      if (cameraStream2) {
        cameraStream2.getTracks().forEach(track => track.stop());
      }
      if (cameraStream3) {
        cameraStream3.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream, cameraStream2, cameraStream3]);

  // Effect to handle video source assignment for camera 2
  useEffect(() => {
    if (cameraStream2 && videoRef2.current) {
      console.log('Setting camera 2 stream to video element');
      videoRef2.current.srcObject = cameraStream2;
      videoRef2.current.play()
        .then(() => console.log('Camera 2 video started playing'))
        .catch(e => console.log('Camera 2 play failed:', e));
    }
  }, [cameraStream2]);

  // Effect to handle video source assignment for camera 3
  useEffect(() => {
    if (cameraStream3 && videoRef3.current) {
      console.log('Setting camera 3 stream to video element');
      videoRef3.current.srcObject = cameraStream3;
      videoRef3.current.play()
        .then(() => console.log('Camera 3 video started playing'))
        .catch(e => console.log('Camera 3 play failed:', e));
    }
  }, [cameraStream3]);

  const unresolvedCount = incidents.filter(i => !i.resolved).length;
  const resolvedCount = incidents.filter(i => i.resolved).length;

  const toggleCamera = async () => {
    if (isCameraEnabled) {
      // Stop all cameras
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
      if (cameraStream2) {
        cameraStream2.getTracks().forEach(track => track.stop());
        setCameraStream2(null);
      }
      if (cameraStream3) {
        cameraStream3.getTracks().forEach(track => track.stop());
        setCameraStream3(null);
      }
      setIsCameraEnabled(false);
      setIsCamera2Enabled(false);
      setIsCamera3Enabled(false);
    } else {
      // Start main camera
      setIsCameraEnabled(true);
      setCameraError(null);
    }
  };

  const toggleCamera2 = async () => {
    if (isCamera2Enabled && cameraStream2) {
      // Stop camera 2
      cameraStream2.getTracks().forEach(track => track.stop());
      setCameraStream2(null);
      setIsCamera2Enabled(false);
    } else {
      // Start camera 2
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        let stream2;
        if (videoDevices.length > 1) {
          // Use second camera if available
          stream2 = await navigator.mediaDevices.getUserMedia({
            video: { 
              deviceId: videoDevices[1]?.deviceId ? { exact: videoDevices[1].deviceId } : undefined,
              width: { ideal: 640 },
              height: { ideal: 480 }
            }
          });
        } else {
          // Use front camera as fallback
          stream2 = await navigator.mediaDevices.getUserMedia({
            video: { 
              width: { ideal: 640 },
              height: { ideal: 480 },
              facingMode: 'user'
            }
          });
        }
        
        setCameraStream2(stream2);
        setIsCamera2Enabled(true);
        console.log('Camera 2 started successfully');
      } catch (error) {
        console.error('Error starting camera 2:', error);
        alert('Failed to start Camera 2: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    }
  };

  const toggleCamera3 = async () => {
    if (isCamera3Enabled && cameraStream3) {
      // Stop camera 3
      cameraStream3.getTracks().forEach(track => track.stop());
      setCameraStream3(null);
      setIsCamera3Enabled(false);
    } else {
      // Start camera 3
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        let stream3;
        if (videoDevices.length > 2) {
          // Use third camera if available
          stream3 = await navigator.mediaDevices.getUserMedia({
            video: { 
              deviceId: videoDevices[2]?.deviceId ? { exact: videoDevices[2].deviceId } : undefined,
              width: { ideal: 640 },
              height: { ideal: 480 }
            }
          });
        } else if (videoDevices.length > 1) {
          // Use second camera with different settings
          stream3 = await navigator.mediaDevices.getUserMedia({
            video: { 
              deviceId: videoDevices[1]?.deviceId ? { exact: videoDevices[1].deviceId } : undefined,
              width: { ideal: 480 },
              height: { ideal: 360 }
            }
          });
        } else {
          // Use same camera with different resolution
          stream3 = await navigator.mediaDevices.getUserMedia({
            video: { 
              width: { ideal: 320 },
              height: { ideal: 240 },
              facingMode: 'environment'
            }
          });
        }
        
        setCameraStream3(stream3);
        setIsCamera3Enabled(true);
        console.log('Camera 3 started successfully');
      } catch (error) {
        console.error('Error starting camera 3:', error);
        alert('Failed to start Camera 3: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    }
  };

  // API integration functions
  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/incidents');
      if (!response.ok) {
        throw new Error('Failed to fetch incidents');
      }
      const data = await response.json();
      setIncidents(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch incidents');
      console.error('Error fetching incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  const resolveIncident = async (incidentId: number) => {
    try {
      const response = await fetch(`/api/incidents/${incidentId}/resolve`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        throw new Error('Failed to resolve incident');
      }
      const updatedIncident = await response.json();
      
      // Update the incident in the state
      setIncidents(prev => 
        prev.map(incident => 
          incident.id === incidentId 
            ? { ...incident, resolved: updatedIncident.resolved }
            : incident
        )
      );
    } catch (err) {
      console.error('Error resolving incident:', err);
      alert('Failed to resolve incident: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const formatTimestamp = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const formatTime = (date: Date) => date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const formatDate = (date: Date) => date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    
    return `${formatTime(startDate)} - ${formatTime(endDate)} on ${formatDate(startDate)}`;
  };

  useEffect(() => {
    fetchIncidents();
    
    // Set up polling to refresh incidents every 30 seconds
    const interval = setInterval(fetchIncidents, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-900 p-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">SecureSight Dashboard</h1>
            <div className="text-sm">
              {currentTime ? `${currentTime.toLocaleDateString()} - ${currentTime.toLocaleTimeString()}` : 'Loading...'}
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Camera View */}
          <div className="flex-1 p-4">
            <div className="relative bg-gray-800 rounded-lg overflow-hidden h-96 mb-4">
              <div className="absolute top-4 left-4 bg-black bg-opacity-60 px-3 py-1 rounded text-sm z-10 flex items-center gap-2">
                📹 Camera - 01
                <button 
                  onClick={toggleCamera}
                  className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
                >
                  {isCameraEnabled ? 'Stop' : 'Start'}
                </button>
              </div>
              <div className="absolute top-4 right-4 bg-black bg-opacity-60 px-3 py-1 rounded text-sm z-10">
                🔴 {currentTime ? currentTime.toLocaleDateString() : ''} - {currentTime ? currentTime.toLocaleTimeString() : ''}
              </div>
              
              {!isCameraEnabled ? (
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📹</div>
                    <div className="text-lg">Camera Disabled</div>
                    <div className="text-sm text-gray-400">Click Start to enable camera</div>
                  </div>
                </div>
              ) : cameraError ? (
                <div className="w-full h-full bg-gradient-to-br from-red-900 to-red-800 flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="text-4xl mb-4">📹❌</div>
                    <div className="text-lg mb-2">Camera Access Error</div>
                    <div className="text-sm text-red-300">{cameraError}</div>
                    <div className="text-xs text-red-400 mt-2">
                      Please allow camera access and click Start
                    </div>
                  </div>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  onLoadedMetadata={() => {
                    if (videoRef.current) {
                      videoRef.current.play();
                    }
                  }}
                />
              )}
            </div>

            {/* Additional Camera Feeds */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-2 h-32 relative overflow-hidden">
                <div className="absolute top-2 left-2 text-xs bg-black bg-opacity-60 px-2 py-1 rounded z-10 flex items-center gap-2">
                  Camera - 02 {cameraStream2 ? '🟢' : '🔴'}
                  <button 
                    onClick={toggleCamera2}
                    className="text-xs bg-blue-600 hover:bg-blue-700 px-1 py-0.5 rounded"
                  >
                    {isCamera2Enabled ? 'Stop' : 'Start'}
                  </button>
                </div>
                {cameraStream2 ? (
                  <video
                    ref={videoRef2}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover rounded"
                    onLoadedMetadata={() => {
                      console.log('Camera 2 video metadata loaded');
                      if (videoRef2.current) {
                        videoRef2.current.play()
                          .then(() => console.log('Camera 2 playing'))
                          .catch(e => console.log('Camera 2 play error:', e));
                      }
                    }}
                    onCanPlay={() => {
                      console.log('Camera 2 can play');
                      if (videoRef2.current) {
                        videoRef2.current.play()
                          .then(() => console.log('Camera 2 started playing'))
                          .catch(e => console.log('Camera 2 canPlay error:', e));
                      }
                    }}
                    onError={(e) => {
                      console.error('Camera 2 video error:', e);
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 rounded flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl">🚪</div>
                      <div className="text-xs text-gray-400 mt-1">Entrance</div>
                      <div className="text-xs text-blue-400 mt-1">Click Start</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-gray-800 rounded-lg p-2 h-32 relative overflow-hidden">
                <div className="absolute top-2 left-2 text-xs bg-black bg-opacity-60 px-2 py-1 rounded z-10 flex items-center gap-2">
                  Camera - 03 {cameraStream3 ? '🟢' : '🔴'}
                  <button 
                    onClick={toggleCamera3}
                    className="text-xs bg-blue-600 hover:bg-blue-700 px-1 py-0.5 rounded"
                  >
                    {isCamera3Enabled ? 'Stop' : 'Start'}
                  </button>
                </div>
                {cameraStream3 ? (
                  <video
                    ref={videoRef3}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover rounded"
                    onLoadedMetadata={() => {
                      console.log('Camera 3 video metadata loaded');
                      if (videoRef3.current) {
                        videoRef3.current.play()
                          .then(() => console.log('Camera 3 playing'))
                          .catch(e => console.log('Camera 3 play error:', e));
                      }
                    }}
                    onCanPlay={() => {
                      console.log('Camera 3 can play');
                      if (videoRef3.current) {
                        videoRef3.current.play()
                          .then(() => console.log('Camera 3 started playing'))
                          .catch(e => console.log('Camera 3 canPlay error:', e));
                      }
                    }}
                    onError={(e) => {
                      console.error('Camera 3 video error:', e);
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 rounded flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl">🛒</div>
                      <div className="text-xs text-gray-400 mt-1">Shop Floor</div>
                      <div className="text-xs text-blue-400 mt-1">Click Start</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-gray-900 border-l border-gray-700">
            {/* Incidents Panel */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                  ⚠️
                </div>
                <span className="font-semibold">{unresolvedCount} Unresolved Incidents</span>
                <div className="ml-auto flex gap-2">
                  <button 
                    onClick={fetchIncidents}
                    className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
                    title="Refresh incidents"
                  >
                    �
                  </button>
                  <span className="text-xs bg-green-600 px-2 py-1 rounded">✅ {resolvedCount} resolved</span>
                </div>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {loading ? (
                  <div className="bg-gray-800 rounded-lg p-3 text-center">
                    <div className="text-gray-400">Loading incidents...</div>
                  </div>
                ) : error ? (
                  <div className="bg-red-900 rounded-lg p-3 text-center">
                    <div className="text-red-300">Error: {error}</div>
                    <button 
                      onClick={fetchIncidents}
                      className="mt-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
                    >
                      Retry
                    </button>
                  </div>
                ) : incidents.length === 0 ? (
                  <div className="bg-gray-800 rounded-lg p-3 text-center">
                    <div className="text-gray-400">No incidents found</div>
                  </div>
                ) : (
                  incidents
                    .filter(incident => !incident.resolved)
                    .map((incident) => (
                      <div key={incident.id} className="bg-gray-800 rounded-lg p-3 border-l-4 border-orange-500">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-orange-500">⚠️</span>
                              <span className="font-medium text-sm">{incident.type}</span>
                            </div>
                            <div className="text-xs text-gray-400 mb-1">
                              📍 {incident.camera_name} ({incident.camera_location})
                            </div>
                            <div className="text-xs text-gray-400">
                              🕐 {formatTimestamp(incident.ts_start, incident.ts_end)}
                            </div>
                          </div>
                          <button 
                            onClick={() => resolveIncident(incident.id)}
                            className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-xs font-medium"
                          >
                            Resolve →
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-gray-900 border-t border-gray-700 p-4">
          {/* Video Controls */}
          <div className="flex items-center gap-4 mb-4">
            <button className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">
              ⏮️
            </button>
            <button className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">
              ⏸️
            </button>
            <button className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">
              ▶️
            </button>
            <button className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">
              ⏸️
            </button>
            <button className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">
              ⏭️
            </button>
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
      </div>
    </div>
  );
}
