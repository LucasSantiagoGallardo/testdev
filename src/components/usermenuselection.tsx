import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Swal from 'sweetalert2';

const menuColors: Record<string, string> = {
  plato_principal: 'blue',
  menu_vegetariano: 'green',
  ensalada: 'purple',
  postre: 'orange',
};

const UserMenuSelection = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Obtener DNI del localStorage
  useEffect(() => {
    const storedDni = localStorage.getItem('dni');
    if (storedDni) {
      setUserId(storedDni);
    } else {
      console.error('DNI no encontrado en localStorage');
    }
  }, []);

  // Cargar menús y elecciones del usuario
  useEffect(() => {
    cargarMenus();
    if (userId) cargarEleccionesUsuario();
  }, [userId]);

  const cargarMenus = async () => {
    try {
      const response = await fetch('/api/menus', { method: 'GET' });
      const data = await response.json();
      console.log("Datos recibidos de la API /api/menus:", data);

      const loadedEvents = data.map((menu: any) => ({
        id: `menu-${menu.id}`,
        title: `${menu.tipo}: ${menu.nombre}`,
        start: new Date(menu.fecha).toISOString().split('T')[0],
        backgroundColor: menuColors[menu.tipo] || 'gray',
        extendedProps: { ...menu },
      }));

      setEvents(loadedEvents);
    } catch (error) {
      console.error('Error al cargar los menús:', error);
      Swal.fire('Error', 'No se pudieron cargar los menús disponibles.', 'error');
    }
  };

  const cargarEleccionesUsuario = async () => {
    try {
      const response = await fetch('/api/elections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (data.success) {
        const userSelections = data.elections.map((selection: any) => ({
          id: `selection-${selection.id}`,
          title: `Tu elección: ${selection.opcion_menu}`,
          start: new Date(selection.fecha).toISOString().split('T')[0], // Aseguramos el formato correcto de la fecha
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

  const guardarEleccion = async (fecha: string, opcionMenu: string, nombre: string, turno: number) => {
    console.log("Guardando elección:", { userId, fecha, opcionMenu, nombre, turno });

    try {
      const response = await fetch('/api/elections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, fecha, opcionMenu, turno, nombre }),
      });
      const data = await response.json();
      console.log("Respuesta de la API al guardar elección:", data);
      return data;
    } catch (error) {
      console.error('Error al guardar la elección:', error);
    }
  };

  const handleEventClick = async (eventClickInfo: any) => {
    const { tipo, nombre, seleccionada } = eventClickInfo.event.extendedProps;
    const fechaSeleccionada = eventClickInfo.event.startStr;

    if (seleccionada) {
      Swal.fire('Elección ya registrada', `Ya has seleccionado: ${nombre} para este día.`, 'info');
      return;
    }

    // Preguntar al usuario qué turno quiere elegir
    const { value: turnoSeleccionado } = await Swal.fire({
      title: `Seleccionar Turno para ${fechaSeleccionada}`,
      input: 'select',
      inputOptions: {
        1: '12:00 - 12:30',
        2: '12:30 - 13:00',
        3: '13:00 - 13:30',
        4: '13:30 - 14:00'
      },
      inputPlaceholder: 'Selecciona un turno',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    });

    if (!turnoSeleccionado) {
      Swal.fire('Turno no seleccionado', 'Debes elegir un turno para continuar.', 'warning');
      return;
    }

    // Guardar la elección en el backend
    try {
      const saveResponse = await guardarEleccion(fechaSeleccionada, tipo, nombre, parseInt(turnoSeleccionado));
      if (saveResponse.success) {
        Swal.fire('Elección guardada', 'Tu elección ha sido registrada.', 'success');
        cargarEleccionesUsuario();  // Recargar elecciones para mostrar la elección del día correctamente
      } else {
        Swal.fire('Error', saveResponse.message || 'Error al guardar la elección.', 'error');
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
