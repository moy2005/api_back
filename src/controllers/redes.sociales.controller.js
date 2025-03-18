import RedesSociales from '../models/redes.sociales.model.js';
import mongoose from 'mongoose';

// Obtener todas las redes sociales
export const getRedesSociales = async (req, res) => {
    try {
        const redesSociales = await RedesSociales.find().populate('user', 'name email');
        res.json(redesSociales);
    } catch (error) {
        return res.status(500).json({ message: "Hubo un fallo al obtener las redes sociales" });
    }
};

// Crear una red social
export const createRedSocial = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const { plataforma, enlace } = req.body;

        // Verificar que el usuario que crea la red social existe
        const existingUser = await mongoose.model('User').findById(req.user.id);
        if (!existingUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const newRedSocial = new RedesSociales({
            plataforma,
            enlace,
            user: existingUser._id,
        });

        const savedRedSocial = await newRedSocial.save();
        res.status(201).json(savedRedSocial);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Hubo un fallo al crear la red social" });
    }
};

// Obtener una red social por ID
export const getRedSocial = async (req, res) => {
    try {
        const redSocial = await RedesSociales.findById(req.params.id).populate('user', 'name email');
        if (!redSocial) return res.status(404).json({ message: 'Red social no encontrada' });
        res.json(redSocial);
    } catch (error) {
        return res.status(404).json({ message: "Red social no encontrada" });
    }
};

// Eliminar una red social
export const deleteRedSocial = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const redSocial = await RedesSociales.findByIdAndDelete(req.params.id);
        if (!redSocial) return res.status(404).json({ message: 'Red social no encontrada' });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(401).json({ message: "Red social no encontrada" });
    }
};

// Actualizar una red social
export const updateRedSocial = async (req, res) => {
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

        const redSocial = await RedesSociales.findByIdAndUpdate(id, updateData, { new: true })
            .populate('user', 'name email');

        if (!redSocial) {
            return res.status(404).json({ message: 'Red social no encontrada' });
        }

        res.json(redSocial);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

