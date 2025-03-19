import { Router } from 'express';
import { 
    saveEstadoDispositivo, 
    getEstadosByMac, 
    getUltimoEstadoByMac,
    getEstadisticasByMac
} from '../controllers/estadosDispositivos.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = Router();

// Ruta para guardar el estado del dispositivo (no requiere autenticación para permitir al ESP32 enviar datos)
router.post('/estado-dispositivo', saveEstadoDispositivo);

// Rutas para consultar estados (requieren autenticación)
router.get('/estado-dispositivo/:macAddress', authRequired, getEstadosByMac);
router.get('/estado-dispositivo/:macAddress/ultimo', authRequired, getUltimoEstadoByMac);
router.get('/estado-dispositivo/:macAddress/estadisticas', authRequired, getEstadisticasByMac);

export default router;

