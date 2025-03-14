import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js'; // Middleware para verificar autenticación
import {
    getVisiones,       // Controlador para obtener todas las visiones
    getVision,         // Controlador para obtener una visión específica
    createVision,      // Controlador para crear una nueva visión
    updateVision,      // Controlador para actualizar una visión existente
    deleteVision       // Controlador para eliminar una visión
} from '../controllers/vision.controller.js';
import { validateSchema } from '../middlewares/validator.middlewar.js'; // Middleware para validar los datos según un esquema
import { createVisionSchema } from '../schemas/vision.schema.js'; // Esquema de validación para la creación de visiones

const router = Router();

// Ruta para obtener todas las visiones (pública)
router.get('/visiones', getVisiones);

// Ruta para obtener una visión específica por su ID (pública)
router.get('/visiones/:id', getVision);

// Ruta para crear una nueva visión (requiere autenticación)
router.post('/visiones', authRequired, validateSchema(createVisionSchema), createVision);

// Ruta para eliminar una visión por su ID (requiere autenticación)
router.delete('/visiones/:id', authRequired, deleteVision);

// Ruta para actualizar una visión por su ID (requiere autenticación)
router.put('/visiones/:id', authRequired, updateVision);

export default router;

