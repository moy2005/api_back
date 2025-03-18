import FAQ from '../models/preguntas.fre.model.js';
import mongoose from 'mongoose';

// Obtener todas las FAQs activas
export const getFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find();
        res.json(faqs);
    } catch (error) {
        return res.status(500).json({ message: "Hubo un fallo al obtener las FAQs" });
    }
};

// Crear una nueva FAQ
export const createFAQ = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const { pregunta, respuesta } = req.body;

        const newFAQ = new FAQ({
            pregunta,
            respuesta,
            estado: true, // La FAQ se crea activa por defecto
        });

        const savedFAQ = await newFAQ.save();
        res.status(201).json(savedFAQ);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Hubo un fallo al crear la FAQ" });
    }
};

// Obtener una FAQ por ID
export const getFAQ = async (req, res) => {
    try {
        const faq = await FAQ.findById(req.params.id);
        if (!faq) return res.status(404).json({ message: 'FAQ no encontrada' });
        res.json(faq);
    } catch (error) {
        return res.status(404).json({ message: "FAQ no encontrada" });
    }
};

// Eliminar una FAQ
export const deleteFAQ = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const faq = await FAQ.findByIdAndDelete(req.params.id);
        if (!faq) return res.status(404).json({ message: 'FAQ no encontrada' });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(401).json({ message: "FAQ no encontrada" });
    }
};

// Actualizar una FAQ (incluyendo el estado)
export const updateFAQ = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const { id } = req.params;
        const { pregunta, respuesta, estado } = req.body;

        const updateData = { pregunta, respuesta, estado };

        const faq = await FAQ.findByIdAndUpdate(id, updateData, { new: true });

        if (!faq) {
            return res.status(404).json({ message: 'FAQ no encontrada' });
        }

        res.json(faq);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Cambiar el estado de una FAQ (activar o desactivar)
export const updateEstadoFAQ = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const { id } = req.params;
        const { estado } = req.body; // true o false

        const faq = await FAQ.findByIdAndUpdate(id, { estado }, { new: true });

        if (!faq) {
            return res.status(404).json({ message: "FAQ no encontrada" });
        }

        res.json({ message: `Estado actualizado a ${estado ? 'activo' : 'inactivo'}`, faq });
    } catch (error) {
        return res.status(500).json({ message: "Hubo un fallo al actualizar el estado" });
    }
};

