import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import { MapContainer, TileLayer, Marker} from 'react-leaflet';
import { useEffect, useRef, useState } from 'react';

function Map({ onMarkerClick }) { 
  const mapRef = useRef(null);
  const [birdData, setBirdData] = useState([]);

  useEffect(() => {
    fetch('/map.txt')
      .then(response => response.text())
      .then(text => {
        const lines = text.trim().split('\n');
        const header = lines[0].split(/\s+/);

        const data = lines.slice(1).map(line => {
          const values = line.split(/\s+/);
          const scientificName = values.slice(2).join(' ').replace(/^"|"$/g, '');

          return header.reduce((obj, key, index) => {
            if (key === 'scientificName') {
              obj[key] = scientificName;
            } else {
              obj[key] = values[index];
            }
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
      center={[2.571614, -72.642651]}
      zoom={5.5}
      style={{ height: '100vh' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />
      {Object.entries(speciesGroups).map(([latLng, species], index) => {
        const [lat, lng] = latLng.split(',').map(Number);
        return (
          <Marker
            key={index}
            position={[lat, lng]}
            eventHandlers={{
              click: () => {
                onMarkerClick({ location: latLng, species }); 
              }
            }}
          >
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default Map;
