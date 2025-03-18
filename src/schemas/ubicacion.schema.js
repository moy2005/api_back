import { z } from 'zod';

// Esquema para la creación de una ubicación
export const createUbicacionSchema = z.object({
    nombre: z.string({
        required_error: 'El nombre es requerido',
        invalid_type_error: 'El nombre debe ser una cadena de texto',
    }).trim().min(1, 'El nombre no puede estar vacío'),

    direccion: z.string({
        required_error: 'La dirección es requerida',
        invalid_type_error: 'La dirección debe ser una cadena de texto',
    }).trim().min(1, 'La dirección no puede estar vacía'),

    ciudad: z.string({
        required_error: 'La ciudad es requerida',
        invalid_type_error: 'La ciudad debe ser una cadena de texto',
    }).trim().min(1, 'La ciudad no puede estar vacía'),

    pais: z.string({
        required_error: 'El país es requerido',
        invalid_type_error: 'El país debe ser una cadena de texto',
    }).trim().min(1, 'El país no puede estar vacío'),

    codigoPostal: z.string({
        required_error: 'El código postal es requerido',
        invalid_type_error: 'El código postal debe ser una cadena de texto',
    }).trim().min(1, 'El código postal no puede estar vacío'),
});