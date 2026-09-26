import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Dog } from '../../types/dog';
import { Sighting } from '../../types/sighting';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Fix Leaflet marker icon paths
const customDogIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const customSightingIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface CommunityMapProps {
  dogs?: Dog[];
  sightings?: Sighting[];
  center?: [number, number]; // [lat, lng]
  zoom?: number;
}

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export function CommunityMap({
  dogs = [],
  sightings = [],
  center = [27.7172, 85.3240], // Default Kathmandu, Nepal
  zoom = 13,
}: CommunityMapProps) {
  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-forest-100 shadow-sm relative">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <RecenterMap center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Registered Dogs Markers */}
        {dogs.map((dog) => {
          if (!dog.registrationLocation?.coordinates) return null;
          const [lng, lat] = dog.registrationLocation.coordinates;
          return (
            <Marker key={`dog-${dog.id}`} position={[lat, lng]} icon={customDogIcon}>
              <Popup>
                <div className="p-1 max-w-xs font-sans">
                  <div className="text-xs font-bold text-amber-golden uppercase font-mono">
                    PAWID: {dog.pawId}
                  </div>
                  <h4 className="text-sm font-extrabold text-forest-900 mt-0.5">
                    {dog.name || 'Community Dog'}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">Area: {dog.area}</p>
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <Link
                      to={`/d/${dog.qrToken}`}
                      className="text-xs font-bold text-forest-900 hover:text-amber-golden flex items-center gap-1"
                    >
                      <span>View Public Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Recent Community Sightings Markers */}
        {sightings.map((sighting) => {
          if (!sighting.location?.coordinates) return null;
          const [lng, lat] = sighting.location.coordinates;
          return (
            <Marker
              key={`sighting-${sighting.id}`}
              position={[lat, lng]}
              icon={customSightingIcon}
            >
              <Popup>
                <div className="p-1 max-w-xs font-sans">
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                    Community Sighting
                  </span>
                  <h4 className="text-xs font-extrabold text-forest-900 mt-1">
                    {sighting.location.areaName || 'Reported Location'}
                  </h4>
                  <p className="text-xs text-slate-600">Condition: {sighting.condition}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
