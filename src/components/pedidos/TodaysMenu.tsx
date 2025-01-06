import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, CardMedia, Divider } from '@mui/material';

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

const TodaysMenu: React.FC = () => {
  const [menu, setMenu] = useState<Menu | null>(null);

  useEffect(() => {
    // Fetch del menú del día elegido por el usuario
    fetch('/api/fetch_todays_menu.php')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMenu(data.menu);
        } else {
          console.error("No se encontró el menú de hoy:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error al obtener el menú del día:", error);
      });
  }, []);

  if (!menu) {
    return <Typography variant="body1">No has seleccionado un menú para hoy.</Typography>;
  }

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Card sx={{
        maxWidth: 345,
        padding: 2,
        boxShadow: 4,
        borderRadius: 3,
        bgcolor: '#f9f9f9',
        color: '#333',
        textAlign: 'center',
      }}>
        {menu.foto && (
          <CardMedia
            component="img"
            height="200"
            image={menu.foto}
            alt={menu.nombre}
            sx={{
              borderRadius: 2,
              marginBottom: 2,
              objectFit: 'cover'
            }}
          />
        )}
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            {menu.nombre}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <strong>Tipo:</strong> {menu.tipo}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
            <strong>Ingredientes:</strong> {menu.ingredientes}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="textSecondary">
            <strong>Calorías:</strong> {menu.calorias} kcal
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <strong>Cantidad por porción:</strong> {menu.cantidad_porcion}g
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TodaysMenu;
