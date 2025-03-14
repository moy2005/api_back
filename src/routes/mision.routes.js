import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js'; // Middleware para verificar autenticación
import {
    getMisiones,       // Controlador para obtener todas las misiones
    getMision,         // Controlador para obtener una misión específica
    createMision,      // Controlador para crear una nueva misión
    updateMision,      // Controlador para actualizar una misión existente
    deleteMision       // Controlador para eliminar una misión
} from '../controllers/mision.controller.js';
import { validateSchema } from '../middlewares/validator.middlewar.js'; // Middleware para validar los datos según un esquema
import { createMisionSchema } from '../schemas/mision.schema.js'; // Esquema de validación para la creación de misiones

const router = Router();

// Ruta para obtener todas las misiones (pública)
router.get('/misiones', getMisiones);

// Ruta para obtener una misión específica por su ID (pública)
router.get('/misiones/:id', getMision);

// Ruta para crear una nueva misión (requiere autenticación)
router.post('/misiones', authRequired, validateSchema(createMisionSchema), createMision);

// Ruta para eliminar una misión por su ID (requiere autenticación)
router.delete('/misiones/:id', authRequired, deleteMision);

// Ruta para actualizar una misión por su ID (requiere autenticación)
router.put('/misiones/:id', authRequired, updateMision);

export default router;

