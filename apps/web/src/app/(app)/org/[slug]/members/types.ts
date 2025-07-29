import { roleSchema } from "@saas/auth";
import { z } from "zod";

export const inviteSchema = z.object({
  email: z.string().email({ message: "Invalid e-mail address."}),
  role: roleSchema,
});

export const createInviteFormSchema = inviteSchema;

export type InviteType = z.infer<typeof inviteSchema>;
export type createInviteActionType = z.infer<typeof createInviteFormSchema>;
