import Ubicacion from '../models/ubicacion.model.js';
import mongoose from 'mongoose';

// Obtener todas las ubicaciones
export const getUbicaciones = async (req, res) => {
    try {
        const ubicaciones = await Ubicacion.find().populate('user', 'name email');
        res.json(ubicaciones);
    } catch (error) {
        return res.status(500).json({ message: "Hubo un fallo al obtener las ubicaciones" });
    }
};

// Crear una ubicación
export const createUbicacion = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const { nombre, direccion, ciudad, pais, codigoPostal } = req.body;

        // Verificar que el usuario que crea la ubicación existe
        const existingUser = await mongoose.model('User').findById(req.user.id);
        if (!existingUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const newUbicacion = new Ubicacion({
            nombre,
            direccion,
            ciudad,
            pais,
            codigoPostal,
            user: existingUser._id,
        });

        const savedUbicacion = await newUbicacion.save();
        res.status(201).json(savedUbicacion);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Hubo un fallo al crear la ubicación" });
    }
};

// Obtener una ubicación por ID
export const getUbicacion = async (req, res) => {
    try {
        const ubicacion = await Ubicacion.findById(req.params.id).populate('user', 'name email');
        if (!ubicacion) return res.status(404).json({ message: 'Ubicación no encontrada' });
        res.json(ubicacion);
    } catch (error) {
        return res.status(404).json({ message: "Ubicación no encontrada" });
    }
};

// Eliminar una ubicación
export const deleteUbicacion = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const ubicacion = await Ubicacion.findByIdAndDelete(req.params.id);
        if (!ubicacion) return res.status(404).json({ message: 'Ubicación no encontrada' });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(401).json({ message: "Ubicación no encontrada" });
    }
};

// Actualizar una ubicación
export const updateUbicacion = async (req, res) => {
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

        const ubicacion = await Ubicacion.findByIdAndUpdate(id, updateData, { new: true })
            .populate('user', 'name email');

        if (!ubicacion) {
            return res.status(404).json({ message: 'Ubicación no encontrada' });
        }

        res.json(ubicacion);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

