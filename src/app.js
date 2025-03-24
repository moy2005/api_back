// Este archivo configura la aplicación principal de Express para el backend.
// Aquí se incluyen middlewares como morgan, cors y cookie-parser, y se montan las rutas de autenticación y tareas.
// Esto actúa como el núcleo del servidor, manejando la configuración global y la integración de rutas.

// Importar módulos principales
import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/products.routes.js";
import ventasRoutes from "./routes/ventas.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import marcaRoutes from "./routes/marca.routes.js";
import visionRoutes from "./routes/vision.routes.js";
import misionRoutes from "./routes/mision.routes.js";
import politicasRoutes from "./routes/politicas.routes.js";
import preguntasFre from "./routes/preguntas.routes.js";
import dispositivo from "./routes/dispositivos.routes.js";
import ubicacion from "./routes/ubicacion.routes.js";
import redesSociales from "./routes/redes.sociales.routes.js";
import estadoDispositivo from "./routes/estadoDispositivo.routes.js"
import historialAcciones from "./routes/historial.acciones.routes.js"
import mqttRoutes from "./routes/mqtt.routes.js"
import actuatorRoutes from "./routes/dispositivos.routes.js";

// Cargar las variables de entorno
dotenv.config();

const app = express();

app.use(cors({
  origin: true, // Refleja automáticamente el origen
  credentials:true
}));


// aactuakizacion de coors

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

connectDB();

// Configuración de la sesión
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super_secret_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: mongoose.connection.getClient(), // Usar la conexión existente de mongoose
      collectionName: "sessions",
      ttl: 10 * 60, // 10 minutos
      autoRemove: "native",
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 10 * 60 * 1000, // 10 minutos
    },
  })
);

// Montar las rutas
app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/api", ventasRoutes);
app.use("/api", categoryRoutes);
app.use("/api", marcaRoutes);
app.use("/api", visionRoutes);
app.use("/api", misionRoutes);
app.use("/api", politicasRoutes);
app.use("/api", preguntasFre);
app.use("/api", dispositivo);
app.use("/api", ubicacion);
app.use("/api", redesSociales);
app.use("/api", estadoDispositivo);
app.use("/api",historialAcciones)
app.use("/api",mqttRoutes)
app.use('/api/actuadores', actuatorRoutes);

export default app;
