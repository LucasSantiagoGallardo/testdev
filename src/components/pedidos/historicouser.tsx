"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Modal, Box, Button } from '@mui/material';

interface Menu {
  id: string;
  fecha: string;
  tipo: string;
  nombre: string;
  ingredientes: string;
  calorias: number;
  foto: string;
  cantidad_porcion: string;
}

const HistoricOrders: React.FC = () => {
  const [orders, setOrders] = useState<Menu[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Menu | null>(null);

  useEffect(() => {
    fetch('/api/fetch_menus1.php')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.menus);
        } else {
          console.error("Error al obtener los pedidos históricos:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error al obtener los pedidos históricos:", error);
      });
  }, []);

  const handleOrderClick = (order: Menu) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  // Definir colores por tipo
  const getColorByType = (tipo: string) => {
    switch (tipo) {
      case 'plato_principal':
        return '#FFC107'; // Amarillo
      case 'menu_vegetariano':
        return '#4CAF50'; // Verde
      case 'ensalada':
        return '#FF5722'; // Naranja
      case 'postre':
        return '#9C27B0'; // Púrpura
      default:
        return '#607D8B'; // Gris para tipos desconocidos
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Pedidos Históricos</Typography>
      <Grid container spacing={2}>
        {orders.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order.id}>
            <Card
              onClick={() => handleOrderClick(order)}
              style={{
                cursor: 'pointer',
                backgroundColor: getColorByType(order.tipo),
                color: 'white' // Color de texto blanco para mejor contraste
              }}
            >
              <CardContent>
                <Typography variant="h6">{order.nombre}</Typography>
                <Typography variant="body2">{order.fecha}</Typography>
                <Typography variant="body2">{order.tipo}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedOrder && (
        <Modal open={Boolean(selectedOrder)} onClose={handleCloseModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}>
            <Typography variant="h5">{selectedOrder.nombre}</Typography>
            <Typography variant="body1"><strong>Tipo:</strong> {selectedOrder.tipo}</Typography>
            <Typography variant="body1"><strong>Ingredientes:</strong> {selectedOrder.ingredientes}</Typography>
            <Typography variant="body1"><strong>Calorías:</strong> {selectedOrder.calorias}</Typography>
            <Typography variant="body1"><strong>Cantidad por Porción:</strong> {selectedOrder.cantidad_porcion}g</Typography>
            {selectedOrder.foto && (
              <img src={selectedOrder.foto} alt={selectedOrder.nombre} style={{ width: '100%', marginTop: '1rem' }} />
            )}
            <Button onClick={handleCloseModal} variant="contained" color="primary" style={{ marginTop: '1rem' }}>Cerrar</Button>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default HistoricOrders;
