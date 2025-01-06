import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ClickOutside from "@/components/ClickOutside";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dni, setDni] = useState<string | null>(null);
  const [userData, setUserData] = useState<{ nombre: string; apellido: string; empresa?: string } | null>(null);

  useEffect(() => {
    // Obtenemos el DNI del usuario desde localStorage
    const storedDni = localStorage.getItem("dni");
    console.log("DNI obtenido de localStorage:", storedDni);

    if (storedDni && storedDni.trim() !== "") {
      setDni(storedDni);
      console.log("DNI válido para la consulta:", storedDni);

      // Realizamos la petición para obtener los datos del usuario
      fetch(`/api/consulta_dni.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dni: storedDni })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Error en la respuesta de la API");
          }
          return response.json();
        })
        .then(data => {
          console.log("Datos del usuario obtenidos:", data);
          setUserData(data); // Guardamos los datos del usuario en el estado
          localStorage.setItem('usuario', JSON.stringify(data));
        })
        .catch(error => console.error("Error al obtener datos del usuario:", error));
    }
  }, []);

  const renderDropdownMenu = () => (
    <div className="absolute right-0 mt-7.5 flex w-[280px] flex-col rounded-lg border-[0.5px] border-stroke bg-white shadow-default dark:border-dark-3 dark:bg-gray-dark">
      <div className="flex items-center gap-2.5 px-5 pb-5.5 pt-3.5">
        <span className="relative block h-12 w-12 rounded-full">
          <Image
            width={112}
            height={112}
            src={dni ? `/api/fotos/${dni}.png` : "/images/user/user-03.png"}
            alt="User"
            className="overflow-hidden rounded-full"
          />
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green dark:border-gray-dark"></span>
        </span>
        <span className="block">
          <span className="block font-medium text-dark dark:text-white">
            {userData ? `${userData.nombre} ${userData.apellido}` : "Cargando..."}
          </span>
          <span className="block font-medium text-dark-5 dark:text-dark-6">
            {userData ? `${userData.empresa}` : ""}
          </span>
        </span>
      </div>
      <ul className="flex flex-col gap-1 border-y-[0.5px] border-stroke p-2.5 dark:border-dark-3">
        <li>
          <Link
            href="/profile"
            className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base"
          >
            View profile
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base"
          >
            Account Settings
          </Link>
        </li>
      </ul>
      <div className="p-2.5">
        <Link
          href="login"
          className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base"
        >
          Cerrar sesión
        </Link>
      </div>
    </div>
  );

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        href="#"
      >
        <span className="h-12 w-12 rounded-full">
          <Image
            width={112}
            height={112}
            src={dni ? `/api/fotos/${dni}.png` : "/images/user/user-03.png"}
            alt="User"
            className="overflow-hidden rounded-full"
          />
        </span>
        <span className="flex items-center gap-2 font-medium text-dark dark:text-dark-6">
          <span className="hidden lg:block">
            {userData ? `${userData.nombre} ${userData.apellido}` : "Cargando..."}
          </span>
        </span>
      </Link>
      {dropdownOpen && renderDropdownMenu()}
    </ClickOutside>
  );
};

export default DropdownUser;
