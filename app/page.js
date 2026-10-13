'use client';

import { useMemo, useRef, useState } from 'react';
import {
  Activity, AlertCircle, AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight,
  Bell, BatteryCharging, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  CircleHelp, ClipboardCheck, Clock3, Command, Download, FileDown, FileUp, Filter,
  Gauge, HardDrive, LayoutDashboard, LifeBuoy, ListFilter, Menu, MoreHorizontal,
  Plus, Search, Settings2, ShieldCheck, SlidersHorizontal, Sparkles, Zap, X,
  Wrench, XCircle, CircleDot, MapPin, CalendarDays, ExternalLink, UploadCloud
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { initialAssets, initialAudit, initialIncidents, initialSites, initialWorkOrders } from '../lib/demo-data';
import nercData from '../lib/nerc-q2-2026.json';

const trendData = [
  { time: '06:00', output: 62, expected: 68 }, { time: '08:00', output: 76, expected: 77 },
  { time: '10:00', output: 83, expected: 84 }, { time: '12:00', output: 88, expected: 90 },
  { time: '14:00', output: 80, expected: 86 }, { time: '16:00', output: 73, expected: 79 },
  { time: '18:00', output: 58, expected: 65 }, { time: '20:00', output: 45, expected: 49 }
];
const incidentBars = [{ day: 'Mon', critical: 1, other: 4 }, { day: 'Tue', critical: 2, other: 3 }, { day: 'Wed', critical: 0, other: 5 }, { day: 'Thu', critical: 1, other: 2 }, { day: 'Fri', critical: 3, other: 4 }, { day: 'Sat', critical: 1, other: 2 }, { day: 'Sun', critical: 1, other: 3 }];
const navGroups = [
  { label: 'WORKSPACE', items: [{ id: 'overview', label: 'Overview', icon: LayoutDashboard }, { id: 'sites', label: 'Sites & assets', icon: HardDrive }, { id: 'incidents', label: 'Incident inbox', icon: AlertCircle, count: '6' }, { id: 'workorders', label: 'Work orders', icon: ClipboardCheck, count: '3' }] },
  { label: 'MANAGEMENT', items: [{ id: 'data', label: 'Data & imports', icon: FileUp }, { id: 'audit', label: 'Audit trail', icon: ShieldCheck }] }
];

function cn(...classes) { return classes.filter(Boolean).join(' '); }
function getNercMetric(key) {
  return nercData.metrics.find((metric) => metric.key === key);
}

function formatNercValue(value) {
  return Number(value).toLocaleString('en-NG', {
    maximumFractionDigits: 2
  });
}
function StatusPill({ children, kind = 'neutral' }) { return <span className={`pill pill-${kind}`}><span className="pill-dot" />{children}</span>; }
function Severity({ value }) {
  const kind = value === 'Critical' || value === 'Urgent' ? 'critical' : value === 'High' ? 'high' : value === 'Medium' ? 'medium' : value === 'Low' ? 'low' : 'neutral';
  return <span className={`severity sev-${kind}`}>{value}</span>;
}
function SectionTitle({ eyebrow, title, subtitle, action }) { return <div className="section-title"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{action}</div>; }
function EmptyState({ title, body }) { return <div className="empty-state"><CircleHelp size={26} /><strong>{title}</strong><span>{body}</span></div>; }

export default function Home() {
  const [active, setActive] = useState('overview');
  const [mobileNav, setMobileNav] = useState(false);
  const [search, setSearch] = useState('');
  const [incidentFilter, setIncidentFilter] = useState('All');
  const [siteFilter, setSiteFilter] = useState('All sites');
  const [sites, setSites] = useState(initialSites);
  const [incidents, setIncidents] = useState(initialIncidents);
  const [workOrders, setWorkOrders] = useState(initialWorkOrders);
  const [assets, setAssets] = useState(initialAssets);
  const [audit, setAudit] = useState(initialAudit);
  const [toast, setToast] = useState('');
  const [modal, setModal] = useState('');
  const [newWork, setNewWork] = useState({ title: '', site: initialSites[0].name, asset: '', priority: 'Normal', assignee: 'Unassigned', due: 'Tomorrow' });
  const [uploadName, setUploadName] = useState('');
  const [uploadRows, setUploadRows] = useState([]);
  const fileInput = useRef(null);

  const showToast = (message) => { setToast(message); window.setTimeout(() => setToast(''), 3200); };
  const addAudit = (action, target) => setAudit((prev) => [{ id: Date.now(), action, target, user: 'You', time: 'Just now' }, ...prev]);
  const updateIncident = (id, patch) => {
    setIncidents((prev) => prev.map((item) => item.id === id ? { ...item, ...patch } : item));
    addAudit('Incident updated', id);
    showToast(`Incident ${id} updated`);
  };
  const updateWork = (id, patch) => {
    setWorkOrders((prev) => prev.map((item) => item.id === id ? { ...item, ...patch } : item));
    addAudit('Work order updated', id);
    showToast(`Work order ${id} updated`);
  };
  const filteredIncidents = useMemo(() => incidents.filter((i) => (incidentFilter === 'All' || i.status === incidentFilter || i.severity === incidentFilter) && `${i.id} ${i.title} ${i.site} ${i.asset}`.toLowerCase().includes(search.toLowerCase())), [incidents, incidentFilter, search]);
  const filteredSites = useMemo(() => sites.filter((s) => (siteFilter === 'All sites' || s.status === siteFilter) && `${s.name} ${s.location} ${s.id} ${s.type}`.toLowerCase().includes(search.toLowerCase())), [sites, siteFilter, search]);
  const openIncidents = incidents.filter((i) => i.status !== 'Resolved').length;
  const criticalCount = incidents.filter((i) => i.severity === 'Critical' && i.status !== 'Resolved').length;
  const openWork = workOrders.filter((w) => w.status !== 'Completed').length;

  const createWorkOrder = (e) => {
    e.preventDefault();
    if (!newWork.title.trim()) return;
    const id = `WO-${1100 + workOrders.length}`;
    setWorkOrders((prev) => [{ ...newWork, id, status: 'Open' }, ...prev]);
    addAudit('Work order created', id);
    setModal('');
    setNewWork({ title: '', site: initialSites[0].name, asset: '', priority: 'Normal', assignee: 'Unassigned', due: 'Tomorrow' });
    showToast(`${id} created successfully`);
  };

  const handleCsv = (file) => {
    if (!file) return;
    setUploadName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      const rows = text.split(/\r?\n/).filter(Boolean).slice(0, 1000);
      const parsed = rows.map((row) => row.split(',').map((cell) => cell.trim().replace(/^"|"$/g, '')));
      setUploadRows(parsed);
      addAudit('CSV file imported for preview', file.name);
      showToast(`Loaded ${Math.max(parsed.length - 1, 0)} row(s) for preview`);
    };
    reader.readAsText(file);
  };

  const exportCsv = () => {
    const header = ['Incident ID', 'Title', 'Site', 'Asset', 'Severity', 'Status', 'Time'];
    const lines = [header, ...incidents.map((i) => [i.id, i.title, i.site, i.asset, i.severity, i.status, i.time])];
    const csv = lines.map((row) => row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a'); link.href = url; link.download = 'gridsentinel-incidents.csv'; link.click(); URL.revokeObjectURL(url);
    addAudit('Incident report exported', 'gridsentinel-incidents.csv');
    showToast('Incident report exported');
  };

  const pageTitle = { overview: ['OPERATIONS CENTER', 'Good morning, Operations', 'Here’s what is happening across your monitored sites today.'], sites: ['ASSET MANAGEMENT', 'Sites & assets', 'A single view of your sites, equipment, and current condition.'], incidents: ['INCIDENT RESPONSE', 'Incident inbox', 'Triage events, document investigation, and keep every issue accountable.'], workorders: ['MAINTENANCE', 'Work orders', 'Coordinate field work and track maintenance from open to completed.'], data: ['DATA MANAGEMENT', 'Data & imports', 'Bring authorized operational exports into one place for review.'], audit: ['GOVERNANCE', 'Audit trail', 'A record of important actions in this demo workspace.'] }[active];

  return <div className="app-shell">
    <aside className={cn('sidebar', mobileNav && 'sidebar-open')}>
      <div className="brand"><div className="brand-mark"><Zap size={21} fill="currentColor" /></div><div><div className="brand-name">GridSentinel<span>Ops</span></div><div className="brand-caption">INFRASTRUCTURE INTELLIGENCE</div></div><button className="icon-button mobile-close" onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={18} /></button></div>
      <button className="workspace-switch"><div className="workspace-avatar">GS</div><div className="workspace-copy"><strong>GridSentinel Demo</strong><span>Starter workspace</span></div><ChevronDown size={15} /></button>
      <div className="nav-scroll">{navGroups.map((group) => <div className="nav-group" key={group.label}><div className="nav-label">{group.label}</div>{group.items.map(({ id, label, icon: Icon, count }) => <button key={id} className={cn('nav-item', active === id && 'nav-item-active')} onClick={() => { setActive(id); setSearch(''); setMobileNav(false); }}><Icon size={18} strokeWidth={1.8} /><span>{label}</span>{count && <span className="nav-count">{id === 'incidents' ? openIncidents : openWork}</span>}</button>)}</div>)}</div>
      <div className="sidebar-bottom"><div className="pilot-card"><div className="pilot-icon"><Sparkles size={17} /></div><strong>Built for better uptime</strong><p>Bring operational signals and maintenance workflows together.</p><button onClick={() => { setActive('data'); setMobileNav(false); }}>Explore data imports <ArrowRight size={14} /></button></div><button className="nav-item support-link" onClick={() => showToast('Help center: this is a local demo. Add your support URL when deploying.')}><LifeBuoy size={18} /><span>Help & support</span><ExternalLink size={13} className="external" /></button><div className="user-profile"><div className="user-avatar">JD</div><div className="user-copy"><strong>Jane Doe</strong><span>Operations admin</span></div><button className="icon-button" onClick={() => showToast('Profile settings are a demo placeholder.')} aria-label="Profile options"><MoreHorizontal size={19} /></button></div></div>
    </aside>
    {mobileNav && <button className="mobile-scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}
    <main className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu size={20} /></button><div className="breadcrumb">Workspace <ChevronRight size={14} /> <strong>{navGroups.flatMap((g) => g.items).find((i) => i.id === active)?.label || 'Overview'}</strong></div></div><div className="topbar-actions"><div className="environment"><span /> DEMO ENVIRONMENT</div><button className="icon-button top-notification" onClick={() => { setActive('incidents'); showToast(`${openIncidents} unresolved incident(s) need review`); }} aria-label="Notifications"><Bell size={18} /><i /></button><div className="top-avatar">JD</div></div></header>
      <div className="page-content">
        <div className="page-heading"><SectionTitle eyebrow={pageTitle[0]} title={pageTitle[1]} subtitle={pageTitle[2]} action={<div className="heading-actions"><button className="button button-secondary" onClick={exportCsv}><Download size={16} /> Export report</button><button className="button button-primary" onClick={() => setModal('work')}><Plus size={17} /> New work order</button></div>} /></div>

        {active === 'overview' && <>
          <div className="overview-banner"><div className="banner-icon"><Activity size={21} /></div><div className="banner-copy"><strong>Operations snapshot <span className="live-label"><i /> DEMO DATA </span></strong><p>Demo workspace data only. Connect an authorized source to reflect real operations.</p></div><button onClick={() => setActive('data')}>Connect data <ArrowRight size={15} /></button></div>
          <div className="metrics-grid">
            <MetricCard label="Sites monitored" value={String(sites.length).padStart(2, '0')} note="Across 3 locations" icon={HardDrive} color="green" trend="+2 this month" />
            <MetricCard label="Sites needing attention" value={String(sites.filter((s) => s.status !== 'Healthy').length).padStart(2, '0')} note="Review recommended" icon={AlertTriangle} color="amber" trend="2 critical sites" />
            <MetricCard label="Open incidents" value={String(openIncidents).padStart(2, '0')} note={`${criticalCount} critical priority`} icon={AlertCircle} color="red" trend="Needs triage" />
            <MetricCard label="Open work orders" value={String(openWork).padStart(2, '0')} note="Maintenance queue" icon={Wrench} color="blue" trend={`${workOrders.filter((w) => w.due === 'Overdue' && w.status !== 'Completed').length} overdue`} />
          </div>
          
          <section className="panel" style={{ marginBottom: 24, padding: 20 }}>
            <div className="panel-heading">
              <div>
                <h2>Nigeria Electricity Sector</h2>
                <p>
                  National generation and sector performance
                  · Historical report data
                </p>
              </div>
              <span className="pill pill-blue">
                Q2 2026
              </span>
            </div>

            <div className="metrics-grid">
              {[
                {
                  key: 'average_available_generation_capacity_mw',
                  label: 'Average available capacity',
                  unit: 'MW'
                },
                {
                  key: 'total_quarterly_generation_gwh',
                  label: 'Quarterly generation',
                  unit: 'GWh'
                },
                {
                  key: 'plant_availability_factor_percent',
                  label: 'Plant availability factor',
                  unit: '%'
                },
                {
                  key: 'hydropower_generation_share_percent',
                  label: 'Hydropower share',
                  unit: '%'
                }
              ].map(({ key, label, unit }) => {
                const metric = getNercMetric(key);

                return (
                  <section className="panel metric-card" key={key}>
                    <div className="metric-top">
                      <span>{label}</span>
                    </div>

                    <div className="metric-value">
                      {metric
                        ? formatNercValue(metric.value)
                        : '—'}
                      <small> {unit}</small>
                    </div>

                    <div className="metric-note">
                      Q2 2026 reported value
                    </div>

                    {metric && (
                      <div className="metric-trend">
                        Q1: {formatNercValue(metric.q1_value)} {unit}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>

            <div style={{ marginTop: 18, fontSize: 12, lineHeight: 1.7 }}>
              <strong>Source:</strong>{' '}
              {nercData.metadata.source} —{' '}
              {nercData.metadata.report_title}.

              <br />

              Published:{' '}
              {nercData.metadata.published_date}.

              <br />

              <a
                href={nercData.metadata.source_url}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#16856e', textDecoration: 'underline' }}
              >
                View NERC reports
              </a>

              <p style={{ marginTop: 8 }}>
                Historical statistics only. These figures are not
                real-time grid telemetry and should not be treated
                as current operating conditions.
              </p>
            </div>
          </section>

          <div className="dashboard-grid">
            <section className="panel output-panel"><div className="panel-heading"><div><h2>Energy output overview</h2><p>Illustrative output index · last 16 hours</p></div><button className="small-select" onClick={() => showToast('Demo chart range: last 16 hours')}>Last 16 hours <ChevronDown size={14} /></button></div><div className="chart-summary"><div><span>Output index</span><strong>78.4 <small>/ 100</small></strong></div><div className="chart-change"><ArrowUpRight size={15} /> 4.8% <span>vs. previous period</span></div></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trendData} margin={{ top: 12, right: 8, left: -24, bottom: 0 }}><defs><linearGradient id="outputFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#16856e" stopOpacity={0.18}/><stop offset="100%" stopColor="#16856e" stopOpacity={0.01}/></linearGradient></defs><CartesianGrid stroke="#edf1ef" vertical={false} /><XAxis dataKey="time" tick={{ fill: '#87938f', fontSize: 11 }} axisLine={false} tickLine={false} dy={9} /><YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fill: '#87938f', fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5ece8', fontSize: 12 }} /><Area type="monotone" dataKey="expected" name="Expected" stroke="#b8c7c2" strokeDasharray="4 4" strokeWidth={1.5} fill="transparent" /><Area type="monotone" dataKey="output" name="Output" stroke="#16856e" strokeWidth={2.5} fill="url(#outputFill)" activeDot={{ r: 4, strokeWidth: 0 }} /></AreaChart></ResponsiveContainer></div><div className="chart-legend"><span><i className="legend-green" /> Observed output</span><span><i className="legend-dashed" /> Expected baseline</span><small>Illustrative data</small></div></section>
            <section className="panel health-panel"><div className="panel-heading"><div><h2>Site health</h2><p>Current operational readiness</p></div><button className="text-link" onClick={() => setActive('sites')}>View all <ArrowRight size={14} /></button></div><div className="health-list">{sites.slice(0, 4).map((site) => <button className="health-row" key={site.id} onClick={() => { setActive('sites'); setSearch(site.name); }}><div className={`health-symbol health-${site.status.toLowerCase()}`}>{site.status === 'Healthy' ? <CheckCircle2 size={17} /> : site.status === 'Critical' ? <XCircle size={17} /> : <AlertTriangle size={17} />}</div><div className="health-info"><strong>{site.name}</strong><span><MapPin size={12} /> {site.location}</span><div className="health-track"><i className={site.health < 60 ? 'track-red' : site.health < 85 ? 'track-amber' : ''} style={{ width: `${site.health}%` }} /></div></div><div className="health-score"><strong>{site.health}%</strong><span>{site.status}</span></div></button>)}</div><div className="panel-footer"><span><i className="status-dot dot-green" /> Healthy</span><span><i className="status-dot dot-amber" /> Attention</span><span><i className="status-dot dot-red" /> Critical</span></div></section>
          </div>
          <div className="lower-grid"><section className="panel incident-panel"><div className="panel-heading"><div><h2>Priority incidents</h2><p>Items that may require a response</p></div><button className="text-link" onClick={() => setActive('incidents')}>Incident inbox <ArrowRight size={14} /></button></div><div className="table-scroll"><table><thead><tr><th>INCIDENT</th><th>SITE / ASSET</th><th>SEVERITY</th><th>STATUS</th><th></th></tr></thead><tbody>{incidents.filter((i) => i.status !== 'Resolved').slice(0, 4).map((incident) => <tr key={incident.id}><td><div className="table-primary">{incident.title}</div><div className="table-secondary">{incident.id} · {incident.time}</div></td><td><div className="table-primary">{incident.site}</div><div className="table-secondary">{incident.asset}</div></td><td><Severity value={incident.severity} /></td><td><StatusPill kind={incident.status === 'Open' ? 'red' : incident.status === 'Investigating' ? 'blue' : 'amber'}>{incident.status}</StatusPill></td><td><button className="row-arrow" onClick={() => { setActive('incidents'); setSearch(incident.id); }} aria-label={`Open ${incident.id}`}><ArrowRight size={16} /></button></td></tr>)}</tbody></table></div></section><section className="panel activity-panel"><div className="panel-heading"><div><h2>Incident activity</h2><p>Last 7 days · demo events</p></div><button className="icon-button" onClick={() => showToast('Showing the last 7 days of demo events.')} aria-label="Chart options"><MoreHorizontal size={19} /></button></div><div className="mini-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={incidentBars} barGap={5} margin={{ top: 10, right: 2, left: -28, bottom: 0 }}><CartesianGrid stroke="#edf1ef" vertical={false} /><XAxis dataKey="day" tick={{ fill: '#87938f', fontSize: 11 }} axisLine={false} tickLine={false} dy={8} /><YAxis tick={{ fill: '#87938f', fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5ece8', fontSize: 12 }} /><Bar dataKey="critical" name="Critical" stackId="a" fill="#d95757" radius={[3, 3, 0, 0]} /><Bar dataKey="other" name="Other" stackId="a" fill="#a9dccc" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer></div><div className="chart-legend"><span><i className="legend-red" /> Critical</span><span><i className="legend-mint" /> Other events</span></div><div className="activity-callout"><div className="callout-icon"><ShieldCheck size={17} /></div><p><strong>Keep every action traceable.</strong> Incident updates and work order changes are recorded in the audit trail.</p><button onClick={() => setActive('audit')}>Review log</button></div></section></div>
          <div className="bottom-note"><ShieldCheck size={15} /><span>GridSentinel Ops is in demo mode. No live infrastructure systems are connected.</span><span className="note-separator">·</span><button onClick={() => setActive('data')}>Learn about imports</button></div>
        </>}

        {active === 'sites' && <>
          <div className="filterbar"><div className="search-box"><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search sites, locations, or IDs..." /></div><select className="filter-select" value={siteFilter} onChange={(e) => setSiteFilter(e.target.value)}><option>All sites</option><option>Healthy</option><option>Attention</option><option>Critical</option></select><button className="button button-secondary" onClick={() => { setSiteFilter('All sites'); setSearch(''); }}><ListFilter size={15} /> Reset filters</button></div>
          <div className="site-grid">{filteredSites.map((site) => <section className="panel site-card" key={site.id}><div className="site-card-top"><div className={`site-icon site-icon-${site.status.toLowerCase()}`}><Zap size={19} /></div><StatusPill kind={site.status === 'Healthy' ? 'green' : site.status === 'Critical' ? 'red' : 'amber'}>{site.status}</StatusPill><button className="icon-button" onClick={() => showToast(`${site.name} · ${site.id}`)} aria-label="Site details"><MoreHorizontal size={18} /></button></div><div className="site-id">{site.id}</div><h2>{site.name}</h2><p className="site-location"><MapPin size={13} /> {site.location}</p><div className="site-type">{site.type}</div><div className="site-scoreline"><span>Health score</span><strong>{site.health}%</strong></div><div className="health-track big-track"><i className={site.health < 60 ? 'track-red' : site.health < 85 ? 'track-amber' : ''} style={{ width: `${site.health}%` }} /></div><div className="site-stats"><div><span>Assets</span><strong>{site.assets}</strong></div><div><span>Open incidents</span><strong className={site.openIncidents ? 'text-danger' : ''}>{site.openIncidents}</strong></div><div><span>Output</span><strong>{site.output}</strong></div></div><div className="site-card-footer"><span><Clock3 size={13} /> Updated {site.lastUpdate}</span><button onClick={() => { setActive('incidents'); setSearch(site.name); }}>View incidents <ArrowRight size={14} /></button></div></section>)}</div>
          <section className="panel assets-table-panel"><div className="panel-heading"><div><h2>Asset register</h2><p>Equipment tracked in the demo workspace</p></div><button className="button button-secondary" onClick={() => setActive('data')}><FileUp size={15} /> Import assets</button></div><div className="table-scroll"><table><thead><tr><th>ASSET</th><th>TYPE</th><th>SITE</th><th>CONDITION</th><th>LAST SERVICE</th><th>NEXT SERVICE</th></tr></thead><tbody>{assets.map((a) => <tr key={a.id}><td><div className="table-primary">{a.name}</div><div className="table-secondary">{a.id}</div></td><td>{a.type}</td><td>{a.site}</td><td><StatusPill kind={a.condition === 'Healthy' ? 'green' : a.condition === 'Critical' ? 'red' : 'amber'}>{a.condition}</StatusPill></td><td>{a.lastService}</td><td>{a.nextService}</td></tr>)}</tbody></table></div></section>
        </>}

        {active === 'incidents' && <><div className="filterbar"><div className="search-box"><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search incidents, assets, or sites..." /></div><select className="filter-select" value={incidentFilter} onChange={(e) => setIncidentFilter(e.target.value)}><option>All</option><option>Open</option><option>Investigating</option><option>Monitoring</option><option>Resolved</option><option>Critical</option><option>High</option><option>Medium</option></select><button className="button button-secondary" onClick={exportCsv}><Download size={15} /> Export CSV</button></div><section className="panel full-table-panel"><div className="panel-heading"><div><h2>All incidents <span className="count-chip">{filteredIncidents.length}</span></h2><p>Review an incident and update its response status.</p></div><div className="subtle-note"><ShieldCheck size={15} /> Changes are logged</div></div><div className="table-scroll"><table className="incidents-full"><thead><tr><th>INCIDENT</th><th>SITE / ASSET</th><th>SEVERITY</th><th>STATUS</th><th>REPORTED</th><th>ACTION</th></tr></thead><tbody>{filteredIncidents.map((incident) => <tr key={incident.id}><td><div className="table-primary">{incident.title}</div><div className="table-secondary">{incident.id}</div><div className="incident-detail">{incident.detail}</div></td><td><div className="table-primary">{incident.site}</div><div className="table-secondary">{incident.asset}</div></td><td><Severity value={incident.severity} /></td><td><StatusPill kind={incident.status === 'Resolved' ? 'green' : incident.status === 'Open' ? 'red' : incident.status === 'Investigating' ? 'blue' : 'amber'}>{incident.status}</StatusPill></td><td>{incident.time}</td><td><select className="inline-select" aria-label={`Update status for ${incident.id}`} value={incident.status} onChange={(e) => updateIncident(incident.id, { status: e.target.value })}><option>Open</option><option>Investigating</option><option>Monitoring</option><option>Resolved</option></select></td></tr>)}</tbody></table>{filteredIncidents.length === 0 && <EmptyState title="No incidents match" body="Try a different search or reset your filter." />}</div></section><div className="info-strip"><AlertTriangle size={17} /><p><strong>Operational safety:</strong> these are illustrative events, not live alarms. Never use this demo as the sole basis for electrical safety decisions.</p></div></>}

        {active === 'workorders' && <><div className="workorder-summary"><MiniSummary label="Open" value={workOrders.filter((w) => w.status === 'Open').length} color="amber" /><MiniSummary label="In progress" value={workOrders.filter((w) => w.status === 'In progress').length} color="blue" /><MiniSummary label="Overdue" value={workOrders.filter((w) => w.due === 'Overdue' && w.status !== 'Completed').length} color="red" /><MiniSummary label="Completed" value={workOrders.filter((w) => w.status === 'Completed').length} color="green" /></div><section className="panel full-table-panel"><div className="panel-heading"><div><h2>Maintenance queue <span className="count-chip">{workOrders.length}</span></h2><p>Update work status as tasks progress.</p></div><button className="button button-primary" onClick={() => setModal('work')}><Plus size={16} /> Create work order</button></div><div className="table-scroll"><table><thead><tr><th>WORK ORDER</th><th>SITE / ASSET</th><th>PRIORITY</th><th>ASSIGNEE</th><th>DUE</th><th>STATUS</th><th>ACTION</th></tr></thead><tbody>{workOrders.map((work) => <tr key={work.id}><td><div className="table-primary">{work.title}</div><div className="table-secondary">{work.id}</div></td><td><div className="table-primary">{work.site}</div><div className="table-secondary">{work.asset || 'Asset not specified'}</div></td><td><Severity value={work.priority} /></td><td>{work.assignee}</td><td><span className={work.due === 'Overdue' && work.status !== 'Completed' ? 'text-danger due-label' : 'due-label'}>{work.due === 'Overdue' && work.status !== 'Completed' && <AlertCircle size={13} />}{work.due}</span></td><td><StatusPill kind={work.status === 'Completed' ? 'green' : work.status === 'In progress' ? 'blue' : 'amber'}>{work.status}</StatusPill></td><td><select className="inline-select" value={work.status} aria-label={`Update status for ${work.id}`} onChange={(e) => updateWork(work.id, { status: e.target.value })}><option>Open</option><option>In progress</option><option>Completed</option></select></td></tr>)}</tbody></table></div></section><div className="bottom-note"><ClipboardCheck size={15} /><span>Keep work orders aligned with your approved maintenance procedures and safety policies.</span></div></>}

        {active === 'data' && <><div className="data-intro-grid"><section className="panel data-intro"><div className="data-icon"><UploadCloud size={24} /></div><h2>Bring your data into focus</h2><p>Start with an authorized CSV export from your asset register, maintenance log, or incident tracker. Review it here before building a production integration.</p><div className="data-points"><span><Check size={15} /> Preview before processing</span><span><Check size={15} /> Local demo parsing</span><span><Check size={15} /> No live system connection</span></div><button className="button button-primary" onClick={() => fileInput.current?.click()}><FileUp size={16} /> Choose a CSV file</button><input ref={fileInput} type="file" accept=".csv,text/csv" hidden onChange={(e) => handleCsv(e.target.files?.[0])} /><div className="file-note">CSV only · Demo reads the first 1,000 lines · Keep sensitive data out of this prototype</div></section><section className="panel import-guide"><div className="panel-heading"><div><h2>Suggested import workflow</h2><p>A safe starting point for a pilot</p></div><div className="guide-icon"><ShieldCheck size={18} /></div></div><div className="guide-steps"><GuideStep number="01" title="Get written permission" body="Confirm the data owner has approved access and sharing." /><GuideStep number="02" title="Export a limited sample" body="Use non-sensitive data with asset IDs, timestamps, and status fields." /><GuideStep number="03" title="Review the columns" body="Check dates, units, site names, and any missing values." /><GuideStep number="04" title="Validate with an operator" body="Compare the preview against the source before using insights." /></div></section></div><section className="panel preview-panel"><div className="panel-heading"><div><h2>File preview</h2><p>{uploadName ? `Loaded from ${uploadName}` : 'Choose a CSV file to inspect its first rows.'}</p></div>{uploadRows.length > 0 && <button className="button button-secondary" onClick={() => { setUploadName(''); setUploadRows([]); showToast('Preview cleared'); }}><X size={15} /> Clear preview</button>}</div>{uploadRows.length > 0 ? <div className="table-scroll"><table><thead><tr>{uploadRows[0].map((cell, i) => <th key={i}>{cell || `COLUMN ${i + 1}`}</th>)}</tr></thead><tbody>{uploadRows.slice(1, 8).map((row, ri) => <tr key={ri}>{uploadRows[0].map((_, ci) => <td key={ci}>{row[ci] || '—'}</td>)}</tr>)}</tbody></table><div className="preview-footnote">Previewing {Math.max(uploadRows.length - 1, 0)} data row(s) · No records have been saved to a database.</div></div> : <div className="upload-drop" onClick={() => fileInput.current?.click()} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && fileInput.current?.click()}><div className="upload-icon"><FileUp size={22} /></div><strong>CSV preview will appear here</strong><span>Click to choose a file from your computer.</span><button className="text-link">Browse files <ArrowRight size={14} /></button></div>}</section><section className="panel sample-panel"><div><div className="sample-icon"><FileDown size={19} /></div><h3>Need a sample file?</h3><p>Download a small example asset register to see a suggested column structure.</p></div><button className="button button-secondary" onClick={() => { const sample = 'asset_id,asset_name,site,type,condition,last_service,next_service\nINV-001,Inverter INV-001,Ikeja Commercial Hub,Inverter,Healthy,2026-09-29,2026-12-29\nBAT-002,Battery Bank B-02,Lekki Business Park,Battery,Attention,2026-08-10,2026-11-10'; const url = URL.createObjectURL(new Blob([sample], { type: 'text/csv' })); const a = document.createElement('a'); a.href = url; a.download = 'gridsentinel-sample-assets.csv'; a.click(); URL.revokeObjectURL(url); showToast('Sample CSV downloaded'); }}><Download size={15} /> Download sample CSV</button></section></>}

        {active === 'audit' && <><div className="audit-stats"><MiniSummary label="Recorded actions" value={audit.length} color="green" /><MiniSummary label="Workspace" value="Demo" color="blue" /><MiniSummary label="Access mode" value="Local" color="amber" /></div><section className="panel full-table-panel"><div className="panel-heading"><div><h2>Recent activity</h2><p>Actions captured by this local demo interface.</p></div><div className="subtle-note"><ShieldCheck size={15} /> Audit history</div></div><div className="table-scroll"><table><thead><tr><th>ACTION</th><th>TARGET</th><th>USER</th><th>TIME</th></tr></thead><tbody>{audit.map((entry) => <tr key={entry.id}><td><div className="audit-action"><span className="audit-dot"><Check size={13} /></span><strong>{entry.action}</strong></div></td><td><code className="target-code">{entry.target}</code></td><td><div className="audit-user"><div className="mini-avatar">{entry.user === 'You' ? 'JD' : 'OT'}</div>{entry.user}</div></td><td className="audit-time">{entry.time}</td></tr>)}</tbody></table></div></section><div className="info-strip"><ShieldCheck size={17} /><p>This is a browser-session audit demo, not a tamper-proof security log. Production deployments need server-side logging, identity controls, access reviews, and durable storage.</p></div></>}
      </div>
      <footer className="app-footer"><span>© 2026 GridSentinel Ops</span><span><i /> Demo workspace</span><span>Infrastructure intelligence, made actionable.</span></footer>
    </main>

    {modal === 'work' && <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setModal('')}><div className="modal-card"><div className="modal-heading"><div><div className="eyebrow">MAINTENANCE MANAGEMENT</div><h2>Create work order</h2><p>Assign a task and keep the next step visible.</p></div><button className="icon-button" onClick={() => setModal('')} aria-label="Close"><X size={19} /></button></div><form onSubmit={createWorkOrder} className="work-form"><label>Work order title<input required autoFocus value={newWork.title} onChange={(e) => setNewWork({ ...newWork, title: e.target.value })} placeholder="e.g. Inspect inverter cooling fan" /></label><div className="form-two"><label>Site<select value={newWork.site} onChange={(e) => setNewWork({ ...newWork, site: e.target.value })}>{sites.map((s) => <option key={s.id}>{s.name}</option>)}</select></label><label>Asset / equipment<input value={newWork.asset} onChange={(e) => setNewWork({ ...newWork, asset: e.target.value })} placeholder="e.g. INV-04" /></label></div><div className="form-two"><label>Priority<select value={newWork.priority} onChange={(e) => setNewWork({ ...newWork, priority: e.target.value })}><option>Normal</option><option>High</option><option>Urgent</option></select></label><label>Due date<select value={newWork.due} onChange={(e) => setNewWork({ ...newWork, due: e.target.value })}><option>Today</option><option>Tomorrow</option><option>This week</option><option>Overdue</option></select></label></div><label>Assignee<input value={newWork.assignee} onChange={(e) => setNewWork({ ...newWork, assignee: e.target.value })} placeholder="Name or Unassigned" /></label><div className="modal-actions"><button type="button" className="button button-secondary" onClick={() => setModal('')}>Cancel</button><button type="submit" className="button button-primary"><Plus size={16} /> Create work order</button></div></form></div></div>}
    {toast && <div className="toast"><div><CheckCircle2 size={17} /></div><span>{toast}</span><button onClick={() => setToast('')} aria-label="Dismiss notification"><X size={15} /></button></div>}
  </div>;
}

function MetricCard({ label, value, note, icon: Icon, color, trend }) { return <section className="panel metric-card"><div className="metric-top"><span>{label}</span><div className={`metric-icon metric-${color}`}><Icon size={18} /></div></div><div className="metric-value">{value}</div><div className="metric-note">{note}</div><div className={`metric-trend trend-${color}`}><span>{color === 'green' ? <ArrowUpRight size={14} /> : color === 'red' ? <AlertCircle size={13} /> : color === 'amber' ? <AlertTriangle size={13} /> : <Wrench size={13} />}</span>{trend}</div></section>; }
function MiniSummary({ label, value, color }) { return <section className="panel mini-summary"><div className={`mini-summary-icon metric-${color}`}>{color === 'red' ? <AlertCircle size={17} /> : color === 'amber' ? <Clock3 size={17} /> : color === 'blue' ? <Activity size={17} /> : <CheckCircle2 size={17} />}</div><div><span>{label}</span><strong>{value}</strong></div></section>; }
function GuideStep({ number, title, body }) { return <div className="guide-step"><div>{number}</div><section><strong>{title}</strong><p>{body}</p></section></div>; }
