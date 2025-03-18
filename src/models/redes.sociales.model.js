import mongoose from 'mongoose';

const redesSocialesSchema = new mongoose.Schema(
    {
        plataforma: {
            type: String,
            required: true,
            trim: true,
        },
        enlace: {
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

export default mongoose.model('RedesSociales', redesSocialesSchema);
