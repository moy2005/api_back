import mongoose from "mongoose";

const dispositivoSchema = new mongoose.Schema(
    {
        macAddress: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        }
    },
    {
        timestamps: true,
    }
);

// ✅ Exportación con 'default' para evitar problemas de importación
export default mongoose.model("Dispositivo", dispositivoSchema);

