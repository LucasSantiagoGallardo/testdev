import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Swal from 'sweetalert2';

type Menu = {
  id: string;
  nombre: string;
  tipo: string;
  fecha: string; // ISO String
  description?: string;
  price?: number;
};

const menuColors: Record<string, string> = {
  plato_principal: 'blue',
  menu_vegetariano: 'green',
  ensalada: 'purple',
  postre: 'orange',
};

const UserMenuSelection = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [userId, setUserId] = useState<string>();

  // Obtener DNI del localStorage
  useEffect(() => {
    const storedDni = localStorage.getItem('dni');
    if (storedDni) {
      setUserId(storedDni);
      console.log('DNI encontrado en localStorage:', storedDni);
    } else {
      console.error('DNI no encontrado en localStorage');
    }
  }, []);

  // Cargar menús y elecciones
  useEffect(() => {
    const cargarMenus = async () => {
      try {
        const response = await fetch('/api/fetch_all_menus.php');
        const data = await response.json();
        if (data.success) {
          const loadedEvents = data.menus.map((menu: Menu) => ({
            title: `${menu.tipo}: ${menu.nombre}`,
            start: menu.fecha,
            backgroundColor: menuColors[menu.tipo] || 'gray',
            extendedProps: {
              tipo: menu.tipo,
              nombre: menu.nombre,
            },
          }));
          setEvents(loadedEvents);
        }
      } catch (error) {
        console.error('Error al cargar los menús:', error);
        Swal.fire('Error', 'No se pudieron cargar los menús disponibles.', 'error');
      }
    };

    const cargarEleccionesUsuario = async () => {
      if (!userId) return;
      try {
        const response = await fetch('/api/fetch_user_selections.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId }),
        });
        const data = await response.json();
        if (data.success) {
          const userSelections = data.selections.map((selection: any) => ({
            title: `Tu elección: ${selection.opcion_menu}`,
            start: selection.fecha,
            backgroundColor: 'red',
            borderColor: 'black',
            textColor: 'white',
            extendedProps: {
              tipo: selection.opcion_menu,
              seleccionada: true,
            },
          }));
          setEvents((prevEvents) => [...prevEvents, ...userSelections]);
        }
      } catch (error) {
        console.error('Error al cargar las elecciones del usuario:', error);
        Swal.fire('Error', 'No se pudieron cargar tus elecciones.', 'error');
      }
    };

    cargarMenus();
    cargarEleccionesUsuario();
  }, [userId]);

  const verificarEleccion = async (fecha: string) => {
    try {
      const response = await fetch('/api/verificar_eleccion.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fecha, user_id: userId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error al verificar la elección:', error);
      throw new Error('Error al verificar elección');
    }
  };
 /*****  ---__---> */


  const guardarEleccion = async (fecha: string, opcionMenu: string) => {
    try {
      const response = await fetch('/api/guardar_eleccion.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fecha, user_id: userId, opcion_menu: opcionMenu }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error al guardar la elección:', error);
      throw new Error('Error al guardar elección');
    }
  };

  const handleEventClick = async (eventClickInfo: any) => {
    const { tipo, nombre, seleccionada } = eventClickInfo.event.extendedProps;
    const fechaSeleccionada = eventClickInfo.event.startStr;

    if (seleccionada) {
      Swal.fire('Elección ya registrada', `Ya has seleccionado: ${nombre} para este día.`, 'info');
      return;
    }

    try {
      const data = await verificarEleccion(fechaSeleccionada);
      if (data.eleccion_existente) {
        Swal.fire('Elección ya registrada', 'Ya has seleccionado una opción para este día.', 'info');
      } else {
        Swal.fire({
          title: `Seleccionar Menú para ${fechaSeleccionada}`,
          text: `Opción seleccionada: ${tipo} - ${nombre}`,
          showCancelButton: true,
          confirmButtonText: 'Confirmar',
          confirmButtonColor: 'green',
          cancelButtonColor: 'red',
        }).then(async (result) => {
          if (result.isConfirmed) {
            const saveResponse = await guardarEleccion(fechaSeleccionada, tipo);
            if (saveResponse.success) {
              Swal.fire('Elección guardada', 'Tu elección ha sido registrada.', 'success');
              setEvents((prevEvents) => [
                ...prevEvents,
                {
                  title: `Tu elección: ${nombre}`,
                  start: fechaSeleccionada,
                  backgroundColor: 'red',
                  borderColor: 'black',
                  textColor: 'white',
                  extendedProps: {
                    tipo,
                    seleccionada: true,
                  },
                },
              ]);
            } else {
              Swal.fire('Error', saveResponse.message || 'Error al guardar la elección.', 'error');
            }
          }
        });
      }
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al procesar tu solicitud.', 'error');
    }
  };

  return (
    <div>
      <h1>Selecciona tu menú para el día</h1>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
      />
    </div>
  );
};

export default UserMenuSelection;
