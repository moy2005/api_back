import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
    {
        pregunta: { type: String, required: true },
        respuesta: { type: String, required: true },
        estado: { type: Boolean, default: true } // true = activa, false = inactiva
    },
    {
        timestamps: true, // Crea los campos de createdAt y updatedAt automáticamente
    }
);

export default mongoose.model('FAQ', faqSchema);
