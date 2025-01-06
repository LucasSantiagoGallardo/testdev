"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const ProfileBox = () => {
  const [datauser, setDatauser] = useState(null);
  const [dni, setDni] = useState(null);

  useEffect(() => {
    // Obtener el valor guardado en localStorage
    const usuario = localStorage.getItem("usuario");
    const storedDni = localStorage.getItem("dni");
    console.log("DNI obtenido de localStorage:", storedDni);
    setDni(storedDni);

    if (usuario) {
      try {
        // Convertir la cadena JSON a un objeto
        const parsedUser = JSON.parse(usuario);
        console.log("Usuario parseado de JSON:", parsedUser);
        setDatauser(parsedUser); // Guardar el objeto en el estado
      } catch (error) {
        console.error("Error al parsear JSON:", error);
      }
    } else {
      console.log("No se encontró ningún usuario en localStorage");
    }
  }, []);

  return (
    <>
      <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="relative z-20 h-35 md:h-65">
          <Image
            src={
              dni ? `/api/fotos/${dni}.png` : "/images/user/user-03.png" 
            }
            alt="profile cover"
            className="h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
            width={970}
            height={260}
            style={{
              width: "auto",
              height: "auto",
            }}
          />
          <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
            <label
              htmlFor="cover"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-[3px] bg-primary px-[15px] py-[5px] text-body-sm font-medium text-white hover:bg-opacity-90"
            >
              <input
                type="file"
                name="coverPhoto"
                id="coverPhoto"
                className="sr-only"
                accept="image/png, image/jpg, image/jpeg"
              />
              <span>Edit</span>
            </label>
          </div>
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
            <div className="relative drop-shadow-2">
              <Image
                src={
                  dni
                    ? `/api/fotos/${dni}.png`
                    : "/images/user/user-03.png"
                }
                width={160}
                height={160}
                className="overflow-hidden rounded-full"
                alt="profile"
              />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="mb-1 text-heading-6 font-bold text-dark dark:text-white">
              {datauser ? `${datauser.nombre} ${datauser.apellido}` : "Cargando..."}
            </h3>
            <p className="font-medium">{datauser ? datauser.area : "Cargando..."}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileBox;
