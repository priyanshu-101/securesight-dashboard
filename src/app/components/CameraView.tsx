import React from 'react';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isCameraEnabled: boolean;
  cameraError: string | null;
  currentTime: Date | null;
  toggleCamera: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ videoRef, isCameraEnabled, cameraError, currentTime, toggleCamera }) => (
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
);

export default CameraView;
