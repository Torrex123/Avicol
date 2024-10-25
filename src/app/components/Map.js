import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useRef } from 'react';

function Map() {
  // Only using useRef to keep a reference to the map if needed in the future
  const mapRef = useRef(null);

  return (
    <MapContainer
      ref={mapRef}
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: '100vh' }}
      whenCreated={(mapInstance) => {
        // Store map instance reference in case we want to manipulate it later
        mapRef.current = mapInstance;
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>

  );
}

export default Map;
