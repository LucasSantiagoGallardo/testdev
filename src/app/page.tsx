"use client";


import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React, { useEffect } from "react";



export default function Home() {
  useEffect(() => {
    // Redirige a /login
    window.location.href = "/login";
  }, []);

  return (
    <DefaultLayout>
      {/* Puedes mostrar algo mientras ocurre la redirección */}
      <p>Redirigiendo...</p>
    </DefaultLayout>
  );
}
