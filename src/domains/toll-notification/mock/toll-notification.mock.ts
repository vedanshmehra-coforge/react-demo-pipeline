import type { TollNotification, TollPlazaRow } from '../types/toll-notification.types';

// ─── Map API status_code → internal status ───────────────────────────────────
function mapStatus(statusCode: string): TollNotification['status'] {
  switch (statusCode) {
    case '6666':  return 'DRAFT';
    case '6667':  return 'SUBMITTED';
    case '66691': return 'CO_REVIEWED';
    case '6668':  return 'SO_ISSUED';
    case '6669':  return 'PUBLISHED';
    case '6670':  return 'REJECTED';
    default:      return 'SUBMITTED';
  }
}

// ─── Flatten API records: group plazas by tollnotificationid ─────────────────
interface ApiRecord {
  id: string;
  tollnotificationid: string;
  project_name: string;
  upc: string;
  piu_name: string;
  ro_name: string;
  documentname: string;
  Published_toll_notification: string;
  status: string;
  status_Code: string;
  physical_progress: string;
  nameoftoll_plaza: string;
  locationoftoll_plaza: string;
  nooftoll_lane: string;
  temp_toll_plaza_id: string;
  toll_plaza_cfy: string;
  traffic_surveydate: string;
  toll_plaza_apc: string;
  permanent_toll_plaza_id: string;
  notification_so_number: string;
  appointed_dated: string;
  RemarkMain: string;
  e_office_fileno: string;
  div_efile_num: string;
  upc_flag: string;
  status_code: string;
  rejection_remarks: string;
  is_plaza_name_edited_once: string;
}

