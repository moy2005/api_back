import { z } from 'zod';

export const createUbicacionSchema = z.object({
  nombre: z.string({
    required_error: "El nombre es requerido",
    invalid_type_error: "El nombre debe ser un texto",
  }).min(1).max(100),
  latitud: z.number({
    required_error: "La latitud es requerida",
    invalid_type_error: "La latitud debe ser un número",
  }),
  longitud: z.number({
    required_error: "La longitud es requerida",
    invalid_type_error: "La longitud debe ser un número",
  }),
});

