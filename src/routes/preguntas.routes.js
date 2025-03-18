import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js'; // Middleware para verificar autenticación
import {
    getFAQs,          // Controlador para obtener todas las FAQs
    getFAQ,           // Controlador para obtener una FAQ específica
    createFAQ,        // Controlador para crear una nueva FAQ
    updateFAQ,        // Controlador para actualizar una FAQ existente
    deleteFAQ,        // Controlador para eliminar una FAQ
} from '../controllers/preguntas.controller.js';
import { validateSchema } from '../middlewares/validator.middlewar.js'; // Middleware para validar los datos según un esquema
import { createFAQSchema, updateFAQSchema } from '../schemas/preguntas.schema.js'; // Esquemas de validación para FAQs

const router = Router();

// Ruta para obtener todas las FAQs (pública)
router.get('/faqs', getFAQs);

// Ruta para obtener una FAQ específica por su ID (pública)
router.get('/faqs/:id', getFAQ);

// Ruta para crear una nueva FAQ (requiere autenticación y validación de esquema)
router.post('/faqs', authRequired, validateSchema(createFAQSchema), createFAQ);

// Ruta para eliminar una FAQ por su ID (requiere autenticación)
router.delete('/faqs/:id', authRequired, deleteFAQ);

// Ruta para actualizar una FAQ por su ID (requiere autenticación y validación de esquema)
router.put('/faqs/:id', authRequired, validateSchema(updateFAQSchema), updateFAQ);

export default router;

