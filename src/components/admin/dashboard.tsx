"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { FaClipboardList, FaChartBar, FaHamburger, FaBell } from "react-icons/fa";

interface Order {
  id: number;
  client: string;
  dish: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [kpis, setKpis] = useState({
    pendingOrders: 0,
    servedClients: 0,
    topDish: "N/A",
    activeReservations: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Simulación de datos para KPIs y pedidos recientes
    setKpis({
      pendingOrders: 8,
      servedClients: 120,
      topDish: "Milanesa con Papas",
      activeReservations: 25,
    });

    setOrders([
      { id: 1, client: "Juan Pérez", dish: "Ensalada César", status: "Pendiente" },
      { id: 2, client: "Ana López", dish: "Hamburguesa", status: "Listo" },
      { id: 3, client: "Carlos Díaz", dish: "Milanesa", status: "En preparación" },
    ]);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Dashboard del Restaurante
      </Typography>

      {/* KPIs */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Pedidos Pendientes</Typography>
              <Typography variant="h4">{kpis.pendingOrders}</Typography>
              <FaClipboardList size={32} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Clientes Atendidos</Typography>
              <Typography variant="h4">{kpis.servedClients}</Typography>
              <FaChartBar size={32} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Plato Más Solicitado</Typography>
              <Typography variant="h4">{kpis.topDish}</Typography>
              <FaHamburger size={32} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Reservas Activas</Typography>
              <Typography variant="h4">{kpis.activeReservations}</Typography>
              <FaBell size={32} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pedidos Recientes */}
      <Typography variant="h6" gutterBottom>
        Pedidos Recientes
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Cliente</TableCell>
            <TableCell>Plato</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.client}</TableCell>
              <TableCell>{order.dish}</TableCell>
              <TableCell>{order.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default Dashboard;
