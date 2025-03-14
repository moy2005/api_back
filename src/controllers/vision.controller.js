import Vision from '../models/vision.model.js';
import mongoose from 'mongoose';

// Obtener todas las visiones
export const getVisiones = async (req, res) => {
    try {
        const visiones = await Vision.find({}).populate('user', 'name email');
        res.json(visiones);
    } catch (error) {
        return res.status(500).json({ message: "Hubo un fallo al obtener las visiones" });
    }
};

// Crear una visión
export const createVision = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const { title, description, user } = req.body;

        // Validar si el usuario existe
        const existingUser = await mongoose.model('User').findById(user);
        if (!existingUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const newVision = new Vision({
            title,
            description,
            user: existingUser._id,
        });

        const savedVision = await newVision.save();
        res.status(201).json(savedVision);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Hubo un fallo al crear la visión" });
    }
};

// Obtener una visión por ID
export const getVision = async (req, res) => {
    try {
        const vision = await Vision.findById(req.params.id).populate('user', 'name email');
        if (!vision) return res.status(404).json({ message: 'Visión no encontrada' });
        res.json(vision);
    } catch (error) {
        return res.status(404).json({ message: "Visión no encontrada" });
    }
};

// Eliminar una visión
export const deleteVision = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const vision = await Vision.findByIdAndDelete(req.params.id);
        if (!vision) return res.status(404).json({ message: 'Visión no encontrada' });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(401).json({ message: "Visión no encontrada" });
    }
};

// Actualizar una visión
export const updateVision = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const { id } = req.params;
        const { user, ...updateData } = req.body;

        // Validar si el usuario existe
        if (user) {
            const existingUser = await mongoose.model('User').findById(user);
            if (!existingUser) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            updateData.user = existingUser._id;
        }

        const vision = await Vision.findByIdAndUpdate(id, updateData, { new: true })
            .populate('user', 'name email');

        if (!vision) {
            return res.status(404).json({ message: 'Visión no encontrada' });
        }

        res.json(vision);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

