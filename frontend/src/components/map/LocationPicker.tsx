import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

const pickerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41]
});

interface LocationPickerProps {
  initialCoordinates?: [number, number]; // [lng, lat]
  onSelectLocation: (lng: number, lat: number) => void;
}

function MapClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export function LocationPicker({ initialCoordinates, onSelectLocation }: LocationPickerProps) {
  const defaultPos: [number, number] = initialCoordinates
    ? [initialCoordinates[1], initialCoordinates[0]]
    : [27.7172, 85.3240]; // Default Kathmandu [lat, lng]

  const [position, setPosition] = useState<[number, number] | null>(
    initialCoordinates ? [initialCoordinates[1], initialCoordinates[0]] : null
  );

  const handleSelect = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onSelectLocation(lng, lat);
  };

  return (
    <div className="space-y-2">
      <div className="w-full h-72 rounded-2xl overflow-hidden border-2 border-forest-200 shadow-sm relative">
        <MapContainer center={defaultPos} zoom={14} className="w-full h-full">
          <RecenterMap center={position || defaultPos} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onSelect={handleSelect} />
          {position && <Marker position={position} icon={pickerIcon} />}
        </MapContainer>
      </div>
      <p className="text-xs text-slate-500 font-medium text-center">
        {position ? (
          <span className="text-emerald-700 font-bold">
            Selected Pin: Lat {position[0].toFixed(5)}, Lng {position[1].toFixed(5)}
          </span>
        ) : (
          'Click anywhere on the map to set the approximate sighting pin.'
        )}
      </p>
    </div>
  );
}
