"use client";

import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography, Select, MenuItem, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Swal from 'sweetalert2';
import { SelectChangeEvent } from '@mui/material';

interface Menu {
  id?: string;
  fecha: string;
  tipo: string;
  nombre: string;
  ingredientes: string;
  calorias: number;
  foto: string;
  cantidad_porcion: string;
}

const CrudMenu: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [isCardView, setIsCardView] = useState(true);

  // Función para obtener el color según el tipo de plato
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

  const fetchMenus = async () => {
    const response = await fetch('/api/menus_crud.php?action=read');
    const data = await response.json();
    if (data.success) {
      setMenus(data.menus);
    } else {
      console.error("Error al obtener menús:", data.message);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleSaveMenu = async () => {
    const apiEndpoint = editingMenu && editingMenu.id ? '/api/menus_crud.php?action=update' : '/api/menus_crud.php?action=create';
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingMenu),
    });
    const data = await response.json();
    if (data.success) {
      fetchMenus();
      handleCloseDialog();
    } else {
      console.error("Error al guardar el menú:", data.message);
    }
  };

  const handleDeleteMenu = async (id: string) => {
    if (!id) {
      console.error("ID no válido para la eliminación");
      return;
    }

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Eliminarás el menú con ID: ${id}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      console.log("Eliminando menú con ID:", id);

      const response = await fetch('/api/menus_crud.php?action=delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (data.success) {
        fetchMenus();
        Swal.fire('Eliminado', 'El menú ha sido eliminado exitosamente.', 'success');
      } else {
        Swal.fire('Error', 'No se pudo eliminar el menú.', 'error');
        console.error("Error al eliminar el menú:", data.message);
      }
    }
  };

  const handleOpenDialog = (menu: Menu | null = null) => {
    setEditingMenu(menu || { fecha: '', tipo: '', nombre: '', ingredientes: '', calorias: 0, foto: '', cantidad_porcion: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMenu(null);
  };

  /*const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    if (editingMenu) {
      setEditingMenu({ ...editingMenu, [e.target.name as string]: e.target.value });
    }
  };
*/
const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
) => {
  if (editingMenu) {
    setEditingMenu({ ...editingMenu, [e.target.name as string]: e.target.value });
  }
 
};

const toggleView = () => {
  setIsCardView(!isCardView);
}


  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Gestión de Menús</Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
        Agregar Menú
      </Button>
      <Button variant="outlined" color="secondary" onClick={toggleView} style={{ marginLeft: '1rem' }}>
        {isCardView ? "Ver en Tabla" : "Ver en Cards"}
      </Button>

      {isCardView ? (
        <Grid container spacing={2} mt={2}>
          {menus.map((menu) => (
            <Grid item xs={12} sm={6} md={4} key={menu.id}>
              <Card style={{ backgroundColor: getColorByType(menu.tipo), color: '#fff' }}>
                <CardContent>
                  <Typography variant="h6">{menu.nombre}</Typography>
                  <Typography variant="body2" color="inherit">Fecha: {menu.fecha}</Typography>
                  <Typography variant="body2" color="inherit">Tipo: {menu.tipo}</Typography>
                  <Typography variant="body2" color="inherit">Calorías: {menu.calorias}</Typography>
                  <Typography variant="body2" color="inherit">Cantidad por Porción: {menu.cantidad_porcion}</Typography>
                  <Button color="inherit" onClick={() => handleOpenDialog(menu)}>Editar</Button>
                  <Button color="inherit" onClick={() => handleDeleteMenu(menu.id!)}>Eliminar</Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper} sx={{mt: 2}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Calorías</TableCell>
                <TableCell>Cantidad por Porción</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {menus.map((menu) => (
                <TableRow key={menu.id} style={{ backgroundColor: getColorByType(menu.tipo) }}>
                  <TableCell>{menu.nombre}</TableCell>
                  <TableCell>{menu.fecha}</TableCell>
                  <TableCell>{menu.tipo}</TableCell>
                  <TableCell>{menu.calorias}</TableCell>
                  <TableCell>{menu.cantidad_porcion}</TableCell>
                  <TableCell>
                    <Button color="primary" onClick={() => handleOpenDialog(menu)}>Editar</Button>
                    <Button color="secondary" onClick={() => handleDeleteMenu(menu.id!)}>Eliminar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingMenu && editingMenu.id ? "Editar Menú" : "Agregar Menú"}</DialogTitle>
        <DialogContent>
          <TextField name="fecha" type="date" label="Fecha" fullWidth margin="dense" value={editingMenu?.fecha || ''} onChange={handleChange} />
          
          <FormControl fullWidth margin="dense">
            <InputLabel id="tipo-label">Tipo</InputLabel>
            <Select
              labelId="tipo-label"
              name="tipo"
              value={editingMenu?.tipo || ''}
              onChange={handleChange}
            >
              <MenuItem value="plato_principal">Plato Principal</MenuItem>
              <MenuItem value="menu_vegetariano">Menú Vegetariano</MenuItem>
              <MenuItem value="ensalada">Ensalada</MenuItem>
              <MenuItem value="postre">Postre</MenuItem>
            </Select>
          </FormControl>
          
          <TextField name="nombre" label="Nombre" fullWidth margin="dense" value={editingMenu?.nombre || ''} onChange={handleChange} />
          <TextField name="ingredientes" label="Ingredientes" fullWidth margin="dense" value={editingMenu?.ingredientes || ''} onChange={handleChange} />
          <TextField name="calorias" label="Calorías" type="number" fullWidth margin="dense" value={editingMenu?.calorias || ''} onChange={handleChange} />
          <TextField name="foto" label="URL de la Foto" fullWidth margin="dense" value={editingMenu?.foto || ''} onChange={handleChange} />
          <TextField name="cantidad_porcion" label="Cantidad por Porción" fullWidth margin="dense" value={editingMenu?.cantidad_porcion || ''} onChange={handleChange} />
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Cancelar</Button>
          <Button onClick={handleSaveMenu} color="primary">{editingMenu && editingMenu.id ? "Actualizar" : "Guardar"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CrudMenu;
