import mongoose from 'mongoose';

const ubicacionSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true,
        },
        direccion: {
            type: String,
            required: true,
            trim: true,
        },
        ciudad: {
            type: String,
            required: true,
            trim: true,
        },
        pais: {
            type: String,
            required: true,
            trim: true,
        },
        codigoPostal: {
            type: String,
            required: true,
            trim: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Ubicacion', ubicacionSchema);

