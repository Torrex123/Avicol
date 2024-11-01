import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useRef, useState } from 'react';

function Map() {
  const mapRef = useRef(null);
  const [birdData, setBirdData] = useState([]);

  useEffect(() => {
    fetch('/data.txt') // Actualiza con la ruta correcta
      .then(response => response.text())
      .then(text => {
        const lines = text.split('\n');
        const header = lines[0].split('\t');
        const data = lines.slice(1).map(line => {
          const values = line.split('\t');
          return header.reduce((obj, key, index) => {
            obj[key] = values[index];
            return obj;
          }, {});
        });
        setBirdData(data);
      })
      .catch(error => console.error('Error loading data:', error));
  }, []);

  const speciesGroups = {};
  birdData.forEach(entry => {
    const decimalLatitude = parseFloat(entry.decimalLatitude);
    const decimalLongitude = parseFloat(entry.decimalLongitude);
    const scientificName = entry.scientificName;

    if (!isNaN(decimalLatitude) && !isNaN(decimalLongitude)) {
      const latLngKey = `${decimalLatitude},${decimalLongitude}`;

      if (!speciesGroups[latLngKey]) {
        speciesGroups[latLngKey] = [];
      }
      speciesGroups[latLngKey].push(scientificName);
    }
  });

  return (
    <MapContainer
      ref={mapRef}
      center={[-0.05, -75.21679]} 
      zoom={13}
      style={{ height: '100vh' }}
      whenCreated={mapInstance => {
        mapRef.current = mapInstance;
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {Object.entries(speciesGroups).map(([latLng, species], index) => {
        const [lat, lng] = latLng.split(',').map(Number);
        return (
          <Marker key={index} position={[lat, lng]} >
            <Popup>
              <h3>Especies avistadas:</h3>
              <ul>
                {species.map((name, i) => (
                  <li key={i}>{name}</li>
                ))}
              </ul>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default Map;
