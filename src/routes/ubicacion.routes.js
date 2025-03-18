import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js'; // Middleware para verificar autenticación
import {
    getUbicaciones,       // Controlador para obtener todas las ubicaciones
    getUbicacion,         // Controlador para obtener una ubicación específica
    createUbicacion,      // Controlador para crear una nueva ubicación
    updateUbicacion,      // Controlador para actualizar una ubicación existente
    deleteUbicacion       // Controlador para eliminar una ubicación
} from '../controllers/ubicacion.controller.js';
import { validateSchema } from '../middlewares/validator.middlewar.js'; // Middleware para validar los datos según un esquema
import { createUbicacionSchema } from '../schemas/ubicacion.schema.js'; // Esquema de validación para la creación de ubicaciones

const router = Router();

// Ruta para obtener todas las ubicaciones (pública)
router.get('/ubicaciones', getUbicaciones);

// Ruta para obtener una ubicación específica por su ID (pública)
router.get('/ubicaciones/:id', getUbicacion);

// Ruta para crear una nueva ubicación (requiere autenticación)
router.post('/ubicaciones', authRequired, validateSchema(createUbicacionSchema), createUbicacion);

// Ruta para eliminar una ubicación por su ID (requiere autenticación)
router.delete('/ubicaciones/:id', authRequired, deleteUbicacion);

// Ruta para actualizar una ubicación por su ID (requiere autenticación)
router.put('/ubicaciones/:id', authRequired, updateUbicacion);

export default router;

