import { z } from "zod";

export const mudancaSchema = z.object({
  enderecoOrigem: z.string().min(5, "Endereço de origem obrigatório"),
  enderecoDestino: z.string().min(5, "Endereço de destino obrigatório"),
  dataDesejada: z.string().optional(),
});

export const itemSchema = z.object({
  nome: z.string().min(1),
  categoria: z.string().min(1),
  larguraCm: z.number().positive(),
  alturaCm: z.number().positive(),
  profundidadeCm: z.number().positive(),
  pesoKg: z.number().positive(),
  volumeM3: z.number().positive(),
  iconeUrl: z.string().default("📦"),
});

export type MudancaInput = z.infer<typeof mudancaSchema>;
export type ItemInput = z.infer<typeof itemSchema>;
