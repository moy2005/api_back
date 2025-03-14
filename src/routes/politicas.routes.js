import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js'; // Middleware para verificar autenticación
import {
    getPoliticas,       // Controlador para obtener todas las políticas
    getPolitica,         // Controlador para obtener una política específica
    createPolitica,      // Controlador para crear una nueva política
    updatePolitica,      // Controlador para actualizar una política existente
    deletePolitica       // Controlador para eliminar una política
} from '../controllers/politica.controller.js';
import { validateSchema } from '../middlewares/validator.middlewar.js'; // Middleware para validar los datos según un esquema
import { createPoliticaSchema } from '../schemas/politica.schema.js'; // Esquema de validación para la creación de políticas

const router = Router();

// Ruta para obtener todas las políticas (pública)
router.get('/politicas', getPoliticas);

// Ruta para obtener una política específica por su ID (pública)
router.get('/politicas/:id', getPolitica);

// Ruta para crear una nueva política (requiere autenticación)
router.post('/politicas', authRequired, validateSchema(createPoliticaSchema), createPolitica);

// Ruta para eliminar una política por su ID (requiere autenticación)
router.delete('/politicas/:id', authRequired, deletePolitica);

// Ruta para actualizar una política por su ID (requiere autenticación)
router.put('/politicas/:id', authRequired, updatePolitica);

export default router;

