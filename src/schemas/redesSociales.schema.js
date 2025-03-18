import { z } from 'zod';

// Esquema para la creación de una red social
export const createRedSocialSchema = z.object({
    plataforma: z.string({
        required_error: 'La plataforma es requerida',
        invalid_type_error: 'La plataforma debe ser una cadena de texto',
    })
    .trim()
    .min(1, 'La plataforma no puede estar vacía'),

    enlace: z.string({
        required_error: 'El enlace es requerido',
        invalid_type_error: 'El enlace debe ser una cadena de texto',
    })
    .trim()
    .min(1, 'El enlace no puede estar vacío')
    .url('El enlace debe ser una URL válida'), // Validación adicional para URLs
});