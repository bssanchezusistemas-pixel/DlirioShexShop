import { z } from "zod";

const sizeSchema = z.object({
  label: z.string().min(1, "La talla debe tener etiqueta"),
  price: z.number().int().min(0, "El precio de talla debe ser >= 0"),
  image: z.string().optional(),
});

export const productInputSchema = z
  .object({
    id: z.string().optional(),
    category_id: z.string().min(1, "Categoría requerida"),
    name: z.string().min(1, "Nombre requerido"),
    description: z.string().optional(),
    price: z.number().int().min(0).nullable().optional(),
    stock: z.number().int().min(0).optional(),
    image_url: z.string().nullable().optional(),
    badge: z.string().nullable().optional(),
    consult_only: z.boolean().optional(),
    sizes: z.array(sizeSchema).optional(),
    is_active: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.consult_only && data.price === undefined && !(data.sizes?.length)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Precio requerido si no es solo consulta",
        path: ["price"],
      });
    }
    if (data.price !== undefined && data.price !== null && data.price < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El precio debe ser >= 0",
        path: ["price"],
      });
    }
  });

export const productPatchSchema = z
  .object({
    name: z.string().min(1).optional(),
    category_id: z.string().min(1).optional(),
    description: z.string().optional(),
    price: z.number().int().min(0).nullable().optional(),
    stock: z.number().int().min(0).optional(),
    image_url: z.string().nullable().optional(),
    badge: z.string().nullable().optional(),
    consult_only: z.boolean().optional(),
    sizes: z.array(sizeSchema).optional(),
    is_active: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "No hay campos para actualizar",
  });

export function formatZodError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Datos inválidos";
}
