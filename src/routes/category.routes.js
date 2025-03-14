import { Router } from 'express';
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from '../controllers/category.controller.js';
import { authRequired } from '../middlewares/validateToken.js';  // Middleware para verificar autenticación

const router = Router();

// Crear categoría
router.post('/categories',authRequired, createCategory);

// Obtener todas las categorías
router.get('/categories', getCategories);

// Obtener categoría por ID
router.get('/categories/:id', getCategoryById);

// Actualizar categoría por ID
router.put('/categories/:id',authRequired, updateCategory);

// Eliminar categoría por ID
router.delete('/categories/:id',authRequired, deleteCategory);

export default router;
