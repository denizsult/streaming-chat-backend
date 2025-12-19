import { z } from 'zod';

export const chatRequestSchema = z.object({
  message: z.string().min(1, 'Mesaj boş olamaz').max(1000, 'Mesaj çok uzun'),
  sessionId: z.string().uuid('Geçerli bir UUID gerekli')
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
