import Politica from '../models/politicas.model.js';
import mongoose from 'mongoose';

// Obtener todas las políticas activas
export const getPoliticas = async (req, res) => {
    try {
        const politicas = await Politica.find().populate('user', 'name email');
        res.json(politicas);
    } catch (error) {
        return res.status(500).json({ message: "Hubo un fallo al obtener las políticas" });
    }
};

// Crear una política
export const createPolitica = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const { title, description } = req.body;

        // Verificar que el usuario que crea la política existe
        const existingUser = await mongoose.model('User').findById(req.user.id);
        if (!existingUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const newPolitica = new Politica({
            title,
            description,
            user: existingUser._id,
            estado: true, // La política se crea activa por defecto
        });

        const savedPolitica = await newPolitica.save();
        res.status(201).json(savedPolitica);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Hubo un fallo al crear la política" });
    }
};

// Obtener una política por ID
export const getPolitica = async (req, res) => {
    try {
        const politica = await Politica.findById(req.params.id).populate('user', 'name email');
        if (!politica) return res.status(404).json({ message: 'Política no encontrada' });
        res.json(politica);
    } catch (error) {
        return res.status(404).json({ message: "Política no encontrada" });
    }
};

// Eliminar una política
export const deletePolitica = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const politica = await Politica.findByIdAndDelete(req.params.id);
        if (!politica) return res.status(404).json({ message: 'Política no encontrada' });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(401).json({ message: "Política no encontrada" });
    }
};

// Actualizar una política (incluyendo el estado)
export const updatePolitica = async (req, res) => {
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

        const politica = await Politica.findByIdAndUpdate(id, updateData, { new: true })
            .populate('user', 'name email');

        if (!politica) {
            return res.status(404).json({ message: 'Política no encontrada' });
        }

        res.json(politica);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Nueva función para cambiar el estado de la política (activar o desactivar)
export const updateEstadoPolitica = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const { id } = req.params;
        const { estado } = req.body; // true o false

        const politica = await Politica.findByIdAndUpdate(id, { estado }, { new: true });

        if (!politica) {
            return res.status(404).json({ message: "Política no encontrada" });
        }

        res.json({ message: `Estado actualizado a ${estado ? 'activo' : 'inactivo'}`, politica });
    } catch (error) {
        return res.status(500).json({ message: "Hubo un fallo al actualizar el estado" });
    }
};


