// components/MapComponent.tsx
"use client"

import { MapContainer, TileLayer, useMap, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet-draw';

const MapComponent = ({ onZoneCreated, savedZones }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const MapWithDrawControls = () => {
    const map = useMap();

    useEffect(() => {
      const drawControl = new L.Control.Draw({
        draw: {
          polygon: true,
          rectangle: false,
          circle: false,
          polyline: false,
          marker: false,
          circlemarker: false,
        },
      });
      map.addControl(drawControl);

      // Redibujar zonas guardadas
      if (savedZones.length > 0) {
        savedZones.forEach((zone) => {
          const polygon = L.polygon(zone, { color: '#469e13', fillColor: '#469e13', fillOpacity: 0.5 }).addTo(map);
        });
      }

      // Manejar la creación de nuevas zonas
      map.on(L.Draw.Event.CREATED, (e) => {
        const { layer } = e;
        if (layer) {
          layer.setStyle({ color: '#469e13', fillColor: '#469e13', fillOpacity: 0.5 }); // Establecer estilo del polígono
          map.addLayer(layer);
          const coordinates = layer.getLatLngs()[0]; // Obtener coordenadas de la zona
          onZoneCreated(coordinates); // Pasar las coordenadas al componente padre
        }
      });

      return () => {
        map.off(L.Draw.Event.CREATED);
      };
    }, [map, savedZones]);

    return null;
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation([latitude, longitude]);
      },
      (error) => {
        setError(error.message);
      }
    );
  }, []);

  return (
    <div>
      {location ? (
        <MapContainer center={location} zoom={13} style={{ height: '500px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapWithDrawControls />
          <Marker
            position={location}
            icon={L.icon({
              iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
          />
        </MapContainer>
      ) : (
        <p>{error ? error : 'Loading...'}</p>
      )}
    </div>
  );
};

export default MapComponent;
