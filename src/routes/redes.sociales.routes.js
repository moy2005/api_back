import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js'; // Middleware para verificar autenticación
import {
    getRedesSociales,       // Controlador para obtener todas las redes sociales
    getRedSocial,           // Controlador para obtener una red social específica
    createRedSocial,        // Controlador para crear una nueva red social
    updateRedSocial,        // Controlador para actualizar una red social existente
    deleteRedSocial         // Controlador para eliminar una red social
} from '../controllers/redes.sociales.controller.js';
import { validateSchema } from '../middlewares/validator.middlewar.js'; // Middleware para validar los datos según un esquema
import { createRedSocialSchema } from '../schemas/redesSociales.schema.js'; // Esquema de validación para la creación de redes sociales

const router = Router();

// Ruta para obtener todas las redes sociales (pública)
router.get('/redes-sociales', getRedesSociales);

// Ruta para obtener una red social específica por su ID (pública)
router.get('/redes-sociales/:id', getRedSocial);

// Ruta para crear una nueva red social (requiere autenticación)
router.post('/redes-sociales', authRequired, validateSchema(createRedSocialSchema), createRedSocial);

// Ruta para eliminar una red social por su ID (requiere autenticación)
router.delete('/redes-sociales/:id', authRequired, deleteRedSocial);

// Ruta para actualizar una red social por su ID (requiere autenticación)
router.put('/redes-sociales/:id', authRequired, updateRedSocial);

export default router;

