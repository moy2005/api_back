import Mision from '../models/mision.model.js';
import mongoose from 'mongoose';

// Obtener todas las misiones activas
export const getMisiones = async (req, res) => {
    try {
        const misiones = await Mision.find().populate('user', 'name email');
        res.json(misiones);
    } catch (error) {
        return res.status(500).json({ message: "Hubo un fallo al obtener las misiones" });
    }
};

// Crear una misión
export const createMision = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const { title, description } = req.body;

        // Verificar que el usuario que crea la misión existe
        const existingUser = await mongoose.model('User').findById(req.user.id);
        if (!existingUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const newMision = new Mision({
            title,
            description,
            user: existingUser._id,
            estado: true, // La misión se crea activa por defecto
        });

        const savedMision = await newMision.save();
        res.status(201).json(savedMision);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Hubo un fallo al crear la misión" });
    }
};

// Obtener una misión por ID
export const getMision = async (req, res) => {
    try {
        const mision = await Mision.findById(req.params.id).populate('user', 'name email');
        if (!mision) return res.status(404).json({ message: 'Misión no encontrada' });
        res.json(mision);
    } catch (error) {
        return res.status(404).json({ message: "Misión no encontrada" });
    }
};

// Eliminar una misión
export const deleteMision = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const mision = await Mision.findByIdAndDelete(req.params.id);
        if (!mision) return res.status(404).json({ message: 'Misión no encontrada' });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(401).json({ message: "Misión no encontrada" });
    }
};

// Actualizar una misión (incluyendo el estado)
export const updateMision = async (req, res) => {
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

        const mision = await Mision.findByIdAndUpdate(id, updateData, { new: true })
            .populate('user', 'name email');

        if (!mision) {
            return res.status(404).json({ message: 'Misión no encontrada' });
        }

        res.json(mision);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Nueva función para cambiar el estado de la misión (activar o desactivar)
/*export const updateEstadoMision = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const { id } = req.params;
        const { estado } = req.body; // true o false

        const mision = await Mision.findByIdAndUpdate(id, { estado }, { new: true });

        if (!mision) {
            return res.status(404).json({ message: "Misión no encontrada" });
        }

        res.json({ message: `Estado actualizado a ${estado ? 'activo' : 'inactivo'}`, mision });
    } catch (error) {
        return res.status(500).json({ message: "Hubo un fallo al actualizar el estado" });
    }
};

*/
