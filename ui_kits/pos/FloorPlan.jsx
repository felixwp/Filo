/* Filo POS — floor plan.
   Two views of the same room:
   • PLAN (default) — a scaled-down map of the actual venue. Walls, bar, kitchen
     pass and entrance are drawn to scale; each table is rendered as its real
     footprint (round / square / banquette) with chairs, placed where it sits in
     the room. This is what a server actually reads — the screen matches the floor.
   • GRID — the uniform tile board (capacity + status at a glance), kept as an option.
   Per-venue note: plan coordinates live in PLAN_LAYOUT below, so each restaurant
   can drop in their own room shape and table positions without touching the rest. */

/* ---------- status language (shared by both views) ---------- */
const STATUS = {
  occupied: { ring: '#1f8a50', glow: 'rgba(31,138,80,0.30)', fill: 'rgba(31,138,80,0.16)', label: 'Seated' },
  ordering: { ring: '#D2661C', glow: 'rgba(210,102,28,0.30)', fill: 'rgba(210,102,28,0.16)', label: 'Ordering' },
  bill:     { ring: '#E0AB3A', glow: 'rgba(224,171,58,0.32)', fill: 'rgba(224,171,58,0.16)', label: 'Bill' },
  available:{ ring: 'var(--border-cream)', glow: 'none', fill: 'transparent', label: 'Open' },
};

/* ===================== GRID VIEW (tiles) ===================== */
function TableTile({ t, onOpen }) {
  const s = STATUS[t.status];
  const available = t.status === 'available';
  const [press, setPress] = React.useState(false);
  return (
    <button
      onMouseDown={() => setPress(true)} onMouseUp={() => setPress(false)} onMouseLeave={() => setPress(false)}
      onClick={() => onOpen(t)}
      style={{ position: 'relative', boxSizing: 'border-box', width: '100%', height: 122, padding: 14, textAlign: 'left', cursor: 'pointer',
        gridColumn: t.shape === 'rect' ? 'span 2' : 'span 1',
        background: 'var(--filo-surface)', borderRadius: t.shape === 'round' ? 22 : 16,
        border: `${available ? 0.5 : 1.5}px solid ${s.ring}`, boxShadow: available ? 'none' : `inset 0 0 24px ${s.glow}`,
        transform: press ? 'scale(0.97)' : 'scale(1)', transition: 'transform .1s var(--ease-out)' }}>
      {t.birthday && <div style={{ position: 'absolute', top: 12, right: 12, width: 9, height: 9, borderRadius: 999, background: 'var(--filo-gold)', boxShadow: '0 0 8px rgba(201,146,30,0.8)' }} />}
      <div style={{ font: 'var(--text-h1)', color: available ? 'var(--fg-2)' : 'var(--fg-1)' }}>{t.num}</div>
      <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginTop: 2 }}>{available ? `${t.seats} PAX` : `${t.covers} PAX`}</div>
      <div style={{ position: 'absolute', left: 14, bottom: 12 }}>
        <Pill tone={t.status}>{t.status === 'bill' ? 'Bill' : t.status === 'available' ? 'Open' : t.status}</Pill>
      </div>
      {!available && t.status !== 'bill' && <div style={{ position: 'absolute', right: 14, bottom: 14, font: 'var(--text-label)', color: 'var(--fg-3)', fontVariantNumeric: 'tabular-nums' }}>{Math.floor(t.mins / 60)}:{String(t.mins % 60).padStart(2, '0')}</div>}
      {t.status === 'bill' && <div style={{ position: 'absolute', right: 14, bottom: 12 }}><Money amount={t.bill} size={18} /></div>}
    </button>
  );
}

