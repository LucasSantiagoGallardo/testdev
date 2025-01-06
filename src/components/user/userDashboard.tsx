"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper, Card, CardContent, Button } from "@mui/material";
import axios from "axios";
import UserElections from "./userElection";

interface MenuOption {
  id: string;
  tipo: string;
  nombre: string;
  ingredientes: string;
  calorias: number;
  foto: string;
  cantidad_porcion: string;
}

interface Election {
  id: string;
  nombre: string;
  fecha: string;
  tipo: string;
}

const Dashboard: React.FC = () => {
  const [menu, setMenu] = useState<MenuOption | null>(null);
  const [menuOptions, setMenuOptions] = useState<MenuOption[]>([]);
  const [elections, setElections] = useState<Election[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);

  const dni = localStorage.getItem("dni");

  useEffect(() => {
    if (!dni) {
      console.error("El DNI no está definido en localStorage.");
      return;
    }
    fetchTodayMenu();
    fetchElections();
    fetchNotifications();
  }, []);

  const fetchTodayMenu = async () => {
    try {
      const response = await axios.post("/api/menuhoy.php", { userId: dni });
      if (response.data.success) {
        if (response.data.reserved) {
          setMenu(response.data.menu);
        } else {
          setMenuOptions(response.data.menus);
        }
      } else {
        console.error("Error al obtener el menú:", response.data.message);
      }
    } catch (error) {
      console.error("Error en la solicitud del menú:", error);
    }
  };

  const fetchElections = async () => {
    try {
      const response = await axios.post("/api/elections.php", { userId: dni });
      if (response.data.success) {
        setElections(response.data.elections);
      } else {
        console.error("Error al obtener elecciones:", response.data.message);
      }
    } catch (error) {
      console.error("Error en la solicitud de elecciones:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/api/notifications.php");
      if (response.data.success) {
        setNotifications(response.data.notifications);
      } else {
        console.error("Error al obtener notificaciones:", response.data.message);
      }
    } catch (error) {
      console.error("Error en la solicitud de notificaciones:", error);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom align="center">
        Dashboard
      </Typography>

      {/* Menú del Día */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Menú del Día
        </Typography>
        {menu ? (
          <Card sx={{ p: 2, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6">Tu Reserva de Hoy</Typography>
              <Typography><strong>Nombre:</strong> {menu.nombre}</Typography>
              <Typography><strong>Tipo:</strong> {menu.tipo}</Typography>
              <Typography><strong>Calorías:</strong> {menu.calorias}</Typography>
              {menu.foto && (
                <Box my={2} display="flex" justifyContent="center">
                  <img
                    src={menu.foto}
                    alt={menu.nombre}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {menuOptions.map((menu) => (
              <Grid item xs={12} sm={6} md={4} key={menu.id}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" align="center">{menu.nombre}</Typography>
                    <Typography><strong>Tipo:</strong> {menu.tipo}</Typography>
                    <Typography><strong>Calorías:</strong> {menu.calorias}</Typography>
                    {menu.foto && (
                      <Box my={2} display="flex" justifyContent="center">
                        <img
                          src={menu.foto}
                          alt={menu.nombre}
                          style={{
                            maxWidth: "100%",
                            height: "auto",
                            borderRadius: "8px",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          }}
                        />
                      </Box>
                    )}
                    <Button variant="contained" color="primary" fullWidth disabled>
                      Reservar
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Últimas Elecciones */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Tus Últimas Elecciones
        </Typography>
        <Grid container spacing={2}>
            <UserElections></UserElections>
          {elections.map((election) => (
            <Grid item xs={12} sm={6} md={4} key={election.id}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6">{election.nombre}</Typography>
                  <Typography><strong>Fecha:</strong> {election.fecha}</Typography>
                  <Typography><strong>Tipo:</strong> {election.tipo}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Notificaciones */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Notificaciones
        </Typography>
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>{notification}</li>
          ))}
        </ul>
      </Paper>

      {/* Accesos Rápidos */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h5" gutterBottom>
          Accesos Rápidos
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Button variant="contained" fullWidth disabled
            >
              Reservar Menú
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button variant="contained" fullWidth disabled >
              Historial
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button variant="contained" fullWidth disabled>
              Editar Perfil
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard;
