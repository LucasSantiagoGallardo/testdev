"use client";

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Swal from 'sweetalert2';
import DefaultLayout from "@/components/layout-admin/DefaultLaout";

interface Menu {
  tipo: string;
  nombre: string;
  ingredientes: string;
  calorias: string;
  foto: string;
  cantidad_porcion: string;
  fecha: string;
}

interface CalendarEvent {
  title: string;
  start: string;
  backgroundColor: string;
  extendedProps: Menu;
}

const CalendarDashboard = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    fetch('http://localhost/api/fetch_all_menus.php')
      .then((response) => response.json())
      .then((data: { success: boolean; menus: Menu[] }) => {
        if (data.success) {
          const loadedEvents = data.menus.map((menu: Menu) => ({
            title: `${menu.tipo}: ${menu.nombre}`,
            start: menu.fecha,
            backgroundColor: getColorByMenuType(menu.tipo),
            extendedProps: menu,
          }));
          setEvents(loadedEvents);
        }
      });
  }, []);

  const getColorByMenuType = (tipo: string): string => {
    switch (tipo) {
      case 'plato_principal':
        return 'blue';
      case 'menu_vegetariano':
        return 'green';
      case 'ensalada':
        return 'purple';
      case 'postre':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const handleDateSelect = (info: any) => {
    Swal.fire({
      title: `Agregar Menús para el ${info.startStr}`,
      html: `
        <select id="tipo" class="swal2-input">
          <option value="plato_principal">Plato Principal</option>
          <option value="menu_vegetariano">Menú Vegetariano</option>
          <option value="ensalada">Ensalada</option>
          <option value="postre">Postre</option>
        </select>
        <input type="text" id="nombre" class="swal2-input" placeholder="Nombre del Menú">
        <textarea id="ingredientes" class="swal2-textarea" placeholder="Ingredientes"></textarea>
        <input type="number" id="calorias" class="swal2-input" placeholder="Calorías">
        <input type="text" id="foto" class="swal2-input" placeholder="URL de la Foto">
        <input type="text" id="cantidad_porcion" class="swal2-input" placeholder="Cantidad por porción (ej. 200g)">
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const tipo = (document.getElementById('tipo') as HTMLSelectElement).value;
        const nombre = (document.getElementById('nombre') as HTMLInputElement).value;
        const ingredientes = (document.getElementById('ingredientes') as HTMLTextAreaElement).value;
        const calorias = (document.getElementById('calorias') as HTMLInputElement).value;
        const foto = (document.getElementById('foto') as HTMLInputElement).value;
        const cantidad_porcion = (document.getElementById('cantidad_porcion') as HTMLInputElement).value;

        return { tipo, nombre, ingredientes, calorias, foto, cantidad_porcion };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { tipo, nombre, ingredientes, calorias, foto, cantidad_porcion } = result.value;
        const newEvent: CalendarEvent = {
          title: `${tipo}: ${nombre}`,
          start: info.startStr,
          backgroundColor: getColorByMenuType(tipo),
          extendedProps: { tipo, nombre, ingredientes, calorias, foto, cantidad_porcion, fecha: info.startStr },
        };
        setEvents((prevEvents) => [...prevEvents, newEvent]);

        fetch('http://localhost/api/save_menu.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fecha: info.startStr,
            tipo,
            nombre,
            ingredientes,
            calorias,
            foto,
            cantidad_porcion,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (!data.success) {
              Swal.fire('Error', data.message, 'error');
            }
          });
      }
    });
  };

  return (
    <DefaultLayout>
      <div>
        <h1>Dashboard de Menús</h1>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          selectable={true}
          select={handleDateSelect}
        />
      </div>
    </DefaultLayout>
  );
};

export default CalendarDashboard;
