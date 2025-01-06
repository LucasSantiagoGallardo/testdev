"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";
import Image from "next/image";

interface Election {
  id: string;
  opcion_menu: string;
  fecha: string;
  nombre: string;
  ingredientes: string;
  calorias: number;
  foto: string;
  cantidad_porcion: string;
  comentario?: string;
}

const UserElections: React.FC = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const [userId, setUserId] = useState<string | null>(null);

  // Cargar DNI del localStorage al montar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedDni = localStorage.getItem("dni");
      setUserId(storedDni || null);
    }
  }, []);

  // Cargar elecciones del usuario
  const fetchElections = async () => {
    try {
      if (!userId) return; // Asegurar que userId esté definido
      const response = await axios.post("/api/fetch_user_elections.php", { userId });
      if (response.data.success) {
        setElections(response.data.elections);
        const initialComments = response.data.elections.reduce(
          (acc: { [key: string]: string }, election: Election) => {
            acc[election.id] = election.comentario || "";
            return acc;
          },
          {}
        );
        setComments(initialComments);
      } else {
        console.error("Error al obtener elecciones:", response.data.message);
      }
    } catch (error) {
      console.error("Error en la solicitud de elecciones:", error);
    }
  };

  // Llamar a fetchElections al cargar
  useEffect(() => {
    if (userId) fetchElections();
  }, [userId]);

  // Manejar cambios en comentarios
  const handleCommentChange = (electionId: string, comment: string) => {
    setComments((prev) => ({ ...prev, [electionId]: comment }));
  };

  // Guardar comentario en el servidor
  const handleSaveComment = async (electionId: string) => {
    const comment = comments[electionId] || "";
    try {
      const response = await axios.post("/api/save_comment.php", {
        electionId,
        comment,
      });
      if (response.data.success) {
        fetchElections();
      } else {
        console.error("Error al guardar el comentario:", response.data.message);
      }
    } catch (error) {
      console.error("Error en la solicitud de guardar comentario:", error);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Últimas 7 Elecciones
      </Typography>
      <Grid container spacing={2}>
        {elections.map((election) => (
          <Grid item xs={12} sm={6} md={4} key={election.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{election.nombre}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Fecha: {election.fecha}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Tipo: {election.opcion_menu}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Calorías: {election.calorias}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Cantidad por Porción: {election.cantidad_porcion}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Ingredientes: {election.ingredientes}
                </Typography>

                {election.foto && (
                  <Box my={2}>
                    <Image
                      src={election.foto}
                      alt={election.nombre}
                      width={200}
                      height={150}
                      style={{ borderRadius: "4px" }}
                    />
                  </Box>
                )}

                <TextField
                  label="Comentario"
                  fullWidth
                  multiline
                  value={comments[election.id] || ""}
                  onChange={(e) => handleCommentChange(election.id, e.target.value)}
                  variant="outlined"
                  margin="normal"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSaveComment(election.id)}
                >
                  Guardar Comentario
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UserElections;
