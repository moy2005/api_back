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
            default:null,
        }
    },
    {
        timestamps: true,
    }
);

export const Dispositivo = mongoose.model("Dispositivo", dispositivoSchema);

