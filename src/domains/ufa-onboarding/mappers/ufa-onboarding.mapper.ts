import type { UfaOnboarding } from '../types/ufa-onboarding.types';

export const ufaOnboardingMapper = {
  fromApi: (raw: UfaOnboarding): UfaOnboarding => ({
    ...raw,
    title: raw.title?.trim() ?? '',
    description: raw.description ?? null,
    remarks: raw.remarks ?? null,
  }),
  fromApiList: (items: UfaOnboarding[]): UfaOnboarding[] =>
    items.map(ufaOnboardingMapper.fromApi),
};
