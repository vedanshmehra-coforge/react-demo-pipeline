import { describe, it, expect } from 'vitest';
import { tollNotificationService } from './toll-notification.service';
import type { TollNotification } from '../types/toll-notification.types';
import type { User } from '@shared/types/auth.types';

const makeNotification = (overrides: Partial<TollNotification> = {}): TollNotification => ({
  id: 'tn-test-001',
  tollNotificationId: 'tn-test-001',
  upc: 'N/01001/05003/GJ',
  projectName: 'Test Project',
  piuName: 'Test PIU',
  roName: 'RO-Test',
  tollMode: 'New Toll Plaza',
  plazaType: 'Public Funded',
  tollingNotApplicable: false,
  tollingNotApplicableRemarks: '',
  appointedDate: '01/01/2023',
  likelyCompletionDate: '',
  physicalProgress: '95',
  documentName: '',
  publishedTollNotification: '',
  eOfficeFileNo: '123456',
  piuFileStatus: '',
  divEfileNum: '',
  coFileStatus: '',
  eOfficeSubject: '',
  notificationSoNumber: '',
  status: 'SUBMITTED',
  statusCode: '6667',
  statusLabel: 'Submitted By PIU',
  rejectionRemarks: '',
  remarkMain: '',
  tollPlazas: [],
  lengthDetails: {
    netRoadLength2L: '', netRoadLength4L: '',
    netBypassLength2L: '', netBypassLength4L: '',
    netStructureLength2L: '', netStructureLength4L: '',
    projectLength: '', projectInfluenceLength: '',
  },
  upcFlag: '0',
  isPlazaNameEditedOnce: false,
  createdAt: '2025-05-01T08:00:00Z',
  updatedAt: '2025-05-01T09:00:00Z',
  ...overrides,
});

const makeAdmin = (): User => ({
  id: 'u-admin', username: 'admin', email: 'admin@nhai.gov.in', fullName: 'Admin User',
  role: 'ADMIN', department: 'Toll Ops', designation: 'Officer',
  isActive: true, lastLoginAt: null,
  createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z',
});

const makePiu = (): User => ({ ...makeAdmin(), id: 'u-piu', role: 'FIELD_ENGINEER' });

describe('tollNotificationService', () => {

  describe('canPiuEdit', () => {
    it('true for DRAFT',    () => expect(tollNotificationService.canPiuEdit(makeNotification({ status: 'DRAFT' }))).toBe(true));
    it('true for REJECTED', () => expect(tollNotificationService.canPiuEdit(makeNotification({ status: 'REJECTED' }))).toBe(true));
    it('false for SUBMITTED', () => expect(tollNotificationService.canPiuEdit(makeNotification({ status: 'SUBMITTED' }))).toBe(false));
    it('false for PUBLISHED', () => expect(tollNotificationService.canPiuEdit(makeNotification({ status: 'PUBLISHED' }))).toBe(false));
  });

  describe('canPiuSubmit', () => {
    it('true for DRAFT',    () => expect(tollNotificationService.canPiuSubmit(makeNotification({ status: 'DRAFT' }))).toBe(true));
    it('true for REJECTED', () => expect(tollNotificationService.canPiuSubmit(makeNotification({ status: 'REJECTED' }))).toBe(true));
    it('false for SUBMITTED', () => expect(tollNotificationService.canPiuSubmit(makeNotification({ status: 'SUBMITTED' }))).toBe(false));
  });

  describe('canPiuDelete', () => {
    it('true only for DRAFT', () => {
      expect(tollNotificationService.canPiuDelete(makeNotification({ status: 'DRAFT' }))).toBe(true);
      expect(tollNotificationService.canPiuDelete(makeNotification({ status: 'SUBMITTED' }))).toBe(false);
    });
  });

  describe('canCoUpdateEOffice', () => {
    it('true only when SUBMITTED', () => {
      expect(tollNotificationService.canCoUpdateEOffice(makeNotification({ status: 'SUBMITTED' }))).toBe(true);
      expect(tollNotificationService.canCoUpdateEOffice(makeNotification({ status: 'DRAFT' }))).toBe(false);
      expect(tollNotificationService.canCoUpdateEOffice(makeNotification({ status: 'CO_REVIEWED' }))).toBe(false);
    });
  });

  describe('canCoUpdateSoNumber', () => {
    it('true only when CO_REVIEWED', () => {
      expect(tollNotificationService.canCoUpdateSoNumber(makeNotification({ status: 'CO_REVIEWED' }))).toBe(true);
      expect(tollNotificationService.canCoUpdateSoNumber(makeNotification({ status: 'SUBMITTED' }))).toBe(false);
    });
  });

  describe('canCoPublish', () => {
    it('true only when SO_ISSUED', () => {
      expect(tollNotificationService.canCoPublish(makeNotification({ status: 'SO_ISSUED' }))).toBe(true);
      expect(tollNotificationService.canCoPublish(makeNotification({ status: 'CO_REVIEWED' }))).toBe(false);
    });
  });

  describe('canCoReject', () => {
    it('true for SUBMITTED and CO_REVIEWED', () => {
      expect(tollNotificationService.canCoReject(makeNotification({ status: 'SUBMITTED' }))).toBe(true);
      expect(tollNotificationService.canCoReject(makeNotification({ status: 'CO_REVIEWED' }))).toBe(true);
      expect(tollNotificationService.canCoReject(makeNotification({ status: 'DRAFT' }))).toBe(false);
    });
  });

  describe('isCo / isPiu', () => {
    it('admin is CO',         () => expect(tollNotificationService.isCo(makeAdmin())).toBe(true));
    it('field engineer is PIU', () => expect(tollNotificationService.isPiu(makePiu())).toBe(true));
    it('admin is not PIU',    () => expect(tollNotificationService.isPiu(makeAdmin())).toBe(false));
  });

  describe('getWorkflowStep', () => {
    it('steps', () => {
      expect(tollNotificationService.getWorkflowStep('DRAFT')).toBe(1);
      expect(tollNotificationService.getWorkflowStep('SUBMITTED')).toBe(2);
      expect(tollNotificationService.getWorkflowStep('CO_REVIEWED')).toBe(3);
      expect(tollNotificationService.getWorkflowStep('SO_ISSUED')).toBe(4);
      expect(tollNotificationService.getWorkflowStep('PUBLISHED')).toBe(5);
      expect(tollNotificationService.getWorkflowStep('REJECTED')).toBe(0);
    });
  });

  describe('getNextActionLabel', () => {
    it('CO sees Update E-Office when SUBMITTED', () =>
      expect(tollNotificationService.getNextActionLabel(makeNotification({ status: 'SUBMITTED' }), makeAdmin())).toBe('Update E-Office File Number'));
    it('CO sees Update S.O. when CO_REVIEWED', () =>
      expect(tollNotificationService.getNextActionLabel(makeNotification({ status: 'CO_REVIEWED' }), makeAdmin())).toBe('Update Notification S.O. Number'));
    it('CO sees Publish when SO_ISSUED', () =>
      expect(tollNotificationService.getNextActionLabel(makeNotification({ status: 'SO_ISSUED' }), makeAdmin())).toBe('Publish Notification'));
    it('PIU sees Submit when DRAFT', () =>
      expect(tollNotificationService.getNextActionLabel(makeNotification({ status: 'DRAFT' }), makePiu())).toBe('Submit to CO-Division'));
  });
});
