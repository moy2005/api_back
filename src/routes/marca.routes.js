import { Router } from 'express';
import { 
    createMarca, 
    getMarcas, 
    getMarcaById, 
    updateMarca, 
    deleteMarca 
} from '../controllers/marca.controller.js';
import { authRequired } from '../middlewares/validateToken.js';  // Middleware para verificar autenticación


const router = Router();

router.post('/marcas', authRequired,createMarca); 
router.get('/marcas', getMarcas); 
router.get('/marcas/:id', getMarcaById); 
router.put('/marcas/:id',authRequired, updateMarca); 
router.delete('/marcas/:id',authRequired, deleteMarca); 

export default router;
