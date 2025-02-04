export interface Menu {
    id: number;
    name: string;
    nombre: string;
    ingredients: string[];
    calories: number;
    available: boolean;
    ingredientes: string;
    calorias: number;
    fecha: string; // O Date, dependiendo del tipo que uses en la base de datos
    tipo: string;
    foto: string;
    cantidad_porcion: number;
  }