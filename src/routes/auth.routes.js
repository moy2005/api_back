import { Router } from 'express';
import { 
    login, 
    register, 
    logout, 
    profile, 
    verifyToken,
    verifyTokenReset, 
    forgot_password, 
    reset_password, 
    verifyKeyword, 
    verifyCode, 
    send_link,
    sendVerificationCode,   
    verifyEmailCode,getUsers,getUser,deleteUser,createUser,updateUser         
} from '../controllers/auth.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import { validateSchema } from '../middlewares/validator.middlewar.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';

const router = Router();

// Rutas de registro y verificación
router.post('/register', validateSchema(registerSchema), register);


router.post('/verify-email/:token', verifyToken);
router.post('/verifyCode', verifyCode);

// Nuevas rutas para el sistema de verificación por código
router.post('/send-verification-code', sendVerificationCode);  // Envía el código de verificación
router.post('/verify-email-code', verifyEmailCode);           // Verifica el código enviado

// Rutas de autenticación
router.post('/login', validateSchema(loginSchema), login);
router.put('/:id', authRequired, updateUser);
router.post('/logout', logout);
router.get('/verify', authRequired, verifyToken);

// Rutas de recuperación de contraseña
router.get('/verifyToken/:token', verifyTokenReset);


router.post('/forgot-password', forgot_password);
router.post('/verify-keyword', verifyKeyword);
router.post('/reset-password', reset_password);
router.post('/send-email', send_link);

// Ruta de perfil
router.get('/profile', authRequired, profile);

// Rutas para usuarios
router.get("/users",authRequired, getUsers); // Obtener todos los usuarios
router.get("/users/:id", getUser); // Obtener un usuario por ID
router.post("/users",authRequired, createUser); // Crear un nuevo usuario
router.put("/users/:id", authRequired, updateUser); // Actualizar un usuario
router.delete("/users/:id", authRequired, deleteUser); // Eliminar un usuario


export default router;

