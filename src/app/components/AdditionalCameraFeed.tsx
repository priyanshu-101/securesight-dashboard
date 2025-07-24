import React from 'react';

interface AdditionalCameraFeedProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isEnabled: boolean;
  cameraStream: MediaStream | null;
  toggleCamera: () => void;
  label: string;
  icon: string;
  location: string;
}

const AdditionalCameraFeed: React.FC<AdditionalCameraFeedProps> = ({ videoRef, isEnabled, cameraStream, toggleCamera, label, icon, location }) => (
  <div className="bg-gray-800 rounded-lg p-2 h-32 relative overflow-hidden">
    <div className="absolute top-2 left-2 text-xs bg-black bg-opacity-60 px-2 py-1 rounded z-10 flex items-center gap-2">
      {label} {cameraStream ? '🟢' : '🔴'}
      <button 
        onClick={toggleCamera}
        className="text-xs bg-blue-600 hover:bg-blue-700 px-1 py-0.5 rounded"
      >
        {isEnabled ? 'Stop' : 'Start'}
      </button>
    </div>
    {cameraStream ? (
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover rounded"
        onLoadedMetadata={() => {
          if (videoRef.current) {
            videoRef.current.play();
          }
        }}
        onCanPlay={() => {
          if (videoRef.current) {
            videoRef.current.play();
          }
        }}
        onError={(e) => {
          console.error(label + ' video error:', e);
        }}
      />
    ) : (
      <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 rounded flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl">{icon}</div>
          <div className="text-xs text-gray-400 mt-1">{location}</div>
          <div className="text-xs text-blue-400 mt-1">Click Start</div>
        </div>
      </div>
    )}
  </div>
);

export default AdditionalCameraFeed;
