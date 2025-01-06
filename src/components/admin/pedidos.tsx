"use client";

import React, { useEffect, useState } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Typography } from '@mui/material';
import axios from 'axios';

interface Election {
  opcion_menu: string;
  fecha: string;
  total: number;
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
      const response = await axios.post('/api/fetch_elections.php', {
        startDate,
        endDate,
      });
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

  // Agrupa las elecciones por fecha para la visualización
  const groupedElections = elections.reduce((acc: { [key: string]: { [key: string]: number } }, election) => {
    if (!acc[election.fecha]) {
      acc[election.fecha] = {
        plato_principal: 0,
        menu_vegetariano: 0,
        ensalada: 0,
        postre: 0,
      };
    }
    acc[election.fecha][election.opcion_menu] = election.total;
    return acc;
  }, {});

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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Plato Principal</TableCell>
              <TableCell>Menú Vegetariano</TableCell>
              <TableCell>Ensalada</TableCell>
              <TableCell>Postre</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(groupedElections).map(([fecha, opciones]) => (
              <TableRow key={fecha}>
                <TableCell>{fecha}</TableCell>
                <TableCell>{opciones.plato_principal || 0}</TableCell>
                <TableCell>{opciones.menu_vegetariano || 0}</TableCell>
                <TableCell>{opciones.ensalada || 0}</TableCell>
                <TableCell>{opciones.postre || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Pedidos;
