"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

interface UserData {
  nombre: string;
  apellido: string;
  area?: string;
  empresa?: string;
  rfid?: string;
}

const ProfileBox: React.FC = () => {
  const [datauser, setDatauser] = useState<UserData | null>(null);
  const [dni, setDni] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("usuario");
      const storedDni = localStorage.getItem("dni");

      if (storedDni) {
        console.log("DNI obtenido de localStorage:", storedDni);
        setDni(storedDni);
      }

      if (storedUser) {
        const parsedUser: UserData = JSON.parse(storedUser);
        console.log("Usuario parseado de JSON:", parsedUser);
        setDatauser(parsedUser);
      } else {
        console.log("No se encontró ningún usuario en localStorage");
      }
    } catch (error) {
      console.error("Error al acceder a localStorage:", error);
    }
  }, []);

  return (
    <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      {/* Imagen de portada */}
      <div className="relative z-20 h-35 md:h-65">
        <Image
          src="/images/cover/cover-01.png"
          alt="profile cover"
          className="h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
          width={970}
          height={260}
        />
        <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
          <label
            htmlFor="coverPhoto"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-[3px] bg-primary px-[15px] py-[5px] text-body-sm font-medium text-white hover:bg-opacity-90"
          >
            <input
              type="file"
              name="coverPhoto"
              id="coverPhoto"
              className="sr-only"
              accept="image/png, image/jpg, image/jpeg"
            />
            <span>Editar</span>
          </label>
        </div>
      </div>

      {/* Información del perfil */}
      <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
        {/* Imagen del perfil */}
        <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
          <Image
            src={dni ? `/api/fotos/${dni}.png` : "/images/user.png"}
            width={160}
            height={160}
            className="overflow-hidden rounded-full"
            alt="profile"
          />
          <label
            htmlFor="profilePhoto"
            className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
          >
            <input
              type="file"
              name="profilePhoto"
              id="profilePhoto"
              className="sr-only"
              accept="image/png, image/jpg, image/jpeg"
            />
          </label>
        </div>

        {/* Datos del usuario */}
        <div className="mt-4">
          <h3 className="mb-1 text-heading-6 font-bold text-dark dark:text-white">
            {datauser ? `${datauser.nombre} ${datauser.apellido}` : "Cargando..."}
          </h3>
          {datauser?.area && <h4 className="font-medium">{datauser.area}</h4>}
          {datauser?.empresa && <p className="font-medium">{datauser.empresa}</p>}
          {datauser?.rfid && <p className="font-medium">RFID: {datauser.rfid}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProfileBox;
