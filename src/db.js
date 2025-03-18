// Este archivo configura la conexión a la base de datos MongoDB utilizando Mongoose.
// La función `connectDB` establece la conexión y maneja errores si la conexión falla.

import mongoose from "mongoose"; 

// Función para conectar a la base de datos MongoDB
export const connectDB = async () => {
    try {
        await mongoose.connect( 
        //"mongodb://127.0.0.1:27017/AgriStore"
        "mongodb+srv://moy:G5dfmKtvZHwyLqWA@clustermoy.wfikf.mongodb.net/AgriStore?retryWrites=true&w=majority&appName=ClusterMoy" // URI de conexión a MongoDB Atlas
        );
        console.log("MongoDB conectado");
    } catch (error) {
        console.error("Error al conectar MongoDB:", error);
    }
};

