import dotenv from "dotenv";
// Cargando el archivo de variables de entorno
dotenv.config();
export const config = {
  API: {
    PORT: process.env.PORT || 3000,
  },
};
