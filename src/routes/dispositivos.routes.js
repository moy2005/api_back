import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js'; // Middleware para verificar autenticación
import {
    getDispositivos,       
    getDispositivo,       
    createDispositivo,  
    updateDispositivo,    // Controlador para actualizar un dispositivo existente
    deleteDispositivo,
    getDispositivosByUserId  // Controlador para eliminar un dispositivo
} from '../controllers/dispositivos.controller.js';
import { validateSchema } from '../middlewares/validator.middlewar.js'; // Middleware para validar los datos según un esquema
import { createDispositivoSchema } from '../schemas/dispositivo.schema.js'; // Esquema de validación para la creación de dispositivos

const router = Router();

// Ruta para obtener todos los dispositivos (pública)
router.get('/dispositivos', getDispositivos);

// Ruta para obtener un dispositivo específico por su ID (pública)
router.get('/dispositivos/:id', getDispositivo);

// Ruta para crear un nuevo dispositivo (requiere autenticación y validación de esquema)
router.post('/dispositivos', authRequired, validateSchema(createDispositivoSchema), createDispositivo);

// Ruta para eliminar un dispositivo por su ID (requiere autenticación)
router.delete('/dispositivos/:id', authRequired, deleteDispositivo);

// Ruta para actualizar un dispositivo por su ID (requiere autenticación)
router.put('/dispositivos/:id', authRequired, updateDispositivo);

router.get('/usuarios/:userId/dispositivos', getDispositivosByUserId);

export default router;

