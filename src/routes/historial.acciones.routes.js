import { Router } from 'express';
import { 
    saveAccion, 
    getHistorialByMac, 
    getHistorialByTipo,
    getResumenAcciones,
    getHistorialByMacWithFilter
} from '../controllers/historial.acciones.controller.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = Router();

// Ruta para guardar una acción en el historial
router.post('/historial-acciones', saveAccion);

// Rutas para consultar el historial (requieren autenticación)
router.get('/historial-acciones/:macAddress', authRequired, getHistorialByMac);
router.get('/historial-acciones/:macAddress/:accion', authRequired, getHistorialByTipo);
router.get('/historial-acciones/:macAddress/resumen/diario', authRequired, getResumenAcciones);
router.get('/historial/:macAddress', authRequired, getHistorialByMacWithFilter);

export default router;

