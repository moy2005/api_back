import mongoose from "mongoose";

const estadoDispositivoSchema = new mongoose.Schema(
    {
        macAddress: {
            type: String,
            required: true,
        },
        temperatura: {
            type: Number,
            required: true,
        },
        humedad: {
            type: Number,
            required: true,
        },
        humedadSuelo: {
            type: Number,
            required: true,
        },
        ventanaAbierta: {
            type: Boolean,
            required: true,
        },
        ventiladorActivo: {
            type: Boolean,
            required: true,
        },
        ventiladorVelocidad: {
            type: Number,
            required: true,
        },
        riegoActivo: {
            type: Boolean,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("EstadoDispositivo", estadoDispositivoSchema);

