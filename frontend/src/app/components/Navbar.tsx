// components/Navbar.tsx
"use client"

import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="bg-white p-2">
      <div className="flex justify-center">
        <Image src="/BUGBUSTER.png" alt="Logo de Mi Aplicación" width={60} height={60} /> {/* Ajusta el tamaño del logo */}
      </div>
    </nav>
  );
};

export default Navbar;



