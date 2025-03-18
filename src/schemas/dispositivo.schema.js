import { z } from 'zod';

// Esquema de validación para la creación de dispositivos
export const createDispositivoSchema = z.object({
    macAddress: z
        .string()
        .min(1, "El MAC Address es requerido"),
    name: z
        .string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(50, "El nombre no puede tener más de 50 caracteres")
        .trim(),
});

// Esquema de validación para la actualización de dispositivos
export const updateDispositivoSchema = z.object({
    macAddress: z
        .string()
,
    name: z
        .string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(50, "El nombre no puede tener más de 50 caracteres")
        .trim()
        .optional(), // El campo "name" es opcional en la actualización
});

