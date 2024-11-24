"use client";

import { useEffect, useState } from 'react';
import MapComponent from './components/MapComponent';
import ZoneSlider from './components/ZoneSlider';
import Navbar from './components/Navbar';
import WebcamCapture from './components/WebcamCapture';
import L from 'leaflet'; // Importa Leaflet

const Page = () => {
  const [zones, setZones] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [selectedZoneIndex, setSelectedZoneIndex] = useState(null); // Estado para la zona seleccionada
  const [elementCounts, setElementCounts] = useState([]); // Estado para los conteos de elementos

  const handleZoneCreated = (coordinates) => {
    const storedZones = JSON.parse(localStorage.getItem('zones')) || [];
    const newZones = [...storedZones, coordinates];
    localStorage.setItem('zones', JSON.stringify(newZones));
    setZones(newZones);
    setElementCounts(new Array(newZones.length).fill(0)); // Inicializa los conteos
  };

  useEffect(() => {
    const storedZones = JSON.parse(localStorage.getItem('zones')) || [];
    setZones(storedZones);
    setElementCounts(new Array(storedZones.length).fill(0)); // Inicializa los conteos

    // Obtener la ubicación actual del dispositivo
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error(error.message);
        }
      );
    }
  }, []);

  const isInZone = (zone) => {
    if (!currentLocation) return false;

    const point = L.latLng(currentLocation[0], currentLocation[1]);
    const polygon = L.polygon(zone);

    return polygon.getBounds().contains(point);
  };

  const handleButtonClick = (zone, index) => {
    if (isInZone(zone)) {
      setShowWebcam(true);
      setSelectedZoneIndex(index); // Establecer el índice de la zona seleccionada
    } else {
      alert("Estás fuera de la zona.");
    }
  };

  // Función para actualizar el conteo de elementos
  const updateElementCount = (count) => {
    setElementCounts((prevCounts) => {
      const newCounts = [...prevCounts];
      if (selectedZoneIndex !== null) {
        newCounts[selectedZoneIndex] += count;
      }
      return newCounts;
    });
  };

  return (
    <div className="bg-white">
      <Navbar />
      <div className="p-1">
        <MapComponent onZoneCreated={handleZoneCreated} savedZones={zones} />
      </div>
      <ZoneSlider zones={zones} elementCounts={elementCounts} onButtonClick={handleButtonClick} />
      {showWebcam && <WebcamCapture onUpdateElementCount={updateElementCount} />}
    </div>
  );
};

export default Page;

