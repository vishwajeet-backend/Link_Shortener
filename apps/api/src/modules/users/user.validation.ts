import { z } from "zod";

export const updateProfileSchema = {
  body: z
    .object({
      name: z.string().trim().min(2).max(100).optional(),
      avatarUrl: z.string().trim().url().max(2048).optional(),
      email: z.string().trim().email().max(200).optional(),
      currentPassword: z.string().min(8).max(128).optional()
    })
    .superRefine((data, ctx) => {
      const hasProfileField =
        data.name !== undefined || data.avatarUrl !== undefined || data.email !== undefined;
      if (!hasProfileField) {
        ctx.addIssue({
          code: "custom",
          message: "At least one field must be provided",
          path: ["name"]
        });
      }
      if (data.email !== undefined && !data.currentPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Current password is required to change email",
          path: ["currentPassword"]
        });
      }
    })
};

export const updatePasswordSchema = {
  body: z.object({
    currentPassword: z.string().min(8).max(128),
    newPassword: z.string().min(8).max(128)
  })
};
