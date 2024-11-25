"use client";

import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 1280,
  height: 720,
};

const WebcamCapture = ({ onUpdateElementCount }: { onUpdateElementCount: (count: object) => void }) => {  
  const webcamRef = useRef<any>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [resultImage, setResultImage] = useState<string | null>(null); 
  const [elementCount, setElementCount] = useState<number | null>(null); 

  const sendImageToAPI = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot(); 
      if (imageSrc) {
        const response = await fetch(imageSrc);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append("image", blob, "screenshot.jpg");

        try {
          const apiResponse = await fetch("http://127.0.0.1:5000/analizar-imagen", {
            method: "POST",
            body: formData,
          });

          if (apiResponse.ok) {
            const result = await apiResponse.json();
        
            if (result.conteo_clases && result.image_base64) {
              setResultImage(`data:image/jpeg;base64,${result.image_base64}`);
              setElementCount(result.conteo_clases); // Actualiza `elementCount` con el objeto recibido
              onUpdateElementCount(result.conteo_clases); // Llama a la prop para comunicar el conteo
            } else {
              console.error("Formato de respuesta inesperado:", result);
            }
          } else {
            console.error("Error en la respuesta de la API:", apiResponse.statusText);
          }
        } catch (error) {
          console.error("Error al enviar la imagen:", error);
        }
      }
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (webcamRef.current) {
        sendImageToAPI();
      }
    }, 1000);
  
    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <Webcam
        ref={webcamRef}
        audio={false}
        height={360}
        screenshotFormat="image/jpeg"
        width={720}
        videoConstraints={{
          ...videoConstraints,
          facingMode,
        }}
      />

      <button
        className="bg-[#428629] hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-full"
        onClick={() => {
          setFacingMode(facingMode === "user" ? "environment" : "user");
        }}
      >
        Cambiar cámara
      </button>

      {resultImage && (
        <img
          src={resultImage}
          alt="Procesada por IA"
          style={{
            position: "absolute",
            top: 0,
            left: 800,
            width: "50%",
            height: "90%",
          }}
        />
      )}

      {elementCount && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            padding: "10px",
            borderRadius: "8px",
            fontSize: "16px",
            zIndex: 10, 
          }}
          >
          <h4>Conteo de elementos:</h4>
          <ul>
            {Object.entries(elementCount).map(([key, value]) => (
              <li key={key}>
                {key}: {value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
