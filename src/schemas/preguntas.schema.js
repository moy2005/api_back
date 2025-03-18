import { z } from 'zod';

// Esquema para la creación de una FAQ
export const createFAQSchema = z.object({
    pregunta: z.string({
        required_error: 'La pregunta es obligatoria',
        invalid_type_error: 'La pregunta debe ser un texto',
    }).min(1, {
        message: 'La pregunta no puede estar vacía',
    }),
    respuesta: z.string({
        required_error: 'La respuesta es obligatoria',
        invalid_type_error: 'La respuesta debe ser un texto',
    }).min(1, {
        message: 'La respuesta no puede estar vacía',
    }),
});

// Esquema para la actualización de una FAQ
export const updateFAQSchema = z.object({
    pregunta: z.string({
        invalid_type_error: 'La pregunta debe ser un texto',
    }).min(1, {
        message: 'La pregunta no puede estar vacía',
    }).optional(),
    respuesta: z.string({
        invalid_type_error: 'La respuesta debe ser un texto',
    }).min(1, {
        message: 'La respuesta no puede estar vacía',
    }).optional(),
    estado: z.boolean({
        invalid_type_error: 'El estado debe ser un valor booleano (true o false)',
    }).optional(),
});