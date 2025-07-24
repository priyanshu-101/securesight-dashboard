import React from 'react';

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

interface IncidentsPanelProps {
  unresolvedCount: number;
  resolvedCount: number;
  loading: boolean;
  error: string | null;
  incidents: Incident[];
  fetchIncidents: () => void;
  resolveIncident: (incidentId: number) => void;
  formatTimestamp: (start: string, end: string) => string;
}

const IncidentsPanel: React.FC<IncidentsPanelProps> = ({
  unresolvedCount,
  resolvedCount,
  loading,
  error,
  incidents,
  fetchIncidents,
  resolveIncident,
  formatTimestamp
}) => (
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
);

export default IncidentsPanel;