function GridView({ tables, onOpenTable }) {
  const zones = [
    { label: 'Window', band: t => t.y < 200 },
    { label: 'Main dining', band: t => t.y >= 200 && t.y < 410 },
    { label: 'Booths', band: t => t.y >= 410 },
  ];
  return (
    <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', background: 'radial-gradient(circle at 30% 20%, rgba(20,99,58,0.06), transparent 60%)', padding: 24 }}>
      {zones.map(zone => (
        <div key={zone.label} style={{ marginBottom: 28 }}>
          <div style={{ font: 'var(--text-pill)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-4)', marginBottom: 14 }}>{zone.label}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 140px)', gap: 14, alignItems: 'start', justifyContent: 'start' }}>
            {tables.filter(zone.band).map(t => <TableTile key={t.id} t={t} onOpen={onOpenTable} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ===================== PLAN VIEW (real room) ===================== */
/* Design canvas the room is drawn in; scaled to fit the viewport. */
const ROOM_W = 760, ROOM_H = 600;

/* Per-venue layout. Coordinates are CENTRE points in the ROOM_W×ROOM_H canvas.
   A restaurant customising their plan only edits this block + the architecture. */
const PLAN_LAYOUT = {
  1:  { x: 95,  y: 92 },  2:  { x: 205, y: 92 },  3:  { x: 320, y: 88 },
  4:  { x: 455, y: 88 },  5:  { x: 588, y: 92 },
  8:  { x: 108, y: 290 }, 9:  { x: 330, y: 290 }, 10: { x: 520, y: 290 }, 12: { x: 625, y: 290 },
  14: { x: 205, y: 478 }, 15: { x: 430, y: 478 }, 16: { x: 575, y: 478 },
};

/* footprint of each table in the room canvas */
function tableDims(t) {
  if (t.shape === 'round') return t.seats <= 2 ? { w: 52, h: 52 } : { w: 66, h: 66 };
  if (t.shape === 'square') return { w: 66, h: 66 };
  return t.seats >= 8 ? { w: 168, h: 70 } : { w: 132, h: 66 }; // rect / banquette
}

/* chair positions (local coords, origin = table centre) */
function chairsFor(t, w, h) {
  const out = [];
  if (t.shape === 'round') {
    const R = w / 2 + 13, n = t.seats;
    for (let i = 0; i < n; i++) {
      const a = (-90 + i * (360 / n)) * Math.PI / 180;
      out.push({ x: Math.cos(a) * R, y: Math.sin(a) * R, rot: (a * 180 / Math.PI) + 90 });
    }
  } else {
    const top = Math.ceil(t.seats / 2), bot = t.seats - top;
    const edge = (count, ey) => { for (let i = 0; i < count; i++) out.push({ x: -w / 2 + (w / (count + 1)) * (i + 1), y: ey, rot: 0 }); };
    edge(top, -h / 2 - 12); edge(bot, h / 2 + 12);
  }
  return out;
}

function PlanTable({ t, onOpen }) {
  const s = STATUS[t.status];
  const available = t.status === 'available';
  const { w, h } = tableDims(t);
  const chairs = chairsFor(t, w, h);
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const radius = t.shape === 'round' ? '50%' : 14;
  const p = PLAN_LAYOUT[t.num];
  return (
    <div style={{ position: 'absolute', left: p.x, top: p.y, transform: 'translate(-50%,-50%)', width: w, height: h }}>
      {/* chairs */}
      {chairs.map((c, i) => (
        <div key={i} style={{ position: 'absolute', left: '50%', top: '50%', width: 22, height: 11, borderRadius: 6,
          background: 'var(--filo-surface-2)', border: '0.5px solid rgba(245,239,228,0.16)',
          transform: `translate(-50%,-50%) translate(${c.x}px,${c.y}px) rotate(${c.rot}deg)` }} />
      ))}
      {/* tabletop */}
      <button onClick={() => onOpen(t)}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setPress(false); }}
        onMouseDown={() => setPress(true)} onMouseUp={() => setPress(false)}
        style={{ position: 'absolute', inset: 0, cursor: 'pointer', borderRadius: radius,
          background: available ? 'var(--filo-surface)' : s.fill,
          border: `${available ? 0.5 : 1.5}px solid ${s.ring}`,
          boxShadow: `${available ? 'none' : `inset 0 0 18px ${s.glow}`}${hover ? ', 0 0 0 3px rgba(245,239,228,0.10)' : ''}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 1,
          transform: press ? 'scale(0.93)' : 'scale(1)',
          transition: 'box-shadow .12s var(--ease-out), transform .1s var(--ease-out)' }}>
        <span style={{ font: 'var(--text-h2)', fontWeight: 600, color: available ? 'var(--fg-2)' : 'var(--fg-1)', lineHeight: 1 }}>{t.num}</span>
        {!available && <span style={{ font: 'var(--text-micro)', color: 'rgba(245,239,228,0.6)', fontVariantNumeric: 'tabular-nums' }}>
          {t.status === 'bill' ? fmtAUD(t.bill) : `${t.covers} · ${Math.floor(t.mins / 60)}:${String(t.mins % 60).padStart(2, '0')}`}
        </span>}
      </button>
      {t.birthday && <div style={{ position: 'absolute', top: -3, right: -3, width: 10, height: 10, borderRadius: 999, background: 'var(--filo-gold)', boxShadow: '0 0 8px rgba(201,146,30,0.9)' }} />}
    </div>
  );
}

/* scale the fixed room canvas to fit whatever space it's given */
function useFitScale(designW, designH) {
  const ref = React.useRef(null);
  const [scale, setScale] = React.useState(1);
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setScale(Math.min(r.width / designW, r.height / designH));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [designW, designH]);
  return [ref, scale];
}

function PlanView({ tables, onOpenTable }) {
  const [ref, scale] = useFitScale(ROOM_W, ROOM_H);
  const wallC = 'rgba(245,239,228,0.22)';
  const labelStyle = { font: 'var(--text-micro)', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-4)' };
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, padding: 24, background: 'radial-gradient(circle at 40% 30%, rgba(20,99,58,0.06), transparent 65%)' }}>
      <div ref={ref} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
        <div style={{ width: ROOM_W, height: ROOM_H, transform: `scale(${scale})`, transformOrigin: 'center', position: 'relative', flexShrink: 0,
          background: 'linear-gradient(180deg, rgba(245,239,228,0.03), rgba(245,239,228,0.012))',
          border: `2px solid ${wallC}`, borderRadius: 8 }}>
          {/* faint plank floor */}
          <div style={{ position: 'absolute', inset: 0, borderRadius: 6, opacity: 0.5,
            backgroundImage: 'repeating-linear-gradient(90deg, transparent 0 94px, rgba(245,239,228,0.05) 94px 95px)' }} />

          {/* kitchen pass — top-left */}
          <div style={{ position: 'absolute', left: 18, top: 14, width: 208, height: 30, borderRadius: 6,
            background: 'rgba(20,99,58,0.20)', border: `0.5px solid ${wallC}`, display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 12 }}>
            <Icon name="utensils" size={13} color="var(--fg-3)" />
            <span style={{ ...labelStyle, whiteSpace: 'nowrap' }}>Kitchen · Pass</span>
          </div>

          {/* bar — right wall */}
          <div style={{ position: 'absolute', right: 14, top: 70, width: 56, height: 408, borderRadius: 10,
            background: 'rgba(245,239,228,0.05)', border: `0.5px solid ${wallC}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ ...labelStyle, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Bar</span>
          </div>
          {/* bar stools */}
          {[110, 175, 240, 305, 370, 435].map(y => (
            <div key={y} style={{ position: 'absolute', right: 76, top: y, width: 12, height: 12, borderRadius: 999, background: 'var(--filo-surface-2)', border: '0.5px solid rgba(245,239,228,0.16)' }} />
          ))}

          {/* host stand + entrance — bottom centre */}
          <div style={{ position: 'absolute', left: '50%', bottom: -2, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 120, height: 0, borderTop: `3px solid var(--filo-bg)` }} />
            <span style={labelStyle}>Entrance</span>
          </div>
          <div style={{ position: 'absolute', left: 'calc(50% - 96px)', bottom: 16, width: 40, height: 22, borderRadius: 5, background: 'rgba(245,239,228,0.06)', border: `0.5px solid ${wallC}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="user" size={12} color="var(--fg-4)" />
          </div>

          {/* section dividers (subtle) */}
          <div style={{ position: 'absolute', left: 24, right: 84, top: 178, borderTop: '1px dashed rgba(245,239,228,0.08)' }} />
          <div style={{ position: 'absolute', left: 24, right: 84, top: 388, borderTop: '1px dashed rgba(245,239,228,0.08)' }} />

          {/* tables */}
          {tables.map(t => PLAN_LAYOUT[t.num] ? <PlanTable key={t.id} t={t} onOpen={onOpenTable} /> : null)}
        </div>
      </div>

      {/* legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, paddingTop: 14, flexWrap: 'wrap' }}>
        {Object.entries(STATUS).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 12, height: 12, borderRadius: 4, background: k === 'available' ? 'transparent' : v.fill, border: `1.5px solid ${v.ring}` }} />
            <span style={{ font: 'var(--text-label)', color: 'var(--fg-3)' }}>{v.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===================== shared chrome ===================== */
function ReminderItem({ icon, color, title, sub, onClick }) {
  const [h, setH] = React.useState(false);
  const [p, setP] = React.useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => { setH(false); setP(false); }}
      onMouseDown={() => setP(true)} onMouseUp={() => setP(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', cursor: 'pointer',
        background: h ? 'var(--filo-surface-2)' : 'var(--filo-surface)', border: '0.5px solid var(--border-green)', borderRadius: 12, padding: '12px 14px',
        transform: p ? 'scale(0.97)' : 'scale(1)',
        transition: 'background .15s, transform .1s var(--ease-out)' }}>
      <Icon name={icon} size={20} color={color} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
        <span style={{ font: 'var(--text-h3)' }}>{title}</span>
        <span style={{ font: 'var(--text-label)', color: 'var(--fg-3)' }}>{sub}</span>
      </div>
      <Icon name="chevron-right" size={18} color="var(--fg-4)" />
    </button>
  );
}

function ViewToggle({ view, setView }) {
  const opt = (key, label, icon) => {
    const on = view === key;
    return (
      <button onClick={() => setView(key)}
        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, cursor: 'pointer', border: 'none',
          background: on ? 'var(--filo-surface-2)' : 'transparent', color: on ? 'var(--fg-1)' : 'var(--fg-3)',
          font: 'var(--text-label)', fontWeight: on ? 600 : 500, transition: 'background .12s, color .12s' }}>
        <Icon name={icon} size={15} color={on ? 'var(--fg-1)' : 'var(--fg-4)'} /> {label}
      </button>
    );
  };
  return (
    <div style={{ display: 'flex', gap: 2, padding: 3, borderRadius: 11, background: 'var(--filo-surface)', border: '0.5px solid var(--border-cream)' }}>
      {opt('plan', 'Plan', 'map')}
      {opt('grid', 'Grid', 'layout-grid')}
    </div>
  );
}

function FloorPlan({ user, onOpenTable, reminders, onLogout }) {
  const { tables } = window.FILO_DATA;
  const [view, setView] = React.useState('plan');
  const [outHover, setOutHover] = React.useState(false);
  const available = tables.filter(t => t.status === 'available').length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0 }}>
      <TopBar title="Floor plan" subtitle={`${user.name} · ${user.section}`}
        right={<>
          <ViewToggle view={view} setView={setView} />
          <Pill tone="neutral">{available} open</Pill>
          <Pill tone="neutral">Happy hour · 5–7</Pill>
          <span style={{ width: 0.5, height: 26, background: 'var(--border-cream)', margin: '0 2px' }} />
          <button onClick={onLogout} onMouseEnter={() => setOutHover(true)} onMouseLeave={() => setOutHover(false)}
            title="End shift — switch user"
            style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 8px 6px 6px', borderRadius: 999, cursor: 'pointer', whiteSpace: 'nowrap',
              background: outHover ? 'rgba(158,59,46,0.14)' : 'var(--filo-surface)', border: `0.5px solid ${outHover ? 'rgba(158,59,46,0.5)' : 'var(--border-cream)'}`, transition: 'background .15s, border-color .15s' }}>
            <span style={{ width: 30, height: 30, borderRadius: 999, background: 'var(--filo-green)', color: 'var(--fg-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: 'var(--text-micro)', fontWeight: 700, flexShrink: 0 }}>{user.initials}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, font: 'var(--text-label)', fontWeight: 600, color: outHover ? '#d9806f' : 'var(--fg-2)', paddingRight: 4, whiteSpace: 'nowrap' }}>
              <Icon name="log-out" size={15} color={outHover ? '#d9806f' : 'var(--fg-3)'} /> Switch user
            </span>
          </button>
        </>} />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {view === 'plan'
          ? <PlanView tables={tables} onOpenTable={onOpenTable} />
          : <GridView tables={tables} onOpenTable={onOpenTable} />}
        {/* reminders sidebar */}
        <div style={{ width: 290, borderLeft: '0.5px solid var(--border-cream)', padding: 18, display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0, overflowY: 'auto' }}>
          <div style={{ font: 'var(--text-pill)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="bell" size={15} color="var(--fg-3)" /> Course away
          </div>
          {reminders.map((r, i) => <ReminderItem key={i} {...r} onClick={() => onOpenTable(window.FILO_DATA.tables.find(t => t.num === r.table))} />)}
          <div style={{ font: 'var(--text-pill)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)', display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <Icon name="gift" size={15} color="var(--filo-gold)" /> Tonight
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--filo-surface)', border: '0.5px solid rgba(201,146,30,0.35)', borderRadius: 12, padding: '12px 14px' }}>
            <Icon name="cake" size={20} color="var(--filo-gold)" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ font: 'var(--text-h3)' }}>Birthday · T12</span>
              <span style={{ font: 'var(--text-label)', color: 'var(--fg-3)' }}>Dessert on the house</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
window.FloorPlan = FloorPlan;
