"use client";

const ZoneSlider = ({ zones, elementCounts, onButtonClick }) => {
  return (
    <div className="p-5 bg-white">
      <h2 className="text-xl text-white">Zonas guardadas</h2>
      {zones.length > 0 ? (
        <div className="flex overflow-x-auto space-x-4 snap-x snap-mandatory">
          {zones.map((zone, index) => (
            <div
              key={index}
              className="min-w-[25%] snap-start border p-4 rounded-xl shadow-lg flex flex-col bg-gradient-to-r from-[#469e13] to-[#94ea62]"
            >
              <h3 className="font-bold text-white bg-[#428629] p-1 rounded shadow">Zona {index + 1}</h3>
              <p className="text-white">Descripción:</p>
              <div className="mt-2 flex flex-col items-end">
                <span className="text-white">Volumen de plaga</span>
                <span className="text-[#003600] text-2xl">{elementCounts[index]}</span>
              </div>
              <button
                className="mt-auto bg-white text-black py-2 rounded"
                onClick={() => onButtonClick(zone, index)} // Llamar a la función con la zona y el índice
              >
                Visualizar imagen
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className=" text-black">No hay zonas guardadas.</p>
      )}
    </div>
  );
};

export default ZoneSlider;


