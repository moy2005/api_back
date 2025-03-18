import Vision from '../models/vision.model.js';
import mongoose from 'mongoose';

// Obtener todas las visiones activas
export const getVisiones = async (req, res) => {
    try {
        const visiones = await Vision.find().populate('user', 'name email');
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

        const { title, description } = req.body;

        // Verificar que el usuario que crea la visión existe
        const existingUser = await mongoose.model('User').findById(req.user.id);
        if (!existingUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const newVision = new Vision({
            title,
            description,
            user: existingUser._id,
            estado: true, // La visión se crea activa por defecto
        });

        const savedVision = await newVision.save();
        res.status(201).json(savedVision);
    } catch (error) {
        console.error(error);
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

// Actualizar una visión (incluyendo el estado)
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

// Nueva función para cambiar el estado de la visión (activar o desactivar)
export const updateEstadoVision = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const { id } = req.params;
        const { estado } = req.body; // true o false

        const vision = await Vision.findByIdAndUpdate(id, { estado }, { new: true });

        if (!vision) {
            return res.status(404).json({ message: "Visión no encontrada" });
        }

        res.json({ message: `Estado actualizado a ${estado ? 'activo' : 'inactivo'}`, vision });
    } catch (error) {
        return res.status(500).json({ message: "Hubo un fallo al actualizar el estado" });
    }
};
