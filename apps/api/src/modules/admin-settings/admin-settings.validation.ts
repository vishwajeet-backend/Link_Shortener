import { z } from "zod";

const smtpSchema = z
  .object({
    host: z.string().trim().min(1).optional(),
    port: z.coerce.number().int().positive().optional(),
    secure: z.coerce.boolean().optional(),
    user: z.string().trim().min(1).optional(),
    pass: z.string().trim().min(1).optional(),
    fromEmail: z.string().trim().email().optional(),
    fromName: z.string().trim().min(1).optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one SMTP field must be provided"
  });

export const updateAdminSettingsSchema = {
  body: z
    .object({
      maintenanceMode: z.coerce.boolean().optional(),
      maintenanceMessage: z.string().trim().max(500).optional(),
      allowedDomains: z.array(z.string().trim().min(1).max(255)).max(200).optional(),
      smtp: smtpSchema.optional()
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided"
    })
};
