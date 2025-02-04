"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Swal from "sweetalert2";
import DefaultLayout from "@/components/layout-admin/DefaultLaout";

// Tipo para el evento del menú
interface MenuEvent {
  id?: number;
  tipo: string;
  nombre: string;
  fecha: string;
  ingredientes: string;
  calorias: number;
  foto: string;
  cantidad_porcion: string;
}

const CalendarDashboard: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);

  // Cargar menús desde el servidor
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch('/api/menus', { method: 'GET' });
        const data = await response.json();

        const loadedEvents = data.map((menu: MenuEvent) => ({
          id: menu.id,
          title: `${menu.tipo}: ${menu.nombre}`,
          start: menu.fecha,
          backgroundColor: getColorByMenuType(menu.tipo),
          extendedProps: { ...menu },
        }));

        setEvents(loadedEvents);
      } catch (error) {
        console.error("Error al cargar menús:", error);
      }
    };

    fetchMenus();
  }, []);

  // Seleccionar fecha en el calendario
  const handleDateSelect = (info: DateSelectArg) => {
    Swal.fire({
      title: `Agregar Menús para el ${info.startStr}`,
      html: `
        <select id="tipo" class="swal2-input">
          <option value="plato_principal">Plato Principal</option>
          <option value="menu_vegetariano">Menú Vegetariano</option>
          <option value="ensalada">Ensalada</option>
          <option value="postre">Postre</option>
        </select>
        <input type="text" id="nombre" class="swal2-input" placeholder="Nombre del Menú" />
        <textarea id="ingredientes" class="swal2-textarea" placeholder="Ingredientes"></textarea>
        <input type="number" id="calorias" class="swal2-input" placeholder="Calorías" />
        <input type="text" id="foto" class="swal2-input" placeholder="URL de la Foto" />
        <input type="text" id="cantidad_porcion" class="swal2-input" placeholder="Cantidad por Porción" />
      `,
      showCancelButton: true,
      cancelButtonColor: 'Red',
      confirmButtonText: "Guardar",
      confirmButtonColor: "Green",
      preConfirm: () => {
        const tipo = (document.getElementById("tipo") as HTMLSelectElement).value;
        const nombre = (document.getElementById("nombre") as HTMLInputElement).value;
        const ingredientes = (document.getElementById("ingredientes") as HTMLTextAreaElement).value;
        const calorias = parseInt((document.getElementById("calorias") as HTMLInputElement).value);
        const foto = (document.getElementById("foto") as HTMLInputElement).value;
        const cantidad_porcion = (document.getElementById("cantidad_porcion") as HTMLInputElement).value;

        if (!nombre || !ingredientes || !calorias || !cantidad_porcion) {
          Swal.showValidationMessage("Todos los campos son obligatorios.");
          return false;
        }

        return { tipo, nombre, ingredientes, calorias, foto, cantidad_porcion };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { tipo, nombre, ingredientes, calorias, foto, cantidad_porcion } = result.value;
        const newEvent = {
          title: `${tipo}: ${nombre}`,
          start: info.startStr,
          backgroundColor: getColorByMenuType(tipo),
          extendedProps: { tipo, nombre, ingredientes, calorias, foto, cantidad_porcion },
        };
        setEvents((prevEvents) => [...prevEvents, newEvent]);

        saveMenu({
          fecha: info.startStr,
          tipo,
          nombre,
          ingredientes,
          calorias,
          foto,
          cantidad_porcion,
        });
      }
    });
  };

  // Guardar menú en el servidor
  const saveMenu = async (menu: MenuEvent) => {
    try {
      const response = await fetch('/api/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menu),
      });

      const data = await response.json();

      if (!response.ok) {
        Swal.fire("Error", data.error || "No se pudo guardar el menú", "error");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar el menú", "error");
    }
  };

  // Eliminar menú del servidor
  const deleteMenu = async (id: number) => {
    try {
      const response = await fetch('/api/menus', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire("Eliminado", "El menú ha sido eliminado exitosamente.", "success");
        setEvents(events.filter(event => event.id !== id));
      } else {
        Swal.fire("Error", data.error || "No se pudo eliminar el menú", "error");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar el menú", "error");
    }
  };

  // Manejar clic en un evento
  const handleEventClick = (eventClickInfo: EventClickArg) => {
    const { id } = eventClickInfo.event;
    const { tipo, nombre, ingredientes, calorias, foto, cantidad_porcion } = eventClickInfo.event.extendedProps;

    Swal.fire({
      title: `Detalles del Menú: ${nombre}`,
      html: `
        <p><strong>Tipo:</strong> ${tipo}</p>
        <p><strong>Ingredientes:</strong> ${ingredientes}</p>
        <p><strong>Calorías:</strong> ${calorias} kcal</p>
        <p><strong>Cantidad por Porción:</strong> ${cantidad_porcion}</p>
        ${foto ? `<img src="${foto}" alt="Foto de ${nombre}" style="width:100%; margin-top:10px;" />` : ""}
      `,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cerrar',
      confirmButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed && id) {
        deleteMenu(parseInt(id as string));
      }
    });
  };

  // Obtener color según tipo de menú
  const getColorByMenuType = (tipo: string): string => {
    switch (tipo) {
      case "plato_principal":
        return "blue";
      case "menu_vegetariano":
        return "green";
      case "ensalada":
        return "purple";
      case "postre":
        return "orange";
      default:
        return "gray";
    }
  };

  return (
    <DefaultLayout>
      <div>
        <h1>Dashboard de Menús</h1>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          selectable
          select={handleDateSelect}
          eventClick={handleEventClick}
        />
      </div>
    </DefaultLayout>
  );
};

export default CalendarDashboard;
