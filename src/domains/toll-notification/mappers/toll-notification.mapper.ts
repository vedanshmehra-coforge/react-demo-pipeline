import type { TollNotification } from '../types/toll-notification.types';

/** Normalise API response fields. All field transforms live here. */
export const tollNotificationMapper = {
  fromApi: (raw: TollNotification): TollNotification => ({
    ...raw,
    projectName:        raw.projectName?.trim()        ?? '',
    upc:                raw.upc?.trim()                ?? '',
    eOfficeFileNo:      raw.eOfficeFileNo?.trim()      ?? '',
    divEfileNum:        raw.divEfileNum?.trim()        ?? '',
    notificationSoNumber: raw.notificationSoNumber?.trim() ?? '',
    rejectionRemarks:   raw.rejectionRemarks?.trim()   ?? '',
    remarkMain:         raw.remarkMain?.trim()         ?? '',
    tollPlazas: (raw.tollPlazas ?? []).map((p) => ({
      ...p,
      nameOfTollPlaza:     p.nameOfTollPlaza?.trim()     ?? '',
      locationOfTollPlaza: p.locationOfTollPlaza?.trim() ?? '',
    })),
  }),
  fromApiList: (items: TollNotification[]): TollNotification[] =>
    items.map(tollNotificationMapper.fromApi),
};
