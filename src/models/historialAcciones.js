import mongoose from 'mongoose';

const historialAccionesSchema = new mongoose.Schema({
    macAddress: {
        type: String,
        required: true,
    },
    accion: {
        type: String,
        required: true,
        enum: ['ventilador', 'ventana', 'riego'], // Tipos de acciones permitidas
    },
    estadoAnterior: {
        type: String,
        required: true,
    },
    estadoNuevo: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const HistorialAcciones = mongoose.model('HistorialAcciones', historialAccionesSchema);

export default HistorialAcciones;

