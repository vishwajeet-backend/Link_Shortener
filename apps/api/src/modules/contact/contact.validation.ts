import { z } from "zod";

export const contactSubmitSchema = {
  body: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email(),
    message: z.string().trim().min(10).max(8000)
  })
};
