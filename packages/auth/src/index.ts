import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability';
import { z } from 'zod';
import { User } from './models/user';
import { permissions } from './permissions';
import { billingSubject } from './subjects/billing';
import { inviteSubject } from './subjects/invite';
import { organizationSubject } from './subjects/organization';
import { projectSubject } from './subjects/project';
import { userSubject } from './subjects/user';

export * from './models/organization';
export * from './models/project';
export * from './models/user';
export * from './roles';

const AppAbilitiesSchema = z.union([
  userSubject,
  projectSubject,
  organizationSubject,
  inviteSubject,
  billingSubject,

  z.tuple([z.literal('manage'), z.literal('all')]),
]);

type AppAbilities = z.infer<typeof AppAbilitiesSchema>;

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility);

  user.role.forEach(role => {
    if (typeof permissions[role] === 'function') {
      permissions[role](user, builder);
    }
  });

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename;
    },
  });

  ability.can = ability.can.bind(ability)
  ability.cannot = ability.cannot.bind(ability)

  return ability;
}