const RAW_API: ApiRecord[] = [
  {
    id: '464', tollnotificationid: '405',
    project_name: 'Delhi-Vadodara Greenfield Alignment (NH-148N) (Pkg-27) (Ch.729.700 to Ch.756.052)',
    upc: 'N/01001/05003/GJ', piu_name: 'Vadodara', ro_name: 'RO-Gandhinagar',
    documentname: '4062dt.04092025DahodVadodarasectionofNE4253288English639174953668473495639215385658430374.pdf',
    Published_toll_notification: '', status: 'Submitted By PIU', status_Code: '6667',
    physical_progress: '98.05', nameoftoll_plaza: 'Chopat Palli',
    locationoftoll_plaza: 'Latitude -22.857388 Longitude -74001558', nooftoll_lane: '14L',
    temp_toll_plaza_id: 'N0100105003GJ_T_00001', toll_plaza_cfy: '4187',
    traffic_surveydate: '18/06/2026', toll_plaza_apc: '15.18', permanent_toll_plaza_id: '',
    notification_so_number: '', appointed_dated: '14/02/2022', RemarkMain: '',
    e_office_fileno: '275714', div_efile_num: '', upc_flag: '0', status_code: '6667',
    rejection_remarks: '', is_plaza_name_edited_once: 'False',
  },
  {
    id: '463', tollnotificationid: '404',
    project_name: 'Melur - Pilayarpatti - Karaikudi from km 99.920 of NH 38 to km 12.9 of NH 383 Ext.',
    upc: 'N/05020/01002/TN', piu_name: 'Madurai', ro_name: 'RO-Madurai',
    documentname: 'S.O.3571ETollNotificationBrahmanapattiTollPlaza.pdf',
    Published_toll_notification: '', status: 'E-Office/Computer No. Is Updated By CO Division',
    status_Code: '66691', physical_progress: '98.12', nameoftoll_plaza: 'Brahmanapatti',
    locationoftoll_plaza: '22+000', nooftoll_lane: '8L',
    temp_toll_plaza_id: 'N0502001002TN_T_00001', toll_plaza_cfy: '3628',
    traffic_surveydate: '21/03/2026', toll_plaza_apc: '11.9', permanent_toll_plaza_id: '',
    notification_so_number: '', appointed_dated: '16/03/2020', RemarkMain: '',
    e_office_fileno: '252139', div_efile_num: '316221', upc_flag: '0', status_code: '66691',
    rejection_remarks: '', is_plaza_name_edited_once: 'False',
  },
  {
    id: '462', tollnotificationid: '403',
    project_name: '4L PS of Ambala Ring Road of New NH-44',
    upc: 'N/02007/06005/HR', piu_name: 'Ambala', ro_name: 'RO-Chandigarh (HR)',
    documentname: '', Published_toll_notification: '', status: 'Submitted By PIU',
    status_Code: '6667', physical_progress: '88.77', nameoftoll_plaza: 'Dukheri',
    locationoftoll_plaza: 'At Km.26.300 near Dukheri Village of Ambala District in Haryana State',
    nooftoll_lane: '12L', temp_toll_plaza_id: 'N0200706005HR_T_00001', toll_plaza_cfy: '',
    traffic_surveydate: '', toll_plaza_apc: '', permanent_toll_plaza_id: '',
    notification_so_number: '', appointed_dated: '11/10/2023',
    RemarkMain: 'Ambala Ring Road is a greenfield project and yet to be opened for traffic. No traffic survey conducted till date.',
    e_office_fileno: '225262', div_efile_num: '', upc_flag: '0', status_code: '6667',
    rejection_remarks: '', is_plaza_name_edited_once: 'False',
  },
  {
    id: '461', tollnotificationid: '402',
    project_name: '6L of Ambala-Chandigarh greenfield section from Km. 0.000 to Km. 25.000 with 4L spur to Lalru from Km. 0.000 to Km. 5.828 & spur to PR-7 road from Km. 0.000 to Km. 11.157',
    upc: 'N/06038/01002/PB', piu_name: 'Chandigarh', ro_name: 'RO-Chandigarh (HR)',
    documentname: '773.RegardingSubmissionofUserfeetollnotificationChecklist...1.pdf',
    Published_toll_notification: '', status: 'Submitted By PIU', status_Code: '6667',
    physical_progress: '', nameoftoll_plaza: 'Mamoli', locationoftoll_plaza: '14+000',
    nooftoll_lane: '12L', temp_toll_plaza_id: 'N0603801002PB_T_00002', toll_plaza_cfy: '21560',
    traffic_surveydate: '01/02/2026', toll_plaza_apc: '68.50', permanent_toll_plaza_id: '',
    notification_so_number: '', appointed_dated: '12/10/2023', RemarkMain: '',
    e_office_fileno: '289773', div_efile_num: '', upc_flag: '0', status_code: '6667',
    rejection_remarks: '', is_plaza_name_edited_once: 'False',
  },
  {
    id: '460', tollnotificationid: '402',
    project_name: '6L of Ambala-Chandigarh greenfield section from Km. 0.000 to Km. 25.000 with 4L spur to Lalru from Km. 0.000 to Km. 5.828 & spur to PR-7 road from Km. 0.000 to Km. 11.157',
    upc: 'N/06038/01002/PB', piu_name: 'Chandigarh', ro_name: 'RO-Chandigarh (HR)',
    documentname: '773.RegardingSubmissionofUserfeetollnotificationChecklist...1.pdf',
    Published_toll_notification: '', status: 'Submitted By PIU', status_Code: '6667',
    physical_progress: '', nameoftoll_plaza: 'Manoli Surat', locationoftoll_plaza: '12+900',
    nooftoll_lane: '4L', temp_toll_plaza_id: 'N0603801002PB_T_00001', toll_plaza_cfy: '2165',
    traffic_surveydate: '01/02/2026', toll_plaza_apc: '3.32', permanent_toll_plaza_id: '',
    notification_so_number: '', appointed_dated: '12/10/2023', RemarkMain: '',
    e_office_fileno: '289773', div_efile_num: '', upc_flag: '0', status_code: '6667',
    rejection_remarks: '', is_plaza_name_edited_once: 'False',
  },
  {
    id: '459', tollnotificationid: '401',
    project_name: '4L of Greenfield section from Sirhind to Mohali',
    upc: 'N/05058/01001/PB', piu_name: 'Chandigarh', ro_name: 'RO-Chandigarh (HR)',
    documentname: '1163.pdf', Published_toll_notification: '', status: 'Submitted By PIU',
    status_Code: '6667', physical_progress: '95.47', nameoftoll_plaza: 'Bhatt Majra',
    locationoftoll_plaza: '26+400', nooftoll_lane: '8L',
    temp_toll_plaza_id: 'N0505801001PB_T_00004', toll_plaza_cfy: '4658',
    traffic_surveydate: '01/03/2026', toll_plaza_apc: '13.52', permanent_toll_plaza_id: '',
    notification_so_number: '', appointed_dated: '08/05/2023', RemarkMain: '',
    e_office_fileno: '307371', div_efile_num: '', upc_flag: '0', status_code: '6667',
    rejection_remarks: '', is_plaza_name_edited_once: 'False',
  },
  {
    id: '458', tollnotificationid: '401',
    project_name: '4L of Greenfield section from Sirhind to Mohali',
    upc: 'N/05058/01001/PB', piu_name: 'Chandigarh', ro_name: 'RO-Chandigarh (HR)',
    documentname: '1163.pdf', Published_toll_notification: '', status: 'Submitted By PIU',
    status_Code: '6667', physical_progress: '95.47', nameoftoll_plaza: 'Dangherian',
    locationoftoll_plaza: '18+650', nooftoll_lane: '8L',
    temp_toll_plaza_id: 'N0505801001PB_T_00003', toll_plaza_cfy: '1941',
    traffic_surveydate: '01/03/2026', toll_plaza_apc: '1.26', permanent_toll_plaza_id: '',
    notification_so_number: '', appointed_dated: '08/05/2023', RemarkMain: '',
    e_office_fileno: '307371', div_efile_num: '', upc_flag: '0', status_code: '6667',
    rejection_remarks: '', is_plaza_name_edited_once: 'False',
  },
  {
    id: '457', tollnotificationid: '401',
    project_name: '4L of Greenfield section from Sirhind to Mohali',
    upc: 'N/05058/01001/PB', piu_name: 'Chandigarh', ro_name: 'RO-Chandigarh (HR)',
    documentname: '1163.pdf', Published_toll_notification: '', status: 'Submitted By PIU',
    status_Code: '6667', physical_progress: '95.47', nameoftoll_plaza: 'Bhagatpura/Daulatpura',
    locationoftoll_plaza: '9+390', nooftoll_lane: '8L',
    temp_toll_plaza_id: 'N0505801001PB_T_00002', toll_plaza_cfy: '1164',
    traffic_surveydate: '01/03/2026', toll_plaza_apc: '1.09', permanent_toll_plaza_id: '',
    notification_so_number: '', appointed_dated: '08/05/2023', RemarkMain: '',
    e_office_fileno: '307371', div_efile_num: '', upc_flag: '0', status_code: '6667',
    rejection_remarks: '', is_plaza_name_edited_once: 'False',
  },
  {
    id: '456', tollnotificationid: '401',
    project_name: '4L of Greenfield section from Sirhind to Mohali',
    upc: 'N/05058/01001/PB', piu_name: 'Chandigarh', ro_name: 'RO-Chandigarh (HR)',
    documentname: '1163.pdf', Published_toll_notification: '', status: 'Submitted By PIU',
    status_Code: '6667', physical_progress: '95.47', nameoftoll_plaza: 'Machlli Kalan',
    locationoftoll_plaza: '5+840', nooftoll_lane: '8L',
    temp_toll_plaza_id: 'N0505801001PB_T_00001', toll_plaza_cfy: '4658',
    traffic_surveydate: '01/03/2026', toll_plaza_apc: '11.56', permanent_toll_plaza_id: '',
    notification_so_number: '', appointed_dated: '08/05/2023', RemarkMain: '',
    e_office_fileno: '307371', div_efile_num: '', upc_flag: '0', status_code: '6667',
    rejection_remarks: '', is_plaza_name_edited_once: 'False',
  },
  {
    id: '455', tollnotificationid: '400',
    project_name: 'Maheshkunt -Saharsa-Purnea Pkg II',
    upc: 'N/08052/02001/BR', piu_name: 'Purnea', ro_name: 'RO-Patna',
    documentname: 'NotesheetTollNotificationNh107.pdf',
    Published_toll_notification: '', status: 'Submitted By PIU', status_Code: '6667',
    physical_progress: '94.00', nameoftoll_plaza: 'Belachand Sukhia Toll Plaza',
    locationoftoll_plaza: 'At Design Km 137+290 of NH – 107 near Belachand Sukhia village in Purnea district of Bihar.',
    nooftoll_lane: '4L', temp_toll_plaza_id: 'N0805202001BR_T_00001', toll_plaza_cfy: '10212',
    traffic_surveydate: '', toll_plaza_apc: '', permanent_toll_plaza_id: '',
    notification_so_number: '', appointed_dated: '13/12/2018',
    RemarkMain: 'Proposal for publication of User Fee Notification of Belachand Sukhia Toll Plaza.',
    e_office_fileno: '268360', div_efile_num: '', upc_flag: '0', status_code: '6667',
    rejection_remarks: '', is_plaza_name_edited_once: 'False',
  },
  {
    id: '454', tollnotificationid: '399',
    project_name: 'Bijnor-Kotawali',
    upc: 'N/08076/01003/UP', piu_name: 'Meerut', ro_name: 'RO-Delhi',
    documentname: 'TollNotification3.pdf',
    Published_toll_notification: 'TollNotification3639211104200591196.pdf',
    status: 'S.O Number Updated By CO Division', status_Code: '6668',
    physical_progress: '99.02', nameoftoll_plaza: 'Bijnor-Kotawali',
    locationoftoll_plaza: '167+200', nooftoll_lane: '6L',
    temp_toll_plaza_id: 'N0807601003UP_T_00001', toll_plaza_cfy: '3978',
    traffic_surveydate: '14/05/2026', toll_plaza_apc: '4.7', permanent_toll_plaza_id: '',
    notification_so_number: 'S.O. 3448(E)', appointed_dated: '01/11/2021', RemarkMain: '',
    e_office_fileno: '266574', div_efile_num: '266574', upc_flag: '0', status_code: '6668',
    rejection_remarks: '', is_plaza_name_edited_once: 'True',
  },
];

