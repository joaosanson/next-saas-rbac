import { defineAbilityFor, Role, userSchema } from '@saas/auth';

export function getUserPermissions(userId: string, role: Role[]) {
  console.log('getUserPermissions', userId, role);
  const authUser = userSchema.parse({
    id: userId,
    role: role,
  });

  const ability = defineAbilityFor(authUser);

  return ability;
}
