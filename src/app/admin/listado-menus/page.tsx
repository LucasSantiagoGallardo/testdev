"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/layout-admin/DefaultLaout";

interface Menu {
  id: number;
  fecha: string;
  tipo: string;
  nombre: string;
  ingredientes: string;
  calorias: number;
  foto: string;
  cantidad_porcion: string;
}

const MenuListByDay: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [groupedMenus, setGroupedMenus] = useState<{ [date: string]: Menu[] }>({});

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch('/api/menus', { method: 'GET' });
        const data = await response.json();
        setMenus(data);
        groupMenusByDate(data);
      } catch (error) {
        console.error('Error al obtener los menús:', error);
      }
    };

    fetchMenus();
  }, []);

  const groupMenusByDate = (menus: Menu[]) => {
    const grouped = menus.reduce((acc: { [date: string]: Menu[] }, menu) => {
      if (!acc[menu.fecha]) {
        acc[menu.fecha] = [];
      }
      acc[menu.fecha].push(menu);
      return acc;
    }, {});

    setGroupedMenus(grouped);
  };

  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <Box p={4}>
          <Typography variant="h4" gutterBottom>Listado de Menús por Día</Typography>
          {Object.keys(groupedMenus).length === 0 ? (
            <Typography variant="body1">No hay menús disponibles.</Typography>
          ) : (
            Object.keys(groupedMenus).sort().map((date) => (
              <Box key={date} mb={4}>
                <Typography variant="h5" gutterBottom>{new Date(date).toLocaleDateString()}</Typography>
                <List>
                  {groupedMenus[date].map((menu) => (
                    <React.Fragment key={menu.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={`${menu.tipo}: ${menu.nombre}`}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="textPrimary">
                                Ingredientes: {menu.ingredientes}
                              </Typography>
                              <br />
                              Calorías: {menu.calorias} kcal
                              <br />
                              Cantidad por Porción: {menu.cantidad_porcion}
                            </>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            ))
          )}
        </Box>
      </div>
    </DefaultLayout>
  );
};

export default MenuListByDay;
