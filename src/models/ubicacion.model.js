import mongoose from 'mongoose';

const ubicacionSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true,
        },
        latitud: {
            type: Number,
            required: true,
        },
        longitud: {
            type: Number,
            required: true,
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