// ─── Group plaza rows by tollnotificationid → one TollNotification per group ──
function buildStore(): TollNotification[] {
  const grouped = new Map<string, ApiRecord[]>();
  for (const r of RAW_API) {
    const arr = grouped.get(r.tollnotificationid) ?? [];
    arr.push(r);
    grouped.set(r.tollnotificationid, arr);
  }

  const result: TollNotification[] = [];
  for (const [tnId, rows] of grouped.entries()) {
    const first = rows[0];
    const statusCode = first.status_code as TollNotification['statusCode'];

    const tollPlazas: TollPlazaRow[] = rows.map((r) => ({
      id: r.id,
      nameOfTollPlaza:     r.nameoftoll_plaza,
      locationOfTollPlaza: r.locationoftoll_plaza,
      noOfTollLane:        r.nooftoll_lane,
      tempTollPlazaId:     r.temp_toll_plaza_id,
      permanentTollPlazaId: r.permanent_toll_plaza_id,
      tollPlazaCfy:        r.toll_plaza_cfy,
      trafficSurveyDate:   r.traffic_surveydate,
      tollPlazaApc:        r.toll_plaza_apc,
    }));

    result.push({
      id: tnId,
      tollNotificationId: tnId,
      upc:                first.upc,
      projectName:        first.project_name,
      piuName:            first.piu_name,
      roName:             first.ro_name,
      tollMode:           'New Toll Plaza',
      plazaType:          'Public Funded',
      tollingNotApplicable: false,
      tollingNotApplicableRemarks: '',
      appointedDate:      first.appointed_dated,
      likelyCompletionDate: '',
      physicalProgress:   first.physical_progress,
      documentName:       first.documentname,
      publishedTollNotification: first.Published_toll_notification,
      eOfficeFileNo:      first.e_office_fileno,
      piuFileStatus:      '',
      divEfileNum:        first.div_efile_num,
      coFileStatus:       '',
      eOfficeSubject:     '',
      notificationSoNumber: first.notification_so_number,
      status:             mapStatus(statusCode),
      statusCode,
      statusLabel:        first.status,
      rejectionRemarks:   first.rejection_remarks,
      remarkMain:         first.RemarkMain,
      tollPlazas,
      lengthDetails: {
        netRoadLength2L: '', netRoadLength4L: '',
        netBypassLength2L: '', netBypassLength4L: '',
        netStructureLength2L: '', netStructureLength4L: '',
        projectLength: '', projectInfluenceLength: '',
      },
      upcFlag:              first.upc_flag,
      isPlazaNameEditedOnce: first.is_plaza_name_edited_once === 'True',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  return result;
}

// ─── In-memory store ──────────────────────────────────────────────────────────
let _store: TollNotification[] = buildStore();
let _counter = 500;
const now = () => new Date().toISOString();

export const tollNotificationMockStore = {
  getAll(params: {
    status?: string;
    search?: string;
    piuName?: string;
    page?: number;
    pageSize?: number;
  }) {
    let filtered = [..._store];
    if (params.status)
      filtered = filtered.filter((n) => n.status === params.status);
    if (params.piuName)
      filtered = filtered.filter((n) => n.piuName === params.piuName);
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.upc.toLowerCase().includes(q) ||
          n.projectName.toLowerCase().includes(q) ||
          n.piuName.toLowerCase().includes(q) ||
          n.tollPlazas.some((p) => p.nameOfTollPlaza.toLowerCase().includes(q)),
      );
    }
    const page     = params.page     ?? 1;
    const pageSize = params.pageSize ?? 10;
    const total      = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    return {
      data: filtered.slice(start, start + pageSize),
      pagination: { page, pageSize, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    };
  },

  getById: (id: string) => _store.find((n) => n.id === id),

  /** Look up project info by UPC — used for autofill in the create form */
  lookupByUpc: (upc: string): { projectName: string; physicalProgress: string; appointedDate: string; piuName: string; roName: string } | undefined => {
    const match = _store.find((n) => n.upc.trim().toUpperCase() === upc.trim().toUpperCase());
    if (!match) return undefined;
    return {
      projectName:      match.projectName,
      physicalProgress: match.physicalProgress,
      appointedDate:    match.appointedDate,
      piuName:          match.piuName,
      roName:           match.roName,
    };
  },

  create(dto: Omit<TollNotification, 'id' | 'tollNotificationId' | 'createdAt' | 'updatedAt'>): TollNotification {
    const id = String(++_counter);
    const record: TollNotification = { ...dto, id, tollNotificationId: id, createdAt: now(), updatedAt: now() };
    _store = [record, ..._store];
    return record;
  },

  update(id: string, dto: Partial<TollNotification>): TollNotification | undefined {
    const idx = _store.findIndex((n) => n.id === id);
    if (idx === -1) return undefined;
    const updated = { ..._store[idx], ...dto, updatedAt: now() };
    _store = _store.map((n) => (n.id === id ? updated : n));
    return updated;
  },

  submit(id: string): TollNotification | undefined {
    return tollNotificationMockStore.update(id, { status: 'SUBMITTED', statusCode: '6667', statusLabel: 'Submitted By PIU' });
  },

  updateEOfficeNumber(id: string, dto: { divEfileNum: string; coFileStatus: string }): TollNotification | undefined {
    return tollNotificationMockStore.update(id, {
      ...dto, status: 'CO_REVIEWED', statusCode: '66691',
      statusLabel: 'E-Office/Computer No. Is Updated By CO Division',
    });
  },

  updateSoNumber(id: string, dto: { notificationSoNumber: string; publishedTollNotification: string }): TollNotification | undefined {
    return tollNotificationMockStore.update(id, {
      ...dto, status: 'SO_ISSUED', statusCode: '6668', statusLabel: 'S.O Number Updated By CO Division',
    });
  },

  publish(id: string): TollNotification | undefined {
    return tollNotificationMockStore.update(id, { status: 'PUBLISHED', statusCode: '6669', statusLabel: 'Published' });
  },

  reject(id: string, rejectionRemarks: string): TollNotification | undefined {
    return tollNotificationMockStore.update(id, { rejectionRemarks, status: 'REJECTED', statusCode: '6670', statusLabel: 'Rejected' });
  },

  delete(id: string): void {
    _store = _store.filter((n) => n.id !== id);
  },

  reset() { _store = buildStore(); _counter = 500; },
};
