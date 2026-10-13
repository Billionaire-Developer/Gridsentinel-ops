export const initialSites = [
  { id: 'SITE-001', name: 'Ikeja Commercial Hub', location: 'Ikeja, Lagos', type: 'Commercial solar + grid', status: 'Healthy', health: 96, assets: 18, openIncidents: 1, lastUpdate: '2 min ago', output: '428 kW' },
  { id: 'SITE-002', name: 'Lekki Business Park', location: 'Lekki, Lagos', type: 'Solar hybrid', status: 'Attention', health: 78, assets: 24, openIncidents: 3, lastUpdate: '8 min ago', output: '316 kW' },
  { id: 'SITE-003', name: 'Ogun Industrial Estate', location: 'Ota, Ogun', type: 'Industrial hybrid', status: 'Critical', health: 54, assets: 31, openIncidents: 5, lastUpdate: '1 min ago', output: '590 kW' },
  { id: 'SITE-004', name: 'Yaba Innovation Campus', location: 'Yaba, Lagos', type: 'Commercial solar', status: 'Healthy', health: 93, assets: 15, openIncidents: 0, lastUpdate: '5 min ago', output: '205 kW' },
  { id: 'SITE-005', name: 'Ibadan Cold Storage', location: 'Ibadan, Oyo', type: 'Solar + generator', status: 'Attention', health: 82, assets: 21, openIncidents: 2, lastUpdate: '11 min ago', output: '172 kW' }
];

export const initialIncidents = [
  { id: 'INC-2048', title: 'Battery temperature above normal range', site: 'Ogun Industrial Estate', siteId: 'SITE-003', asset: 'Battery Bank B-04', severity: 'Critical', status: 'Open', time: '09:42 AM', detail: 'Temperature readings are above the configured demo threshold. Verify sensor readings and arrange an inspection.' },
  { id: 'INC-2047', title: 'Inverter output dropped unexpectedly', site: 'Lekki Business Park', siteId: 'SITE-002', asset: 'Inverter INV-12', severity: 'High', status: 'Investigating', time: '09:18 AM', detail: 'Output is lower than the recent baseline. Check event logs and inspect the unit.' },
  { id: 'INC-2046', title: 'Preventive maintenance overdue', site: 'Ogun Industrial Estate', siteId: 'SITE-003', asset: 'Generator GEN-02', severity: 'High', status: 'Open', time: '08:55 AM', detail: 'The scheduled service date has passed. Confirm availability and create a maintenance plan.' },
  { id: 'INC-2045', title: 'Grid supply interruption recorded', site: 'Ikeja Commercial Hub', siteId: 'SITE-001', asset: 'Grid connection GRID-01', severity: 'Medium', status: 'Monitoring', time: '08:31 AM', detail: 'A supply interruption was recorded in the imported demo event log.' },
  { id: 'INC-2044', title: 'Battery state-of-charge variance', site: 'Lekki Business Park', siteId: 'SITE-002', asset: 'Battery Bank B-02', severity: 'Medium', status: 'Open', time: 'Yesterday', detail: 'Reported charge level differs from the expected operating pattern.' },
  { id: 'INC-2043', title: 'Routine inspection completed', site: 'Yaba Innovation Campus', siteId: 'SITE-004', asset: 'Inverter INV-03', severity: 'Low', status: 'Resolved', time: 'Yesterday', detail: 'Routine inspection was completed and the maintenance note was recorded.' }
];

export const initialWorkOrders = [
  { id: 'WO-1092', title: 'Inspect battery bank B-04', site: 'Ogun Industrial Estate', asset: 'Battery Bank B-04', priority: 'Urgent', status: 'Open', assignee: 'T. Adebayo', due: 'Today' },
  { id: 'WO-1091', title: 'Diagnose inverter output drop', site: 'Lekki Business Park', asset: 'Inverter INV-12', priority: 'High', status: 'In progress', assignee: 'M. Okafor', due: 'Today' },
  { id: 'WO-1090', title: 'Generator preventive service', site: 'Ogun Industrial Estate', asset: 'Generator GEN-02', priority: 'High', status: 'Open', assignee: 'Unassigned', due: 'Overdue' },
  { id: 'WO-1089', title: 'Inspect grid event log', site: 'Ikeja Commercial Hub', asset: 'Grid connection GRID-01', priority: 'Normal', status: 'Completed', assignee: 'K. Bello', due: 'Yesterday' },
  { id: 'WO-1088', title: 'Quarterly inverter inspection', site: 'Yaba Innovation Campus', asset: 'Inverter INV-03', priority: 'Normal', status: 'Completed', assignee: 'M. Okafor', due: 'Yesterday' }
];

export const initialAssets = [
  { id: 'INV-12', name: 'Inverter INV-12', type: 'Inverter', site: 'Lekki Business Park', condition: 'Attention', lastService: '12 Aug 2026', nextService: '12 Nov 2026' },
  { id: 'B-04', name: 'Battery Bank B-04', type: 'Battery', site: 'Ogun Industrial Estate', condition: 'Critical', lastService: '02 Jul 2026', nextService: '02 Oct 2026' },
  { id: 'GEN-02', name: 'Generator GEN-02', type: 'Generator', site: 'Ogun Industrial Estate', condition: 'Attention', lastService: '18 Jun 2026', nextService: '18 Sep 2026' },
  { id: 'INV-03', name: 'Inverter INV-03', type: 'Inverter', site: 'Yaba Innovation Campus', condition: 'Healthy', lastService: '29 Sep 2026', nextService: '29 Dec 2026' },
  { id: 'B-02', name: 'Battery Bank B-02', type: 'Battery', site: 'Lekki Business Park', condition: 'Attention', lastService: '10 Aug 2026', nextService: '10 Nov 2026' },
  { id: 'GRID-01', name: 'Grid connection GRID-01', type: 'Grid connection', site: 'Ikeja Commercial Hub', condition: 'Healthy', lastService: '05 Oct 2026', nextService: '05 Jan 2027' },
  { id: 'INV-08', name: 'Inverter INV-08', type: 'Inverter', site: 'Ibadan Cold Storage', condition: 'Healthy', lastService: '21 Sep 2026', nextService: '21 Dec 2026' }
];

export const initialAudit = [
  { id: 1, action: 'Demo workspace initialized', target: 'Workspace', user: 'You', time: 'Today, 9:00 AM' },
  { id: 2, action: 'Incident status updated', target: 'INC-2047', user: 'Operations team', time: 'Today, 9:18 AM' },
  { id: 3, action: 'Work order assigned', target: 'WO-1091', user: 'Operations team', time: 'Today, 9:20 AM' },
  { id: 4, action: 'Asset register reviewed', target: '7 demo assets', user: 'You', time: 'Yesterday, 4:32 PM' }
];
