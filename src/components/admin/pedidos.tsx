"use client";

import React, { useEffect, useState } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Typography, Avatar, Grid, Card, CardContent } from '@mui/material';
import axios from 'axios';

interface Election {
  opcion_menu: string;
  fecha: string;
  turno: number;
  total: number;
  personas: Persona[];
}

interface Persona {
  nombre: string;
  apellido: string;
  sector: string;
  foto: string;
  id: string;
  opcion_menu: string; // Aseguramos que cada persona tenga su opcion_menu
}

const Pedidos: React.FC = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [startDate, setStartDate] = useState<string>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchElections();
  }, [startDate, endDate]);

  const fetchElections = async () => {
    try {
      const response = await axios.post('/api/fetch_elections', { startDate, endDate });
      if (response.data.success) {
        setElections(response.data.elections);
      } else {
        console.error("Error al obtener elecciones:", response.data.message);
      }
    } catch (error) {
      console.error("Error en la solicitud de elecciones:", error);
    }
  };

  const handleFilter = () => {
    fetchElections();
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Elecciones de Menús por Día</Typography>

      <Box display="flex" gap={2} my={2}>
        <TextField
          label="Fecha de Inicio"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          label="Fecha de Fin"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleFilter}>
          Filtrar
        </Button>
      </Box>

      {elections.map((election) => (
        <Box key={`${election.fecha}-${election.turno}`} mb={4}>
          <Typography variant="h5">Fecha: {election.fecha}</Typography>

          <Card sx={{ p: 2, my: 2 }}>
            <CardContent>
              <Typography variant="h6">Turno: {election.turno}</Typography>
              <Grid container spacing={2}>
                <Grid item xs={2}><Typography variant="body1">Plato Principal: {getMenuCount(election, 'plato_principal')}</Typography></Grid>
                <Grid item xs={2}><Typography variant="body1">Vegetariano: {getMenuCount(election, 'menu_vegetariano')}</Typography></Grid>
                <Grid item xs={2}><Typography variant="body1">Ensalada: {getMenuCount(election, 'ensalada')}</Typography></Grid>
                <Grid item xs={2}><Typography variant="body1">Postre: {getMenuCount(election, 'postre')}</Typography></Grid>
                <Grid item xs={2}><Typography variant="body1">Total: {election.total}</Typography></Grid>
              </Grid>
            </CardContent>
          </Card>

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Foto</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Apellido</TableCell>
                  <TableCell>Sector</TableCell>
                  <TableCell>Plato</TableCell>
                  <TableCell>Entregado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {election.personas?.map((persona) => (
                  <TableRow key={persona.id} style={{ backgroundColor: getColorByMenuType(persona.opcion_menu) }}>
                    <TableCell><Avatar src={persona.foto} alt={persona.nombre} /></TableCell>
                    <TableCell>{persona.nombre}</TableCell>
                    <TableCell>{persona.apellido}</TableCell>
                    <TableCell>{persona.sector}</TableCell>
                    <TableCell>{persona.opcion_menu}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="success" onClick={() => confirmarEntrega(persona.id)}>
                        Confirmar Entrega
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Box>
  );
};

const getColorByMenuType = (tipo: string): string => {
  switch (tipo) {
    case 'plato_principal': return '#FFC107';
    case 'menu_vegetariano': return '#4CAF50';
    case 'ensalada': return '#FF5722';
    case 'postre': return '#9C27B0';
    default: return '#607D8B';
  }
};

const getMenuCount = (election: Election, menuType: string): number => {
  return (election.personas ?? []).filter(persona => persona.opcion_menu === menuType).length;
};

const confirmarEntrega = (id: string) => {
  console.log(`Entrega confirmada para el ID: ${id}`);
};

export default Pedidos;
