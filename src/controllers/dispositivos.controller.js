import Dispositivo from '../models/dispositivo.model.js';
import mongoose from 'mongoose';

// Obtener todos los dispositivos
export const getDispositivos = async (req, res) => {
    try {
        const dispositivos = await Dispositivo.find().populate('user');
        res.json(dispositivos);
    } catch (error) {
        return res.status(500).json({ message: "Hubo un fallo al obtener los dispositivos" });
    }
};

export const getDispositivosByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const dispositivos = await Dispositivo.find({ user: userId });
        res.json(dispositivos);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener dispositivos del usuario" });
    }
};

// Crear un dispositivo (solo para clientes)
export const createDispositivo = async (req, res) => {
    try {
        if (req.user.role !== 'cliente') {
            return res.status(403).json({ message: "Acción no permitida. Solo para clientes." });
        }

        const { macAddress, name } = req.body;

        // Verificar que el usuario que crea el dispositivo existe
        const existingUser = await mongoose.model('User').findById(req.user.id);
        if (!existingUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const newDispositivo = new Dispositivo({
            macAddress,
            name,
            user: existingUser._id,
        });

        const savedDispositivo = await newDispositivo.save();
        res.status(201).json(savedDispositivo);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Hubo un fallo al crear el dispositivo" });
    }
};

// Obtener un dispositivo por ID
export const getDispositivo = async (req, res) => {
    try {
        const dispositivo = await Dispositivo.findById(req.params.id).populate('user');
        if (!dispositivo) return res.status(404).json({ message: 'Dispositivo no encontrado' });
        res.json(dispositivo);
    } catch (error) {
        return res.status(404).json({ message: "Dispositivo no encontrado" });
    }
};

// Eliminar un dispositivo (solo para clientes)
export const deleteDispositivo = async (req, res) => {
    try {
        if (req.user.role !== 'cliente') {
            return res.status(403).json({ message: "Acción no permitida. Solo para clientes." });
        }

        const dispositivo = await Dispositivo.findByIdAndDelete(req.params.id);
        if (!dispositivo) return res.status(404).json({ message: 'Dispositivo no encontrado' });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(401).json({ message: "Dispositivo no encontrado" });
    }
};

// Actualizar un dispositivo (solo para clientes)
export const updateDispositivo = async (req, res) => {
    try {
        if (req.user.role !== 'cliente') {
            return res.status(403).json({ message: "Acción no permitida. Solo para clientes." });
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

        const dispositivo = await Dispositivo.findByIdAndUpdate(id, updateData, { new: true })
            .populate('user');

        if (!dispositivo) {
            return res.status(404).json({ message: 'Dispositivo no encontrado' });
        }

        res.json(dispositivo);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
