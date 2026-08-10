import { http, HttpResponse } from 'msw';
import type { TollNotification } from '@domains/toll-notification/types/toll-notification.types';

const mockNotification = (overrides: Partial<TollNotification> = {}): TollNotification => ({
  id: 'tn-1', tollNotificationId: 'tn-1',
  upc: 'N/01001/05003/GJ', projectName: 'Test Project',
  piuName: 'Vadodara', roName: 'RO-Gandhinagar',
  tollMode: 'New Toll Plaza', plazaType: 'Public Funded',
  tollingNotApplicable: false, tollingNotApplicableRemarks: '',
  appointedDate: '14/02/2022', likelyCompletionDate: '', physicalProgress: '98.05',
  documentName: 'test.pdf', publishedTollNotification: '',
  eOfficeFileNo: '275714', piuFileStatus: '', divEfileNum: '', coFileStatus: '',
  eOfficeSubject: '', notificationSoNumber: '',
  status: 'SUBMITTED', statusCode: '6667', statusLabel: 'Submitted By PIU',
  rejectionRemarks: '', remarkMain: '',
  tollPlazas: [{ id: 'p1', nameOfTollPlaza: 'Chopat Palli', locationOfTollPlaza: 'Lat 22.8',
    noOfTollLane: '14L', tempTollPlazaId: 'N0100105003GJ_T_00001', permanentTollPlazaId: '',
    tollPlazaCfy: '4187', trafficSurveyDate: '18/06/2026', tollPlazaApc: '15.18' }],
  lengthDetails: { netRoadLength2L: '', netRoadLength4L: '', netBypassLength2L: '',
    netBypassLength4L: '', netStructureLength2L: '', netStructureLength4L: '',
    projectLength: '', projectInfluenceLength: '' },
  upcFlag: '0', isPlazaNameEditedOnce: false,
  createdAt: '2025-05-01T08:00:00Z', updatedAt: '2025-05-01T09:00:00Z',
  ...overrides,
});

export const tollNotificationHandlers = [
  http.get('/api/toll-notifications',     () => HttpResponse.json({ success: true, data: [mockNotification()], pagination: { page: 1, pageSize: 10, total: 1, totalPages: 1, hasNext: false, hasPrev: false } })),
  http.get('/api/toll-notifications/:id', ({ params }) => HttpResponse.json({ success: true, data: mockNotification({ id: params.id as string }) })),
  http.post('/api/toll-notifications',    async ({ request }) => { const body = await request.json() as Partial<TollNotification>; return HttpResponse.json({ success: true, data: mockNotification({ ...body, id: 'tn-new' }) }, { status: 201 }); }),
  http.post('/api/toll-notifications/:id/submit',         ({ params }) => HttpResponse.json({ success: true, data: mockNotification({ id: params.id as string, status: 'SUBMITTED', statusCode: '6667' }) })),
  http.post('/api/toll-notifications/:id/update-eoffice', ({ params }) => HttpResponse.json({ success: true, data: mockNotification({ id: params.id as string, status: 'CO_REVIEWED', statusCode: '66691' }) })),
  http.post('/api/toll-notifications/:id/update-so',      ({ params }) => HttpResponse.json({ success: true, data: mockNotification({ id: params.id as string, status: 'SO_ISSUED',   statusCode: '6668', notificationSoNumber: 'S.O. 1234(E)' }) })),
  http.post('/api/toll-notifications/:id/publish',        ({ params }) => HttpResponse.json({ success: true, data: mockNotification({ id: params.id as string, status: 'PUBLISHED',   statusCode: '6669' }) })),
  http.post('/api/toll-notifications/:id/reject',         ({ params }) => HttpResponse.json({ success: true, data: mockNotification({ id: params.id as string, status: 'REJECTED',    statusCode: '6670' }) })),
];
