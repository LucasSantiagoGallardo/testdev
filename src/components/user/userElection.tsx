"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Grid, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
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
  turno?: string;
}

const UserElections: React.FC = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const [turnosDisponibles, setTurnosDisponibles] = useState<{ [key: string]: number }>({});
  const [selectedTurnos, setSelectedTurnos] = useState<{ [key: string]: string }>({});
  const [userId, setUserId] = useState<string | null>(null);

  const turnos = [
    { label: "12:00 - 12:30", value: "12:00" },
    { label: "12:30 - 13:00", value: "12:30" },
    { label: "13:00 - 13:30", value: "13:00" },
    { label: "13:30 - 14:00", value: "13:30" },
  ];

  // Cargar DNI del localStorage al montar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedDni = localStorage.getItem("dni");
      setUserId(storedDni || null);
    }
  }, []);

  // Cargar elecciones del usuario y turnos disponibles
  useEffect(() => {
    if (userId) {
      fetchElections();
      fetchTurnosDisponibles();
    }
  }, [userId]);

  const fetchElections = async () => {
    try {
      const response = await axios.post("/api/elections", { userId });
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

  const fetchTurnosDisponibles = async () => {
    try {
      const response = await axios.get("/api/turnos");
      if (response.data.success) {
        setTurnosDisponibles(response.data.turnosDisponibles);
      } else {
        console.error("Error al obtener turnos disponibles:", response.data.message);
      }
    } catch (error) {
      console.error("Error en la solicitud de turnos disponibles:", error);
    }
  };

  const handleCommentChange = (electionId: string, comment: string) => {
    setComments((prev) => ({ ...prev, [electionId]: comment }));
  };

  const handleTurnoChange = (electionId: string, turno: string) => {
    setSelectedTurnos((prev) => ({ ...prev, [electionId]: turno }));
  };

  const handleSaveElection = async (electionId: string) => {
    const comment = comments[electionId] || "";
    const turno = selectedTurnos[electionId];

    if (!turno) {
      alert("Debe seleccionar un turno antes de guardar.");
      return;
    }

    try {
      const response = await axios.post("/api/save_election", {
        electionId,
        comment,
        turno,
        userId,
      });
      if (response.data.success) {
        fetchElections();
        fetchTurnosDisponibles();
      } else {
        console.error("Error al guardar la elección:", response.data.message);
      }
    } catch (error) {
      console.error("Error en la solicitud de guardar elección:", error);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Elige tu Menú y Turno de Almuerzo
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

                <FormControl fullWidth margin="normal">
                  <InputLabel id={`turno-label-${election.id}`}>Seleccionar Turno</InputLabel>
                  <Select
                    labelId={`turno-label-${election.id}`}
                    value={selectedTurnos[election.id] || ""}
                    onChange={(e) => handleTurnoChange(election.id, e.target.value)}
                  >
                    {turnos.map((turno) => (
                      <MenuItem
                        key={turno.value}
                        value={turno.value}
                        disabled={turnosDisponibles[`${election.fecha}-${turno.value}`] >= 20}
                      >
                        {turno.label} (
                        {20 - (turnosDisponibles[`${election.fecha}-${turno.value}`] || 0)}
                        {" "} lugares disponibles)
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

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
                  color="success"
                  onClick={() => handleSaveElection(election.id)}
                >
                  Guardar Elección
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
