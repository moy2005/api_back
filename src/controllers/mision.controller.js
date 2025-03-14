import Mision from '../models/mision.model.js';
import mongoose from 'mongoose';

// Obtener todas las misiones
export const getMisiones = async (req, res) => {
    try {
        const misiones = await Mision.find({}).populate('user', 'name email');
        res.json(misiones);
    } catch (error) {
        return res.status(500).json({ message: "Hubo un fallo al obtener las misiones" });
    }
};

// Crear una misión
export const createMision = async (req, res) => {
    try {
      // Verificar si el usuario es administrador
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
      }
  
      // Obtener el ID del usuario desde el token
      const userId = req.user.id;
  
      const { title, description } = req.body;
  
      // Validar si el usuario existe
      const existingUser = await mongoose.model('User').findById(userId);
      if (!existingUser) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      // Crear la misión
      const newMision = new Mision({
        title,
        description,
        user: existingUser._id, // Asociar la misión al usuario autenticado
      });
  
      const savedMision = await newMision.save();
      res.status(201).json(savedMision);
    } catch (error) {
      console.log(error);
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

// Actualizar una misión
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

