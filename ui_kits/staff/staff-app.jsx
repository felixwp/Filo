/* Filo — Staff personal app. iPhone portrait, 390×844. */

const STAFF_LIGHT_VARS = {
  '--filo-black':    '#F0EAE0',
  '--filo-surface':  '#FFFFFF',
  '--filo-surface-2':'#F5EFE4',
  '--filo-surface-3':'#EDE7DC',
  '--fg-1':  '#0A0A0A',
  '--fg-2':  'rgba(10,10,10,0.75)',
  '--fg-3':  'rgba(10,10,10,0.50)',
  '--fg-4':  'rgba(10,10,10,0.28)',
  '--fg-on-green': '#F5EFE4',
  '--border-cream':   'rgba(10,10,10,0.12)',
  '--border-cream-2': 'rgba(10,10,10,0.25)',
  '--border-green':   'rgba(13,74,40,0.30)',
  '--glass-bg': 'rgba(240,234,224,0.88)',
};

/* ── Local primitives ────────────────────────────────────────────────────── */

function SIcon({ name, size = 22, color = 'currentColor', strokeWidth = 2 }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (el && window.lucide) {
      el.innerHTML = `<i data-lucide="${name}"></i>`;
      window.lucide.createIcons({ attrs: { 'stroke-width': strokeWidth } });
      const svg = el.querySelector('svg');
      if (svg) { svg.style.width = '100%'; svg.style.height = '100%'; svg.removeAttribute('width'); svg.removeAttribute('height'); }
    }
  });
  return <span ref={ref} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, color, flexShrink: 0 }} />;
}

function SCard({ children, accent, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{ background: 'var(--filo-surface)', border: accent ? '0.5px solid var(--border-green)' : '0.5px solid var(--border-cream)', borderRadius: 16, padding: 18, cursor: onClick ? 'pointer' : undefined, ...style }}>
      {children}
    </div>
  );
}

function SPill({ children, tone = 'neutral' }) {
  const tones = {
    green:   { bg: 'rgba(20,99,58,0.22)',   fg: '#5cc88a' },
    gold:    { bg: 'rgba(201,146,30,0.20)',  fg: '#d8a73a' },
    neutral: { bg: 'var(--filo-surface-3)', fg: 'var(--fg-3)' },
    amber:   { bg: 'rgba(201,122,30,0.20)', fg: '#e0973f' },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 999, background: t.bg, color: t.fg, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      {children}
    </span>
  );
}

/* onClick-based press button — click always fires before the animation */
function SPressButton({ onClick, style = {}, children }) {
  const [pressed, setPressed] = React.useState(false);
  const handle = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 200);
    onClick && onClick();
  };
  return (
    <button onClick={handle}
      style={{ ...style, transform: pressed ? 'scale(0.94)' : 'scale(1)', transition: 'transform .18s var(--ease-out), background .15s, border-color .15s' }}>
      {children}
    </button>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function fmtElapsed(mins) {
  if (mins < 1) return 'Just started';
  const h = Math.floor(mins / 60), m = mins % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/* ── Data ────────────────────────────────────────────────────────────────── */

const ME = { name: 'Marco Bellini', role: 'Front of house', section: 'Bar', initials: 'MB' };

const SHIFTS = [
  { date: 'Today',    day: 'Tue 3 Jun',  time: '18:00 – 23:00', section: 'Bar',       confirmed: true  },
  { date: 'Thursday', day: 'Thu 5 Jun',  time: '18:00 – 23:00', section: 'Bar',       confirmed: true  },
  { date: 'Saturday', day: 'Sat 7 Jun',  time: '12:00 – 17:00', section: 'Section B', confirmed: false },
  { date: 'Next Tue', day: 'Tue 10 Jun', time: '18:00 – 23:00', section: 'Bar',       confirmed: true  },
  { date: 'Next Thu', day: 'Thu 12 Jun', time: '18:00 – 23:00', section: 'Bar',       confirmed: true  },
];

const MESSAGES = [
  { id: 1, from: 'Tom Hayes',  role: 'Manager',   text: 'Section A starts with tables 1–5 tonight. Birthday on 12.',                       time: '17:42', unread: true,  initials: 'TH' },
  { id: 2, from: 'Priya Nair', role: 'Sommelier', text: "We've got a new Assyrtiko on by the glass — I'll run you through it before service.", time: '16:58', unread: true,  initials: 'PN' },
  { id: 3, from: 'Section A',  role: 'Group',     text: 'Aoife: anyone want to swap Saturday?',                                              time: '15:30', unread: false, initials: 'SA', group: true },
  { id: 4, from: 'Tom Hayes',  role: 'Manager',   text: "Roster for next week is up. Let me know if anything clashes.",                       time: 'Yesterday', unread: false, initials: 'TH' },
];

const PAYSLIP = {
  weekEnding: 'Sat 7 Jun 2026',
  hours: 28.5, rate: 28.50, gross: 812.25, tips: 153.00, tax: 182.76, net: 782.49,
};

const BREAK_MINS = 330; // 5.5h

/* ── Home tab ────────────────────────────────────────────────────────────── */

function HomeTab({ shiftStart, shiftMins, onStartShift, onEndShift, onTabChange }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const nextShift = SHIFTS[0];
  const unreadCount = MESSAGES.filter(m => m.unread).length;
  const breakDue = shiftStart && shiftMins >= BREAK_MINS;

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '0 20px 32px' }}>
      {/* Greeting */}
      <div style={{ paddingTop: 52, marginBottom: 24 }}>
        <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginBottom: 4 }}>{greeting}</div>
        <div style={{ font: 'var(--text-h1)', fontSize: 26 }}>{ME.name.split(' ')[0]}</div>
      </div>

      {/* ── On shift card (active) ── */}
      {shiftStart ? (
        <SCard accent style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginBottom: 4 }}>On shift</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 32, color: 'var(--filo-gold)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                {fmtElapsed(shiftMins)}
              </div>
            </div>
            <SPill tone="green">
              <span style={{ width: 6, height: 6, borderRadius: 999, background: '#5cc88a', display: 'inline-block' }} />
              Live
            </SPill>
          </div>
          <div style={{ display: 'flex', gap: 18, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <SIcon name="clock" size={15} color="var(--fg-3)" />
              <span style={{ font: 'var(--text-label)', color: 'var(--fg-2)' }}>{nextShift.time}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <SIcon name="layout-grid" size={15} color="var(--fg-3)" />
              <span style={{ font: 'var(--text-label)', color: 'var(--fg-2)' }}>{nextShift.section}</span>
            </div>
          </div>
          {breakDue && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, background: 'rgba(201,122,30,0.12)', border: '0.5px solid rgba(201,122,30,0.35)', marginBottom: 12 }}>
              <SIcon name="clock" size={15} color="#e0973f" />
              <span style={{ font: 'var(--text-label)', color: 'var(--fg-1)', fontSize: 13 }}>
                Break due — {shiftMins >= BREAK_MINS + 30 ? 'overdue now.' : `within ${BREAK_MINS + 30 - shiftMins} min.`}
              </span>
            </div>
          )}
          <SPressButton onClick={onEndShift}
            style={{ width: '100%', padding: '11px 0', borderRadius: 10, background: 'transparent', border: '0.5px solid rgba(158,59,46,0.5)', color: '#d9806f', font: 'var(--text-label)', fontWeight: 700, cursor: 'pointer' }}>
            End shift
          </SPressButton>
        </SCard>
      ) : (
        /* ── Start shift card (not yet clocked in) ── */
        <SCard style={{ marginBottom: 14 }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginBottom: 4 }}>Today's shift</div>
            <div style={{ font: 'var(--text-h2)', fontSize: 22, marginBottom: 10 }}>{nextShift.time}</div>
            <div style={{ display: 'flex', gap: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <SIcon name="layout-grid" size={15} color="var(--fg-3)" />
                <span style={{ font: 'var(--text-label)', color: 'var(--fg-2)' }}>{nextShift.section}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <SIcon name="map-pin" size={15} color="#5cc88a" />
                <span style={{ font: 'var(--text-label)', color: '#5cc88a' }}>In range</span>
              </div>
            </div>
          </div>
          <SPressButton onClick={onStartShift}
            style={{ width: '100%', padding: '13px 0', borderRadius: 10, background: 'var(--filo-green)', border: 'none', color: 'var(--fg-1)', font: 'var(--text-label)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <SIcon name="play" size={16} color="var(--fg-1)" />
            Start shift
          </SPressButton>
        </SCard>
      )}

      {/* Pay this week */}
      <SCard style={{ marginBottom: 14 }} onClick={() => onTabChange('pay')}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)' }}>This week's pay</div>
          <SIcon name="chevron-right" size={18} color="var(--filo-green)" />
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 26, color: 'var(--filo-gold)', fontVariantNumeric: 'tabular-nums' }}>A${PAYSLIP.net.toFixed(2)}</div>
            <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginTop: 3 }}>Net · {PAYSLIP.hours}h worked</div>
          </div>
          <div style={{ width: '0.5px', background: 'var(--border-cream)' }} />
          <div>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 26, color: '#d8a73a', fontVariantNumeric: 'tabular-nums' }}>A${PAYSLIP.tips.toFixed(2)}</div>
            <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginTop: 3 }}>Tips pooled</div>
          </div>
        </div>
      </SCard>

      {/* Messages */}
      <SCard style={{ marginBottom: 14 }} onClick={() => onTabChange('messages')}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)' }}>Messages</div>
            {unreadCount > 0 && (
              <span style={{ width: 20, height: 20, borderRadius: 999, background: 'var(--filo-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--fg-1)' }}>{unreadCount}</span>
            )}
          </div>
          <SIcon name="chevron-right" size={18} color="var(--fg-4)" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {MESSAGES.filter(m => m.unread).map(m => (
            <div key={m.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: 999, background: m.group ? 'var(--filo-surface-3)' : 'var(--filo-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--fg-1)', flexShrink: 0 }}>
                {m.group ? <SIcon name="users" size={16} color="var(--fg-2)" /> : m.initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ font: 'var(--text-label)', fontWeight: 700, color: 'var(--fg-1)' }}>{m.from}</span>
                  <span style={{ font: 'var(--text-label)', color: 'var(--fg-4)', fontSize: 12 }}>{m.time}</span>
                </div>
                <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.text}</div>
              </div>
            </div>
          ))}
        </div>
      </SCard>

      {/* Upcoming shifts */}
      <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: 11, marginBottom: 10 }}>Upcoming</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {SHIFTS.slice(1, 4).map(s => (
          <div key={s.day} style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', borderRadius: 12, background: 'var(--filo-surface)', border: '0.5px solid var(--border-cream)', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ font: 'var(--text-label)', fontWeight: 700, color: 'var(--fg-1)' }}>{s.day}</div>
              <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginTop: 2 }}>{s.time} · {s.section}</div>
            </div>
            {s.confirmed ? <SPill tone="green">Confirmed</SPill> : <SPill tone="amber">Pending</SPill>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Roster tab ──────────────────────────────────────────────────────────── */

function RosterTab() {
  const weeks = ['This week', 'Next week'];
  const [week, setWeek] = React.useState('This week');
  const [shiftStates, setShiftStates] = React.useState({});
  const [leaveOpen, setLeaveOpen] = React.useState(false);
  const [leaveSent, setLeaveSent] = React.useState(false);
  const [swapOpen,  setSwapOpen]  = React.useState(false);
  const [swapSent,  setSwapSent]  = React.useState(false);
  const shifts = week === 'This week' ? SHIFTS.slice(0, 3) : SHIFTS.slice(2);

  const respond = (day, accepted) => {
    setShiftStates(s => ({ ...s, [day]: accepted ? 'accepted' : 'declined' }));
  };

  const submitLeave = () => { setLeaveSent(true); setTimeout(() => { setLeaveOpen(false); setLeaveSent(false); }, 1800); };

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '0 20px 32px' }}>
      <div style={{ paddingTop: 52, marginBottom: 20 }}>
        <div style={{ font: 'var(--text-h1)', fontSize: 24, marginBottom: 16 }}>Roster</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {weeks.map(w => (
            <SPressButton key={w} onClick={() => setWeek(w)}
              style={{ padding: '8px 16px', borderRadius: 999, border: 'none', cursor: 'pointer', font: 'var(--text-label)', fontWeight: week === w ? 700 : 400, background: week === w ? 'var(--filo-green)' : 'var(--filo-surface)', color: week === w ? 'var(--fg-1)' : 'var(--fg-3)' }}>
              {w}
            </SPressButton>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {shifts.map(s => {
          const state = shiftStates[s.day];
          const isPending = !s.confirmed && !state;
          const isAccepted = s.confirmed || state === 'accepted';
          const isDeclined = state === 'declined';
          return (
            <SCard key={s.day} style={{ opacity: isDeclined ? 0.5 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: isPending ? 14 : 0 }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: isAccepted ? 'rgba(13,74,40,0.25)' : isDeclined ? 'rgba(158,59,46,0.15)' : 'var(--filo-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <SIcon name="calendar" size={20} color={isAccepted ? '#5cc88a' : isDeclined ? '#d9806f' : 'var(--fg-3)'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ font: 'var(--text-h3)', color: 'var(--fg-1)', marginBottom: 4 }}>{s.day}</div>
                  <div style={{ display: 'flex', gap: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <SIcon name="clock" size={13} color="var(--fg-3)" />
                      <span style={{ font: 'var(--text-label)', color: 'var(--fg-3)', fontSize: 13 }}>{s.time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <SIcon name="layout-grid" size={13} color="var(--fg-3)" />
                      <span style={{ font: 'var(--text-label)', color: 'var(--fg-3)', fontSize: 13 }}>{s.section}</span>
                    </div>
                  </div>
                </div>
                {isAccepted && <SPill tone="green">Confirmed</SPill>}
                {isDeclined && <SPill tone="neutral">Declined</SPill>}
                {isPending  && <SPill tone="amber">Pending</SPill>}
              </div>

              {/* Accept / decline for pending shifts */}
              {isPending && (
                <div style={{ display: 'flex', gap: 10 }}>
                  <SPressButton onClick={() => respond(s.day, true)}
                    style={{ flex: 1, padding: '10px 0', borderRadius: 10, background: 'var(--filo-green)', border: 'none', color: 'var(--fg-1)', font: 'var(--text-label)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                    <SIcon name="check" size={15} color="var(--fg-1)" />
                    Accept
                  </SPressButton>
                  <SPressButton onClick={() => respond(s.day, false)}
                    style={{ flex: 1, padding: '10px 0', borderRadius: 10, background: 'transparent', border: '0.5px solid rgba(158,59,46,0.5)', color: '#d9806f', font: 'var(--text-label)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                    <SIcon name="x" size={15} color="#d9806f" />
                    Decline
                  </SPressButton>
                </div>
              )}
            </SCard>
          );
        })}
      </div>

      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <SPressButton onClick={() => setSwapOpen(true)}
          style={{ width: '100%', padding: '14px 0', borderRadius: 12, background: 'transparent', border: '0.5px solid var(--border-cream-2)', color: 'var(--fg-2)', font: 'var(--text-label)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <SIcon name="refresh-cw" size={16} color="var(--fg-3)" />
          Request shift swap
        </SPressButton>
        <SPressButton onClick={() => setLeaveOpen(true)}
          style={{ width: '100%', padding: '14px 0', borderRadius: 12, background: 'transparent', border: '0.5px solid var(--border-cream-2)', color: 'var(--fg-2)', font: 'var(--text-label)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <SIcon name="calendar-off" size={16} color="var(--fg-3)" />
          Request leave
        </SPressButton>
      </div>

      {/* Shift swap sheet */}
      {swapOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'flex-end', zIndex: 50 }} onClick={() => setSwapOpen(false)}>
          <div style={{ width: '100%', background: 'var(--filo-surface)', borderRadius: '20px 20px 0 0', padding: '24px 20px 40px', border: '0.5px solid var(--border-cream)' }} onClick={e => e.stopPropagation()}>
            <div style={{ font: 'var(--text-h2)', marginBottom: 4 }}>Request shift swap</div>
            <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginBottom: 22 }}>Your manager will be notified to find a suitable swap.</div>
            {[['Your shift', 'Select which of your shifts to swap'], ['Swap with', 'Team member or open to anyone'], ['Message', 'Any context for your manager...']].map(([label, ph]) => (
              <div key={label} style={{ marginBottom: 16 }}>
                <div style={{ font: 'var(--text-label)', fontWeight: 700, color: 'var(--fg-2)', marginBottom: 7 }}>{label}</div>
                <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--filo-surface-3)', border: '0.5px solid var(--border-cream)', font: 'var(--text-label)', color: 'var(--fg-4)' }}>{ph}</div>
              </div>
            ))}
            {swapSent ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '13px 16px', background: 'rgba(20,99,58,0.15)', borderRadius: 10 }}>
                <SIcon name="check-circle-2" size={18} color="#5cc88a" />
                <span style={{ font: 'var(--text-label)', fontWeight: 700, color: '#5cc88a' }}>Swap request sent to your manager</span>
              </div>
            ) : (
              <SPressButton onClick={() => { setSwapSent(true); setTimeout(() => { setSwapOpen(false); setSwapSent(false); }, 1800); }}
                style={{ width: '100%', padding: '14px 0', borderRadius: 12, background: 'var(--filo-green)', border: 'none', color: 'var(--fg-1)', font: 'var(--text-label)', fontWeight: 700, cursor: 'pointer' }}>
                Send request
              </SPressButton>
            )}
          </div>
        </div>
      )}

      {/* Leave request sheet */}
      {leaveOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'flex-end', zIndex: 50 }} onClick={() => setLeaveOpen(false)}>
          <div style={{ width: '100%', background: 'var(--filo-surface)', borderRadius: '20px 20px 0 0', padding: '24px 20px 40px', border: '0.5px solid var(--border-cream)' }} onClick={e => e.stopPropagation()}>
            <div style={{ font: 'var(--text-h2)', marginBottom: 4 }}>Request leave</div>
            <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginBottom: 22 }}>Your manager will be notified to review.</div>
            {[['From', 'Select date'], ['To', 'Select date'], ['Reason', 'Annual leave, sick leave, personal...']].map(([label, ph]) => (
              <div key={label} style={{ marginBottom: 16 }}>
                <div style={{ font: 'var(--text-label)', fontWeight: 700, color: 'var(--fg-2)', marginBottom: 7 }}>{label}</div>
                <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--filo-surface-3)', border: '0.5px solid var(--border-cream)', font: 'var(--text-label)', color: 'var(--fg-4)' }}>{ph}</div>
              </div>
            ))}
            {leaveSent ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '13px 16px', background: 'rgba(20,99,58,0.15)', borderRadius: 10 }}>
                <SIcon name="check-circle-2" size={18} color="#5cc88a" />
                <span style={{ font: 'var(--text-label)', fontWeight: 700, color: '#5cc88a' }}>Request sent to your manager</span>
              </div>
            ) : (
              <SPressButton onClick={submitLeave}
                style={{ width: '100%', padding: '14px 0', borderRadius: 12, background: 'var(--filo-green)', border: 'none', color: 'var(--fg-1)', font: 'var(--text-label)', fontWeight: 700, cursor: 'pointer' }}>
                Send request
              </SPressButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Pay tab ─────────────────────────────────────────────────────────────── */

function PayTab() {
  const [downloaded, setDownloaded] = React.useState(false);
  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '0 20px 32px' }}>
      <div style={{ paddingTop: 52, marginBottom: 20 }}>
        <div style={{ font: 'var(--text-h1)', fontSize: 24, marginBottom: 4 }}>Pay</div>
        <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)' }}>Week ending {PAYSLIP.weekEnding}</div>
      </div>
      <SCard accent style={{ marginBottom: 14, textAlign: 'center', padding: 24 }}>
        <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginBottom: 8 }}>Net pay</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 42, color: 'var(--filo-gold)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>A${PAYSLIP.net.toFixed(2)}</div>
        <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginTop: 8 }}>{PAYSLIP.hours} hours worked</div>
      </SCard>
      <SCard style={{ marginBottom: 14 }}>
        <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: 11, marginBottom: 14 }}>Breakdown</div>
        {[
          { label: 'Base pay',   value: `A$${PAYSLIP.gross.toFixed(2)}`, note: `${PAYSLIP.hours}h × A$${PAYSLIP.rate}/hr`, color: 'var(--fg-1)' },
          { label: 'Tips share', value: `+A$${PAYSLIP.tips.toFixed(2)}`, note: 'Pooled by hours',            color: '#d8a73a'       },
          { label: 'Tax',        value: `-A$${PAYSLIP.tax.toFixed(2)}`,  note: 'Est. PAYG withholding',      color: 'var(--fg-3)'   },
        ].map(r => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '0.5px solid var(--border-cream)' }}>
            <div>
              <div style={{ font: 'var(--text-label)', color: 'var(--fg-2)' }}>{r.label}</div>
              <div style={{ font: 'var(--text-label)', color: 'var(--fg-4)', fontSize: 12, marginTop: 2 }}>{r.note}</div>
            </div>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16, color: r.color, fontVariantNumeric: 'tabular-nums' }}>{r.value}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14 }}>
          <span style={{ font: 'var(--text-h3)', color: 'var(--fg-1)', fontWeight: 700 }}>Net pay</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 18, color: 'var(--filo-gold)', fontVariantNumeric: 'tabular-nums' }}>A${PAYSLIP.net.toFixed(2)}</span>
        </div>
      </SCard>
      {downloaded ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '14px 16px', background: 'rgba(20,99,58,0.15)', borderRadius: 12, border: '0.5px solid rgba(20,99,58,0.3)' }}>
          <SIcon name="check-circle-2" size={18} color="#5cc88a" />
          <span style={{ font: 'var(--text-label)', fontWeight: 700, color: '#5cc88a' }}>Payslip saved to your files</span>
        </div>
      ) : (
        <SPressButton onClick={() => { setDownloaded(true); setTimeout(() => setDownloaded(false), 3000); }}
          style={{ width: '100%', padding: '14px 0', borderRadius: 12, background: 'transparent', border: '0.5px solid var(--border-cream-2)', color: 'var(--fg-2)', font: 'var(--text-label)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <SIcon name="download" size={16} color="var(--fg-3)" />
          Download payslip
        </SPressButton>
      )}
    </div>
  );
}

/* ── Messages tab ────────────────────────────────────────────────────────── */

function MessagesTab() {
  const [active, setActive] = React.useState(null);

  if (active !== null) {
    const msg = MESSAGES[active];
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ paddingTop: 52, padding: '52px 20px 14px', borderBottom: '0.5px solid var(--border-cream)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <SPressButton onClick={() => setActive(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
            <SIcon name="chevron-left" size={22} color="var(--filo-green)" />
          </SPressButton>
          <div style={{ width: 36, height: 36, borderRadius: 999, background: msg.group ? 'var(--filo-surface-3)' : 'var(--filo-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--fg-1)', flexShrink: 0 }}>
            {msg.group ? <SIcon name="users" size={16} color="var(--fg-2)" /> : msg.initials}
          </div>
          <div>
            <div style={{ font: 'var(--text-label)', fontWeight: 700, color: 'var(--fg-1)' }}>{msg.from}</div>
            <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', fontSize: 12 }}>{msg.role}</div>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
            <div style={{ maxWidth: '78%', background: 'var(--filo-surface)', border: '0.5px solid var(--border-cream)', borderRadius: '4px 16px 16px 16px', padding: '12px 14px' }}>
              <div style={{ font: 'var(--text-body)', color: 'var(--fg-1)', fontSize: 15 }}>{msg.text}</div>
              <div style={{ font: 'var(--text-label)', color: 'var(--fg-4)', fontSize: 11, marginTop: 6, textAlign: 'right' }}>{msg.time}</div>
            </div>
          </div>
        </div>
        <div style={{ padding: '12px 16px 32px', display: 'flex', gap: 10, borderTop: '0.5px solid var(--border-cream)' }}>
          <div style={{ flex: 1, padding: '12px 16px', borderRadius: 24, background: 'var(--filo-surface)', border: '0.5px solid var(--border-cream)', font: 'var(--text-label)', color: 'var(--fg-4)' }}>Reply…</div>
          <button style={{ width: 44, height: 44, borderRadius: 999, background: 'var(--filo-green)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SIcon name="arrow-up" size={20} color="var(--fg-1)" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '0 0 32px' }}>
      <div style={{ padding: '52px 20px 16px' }}>
        <div style={{ font: 'var(--text-h1)', fontSize: 24 }}>Messages</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {MESSAGES.map((m, i) => (
          <SPressButton key={m.id} onClick={() => setActive(i)}
            style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 20px', background: 'none', border: 'none', borderBottom: '0.5px solid var(--border-cream)', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 44, height: 44, borderRadius: 999, background: m.group ? 'var(--filo-surface-3)' : 'var(--filo-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--fg-1)' }}>
                {m.group ? <SIcon name="users" size={18} color="var(--fg-2)" /> : m.initials}
              </div>
              {m.unread && <span style={{ position: 'absolute', top: 0, right: 0, width: 10, height: 10, borderRadius: 999, background: 'var(--filo-green)', border: '2px solid var(--filo-black)' }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ font: 'var(--text-label)', fontWeight: m.unread ? 700 : 400, color: m.unread ? 'var(--fg-1)' : 'var(--fg-2)' }}>{m.from}</span>
                <span style={{ font: 'var(--text-label)', color: 'var(--fg-4)', fontSize: 12 }}>{m.time}</span>
              </div>
              <div style={{ font: 'var(--text-label)', color: m.unread ? 'var(--fg-2)' : 'var(--fg-4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14 }}>{m.text}</div>
            </div>
          </SPressButton>
        ))}
      </div>
    </div>
  );
}

/* ── Profile tab ─────────────────────────────────────────────────────────── */

function ProfileTab({ theme, onTheme, onLogout }) {
  const [comingSoonOpen, setComingSoonOpen] = React.useState(false);
  const [logoutOpen,     setLogoutOpen]     = React.useState(false);
  const modes = [
    { id: 'dark',  label: 'Dark',  sub: 'Obsidian Service.',           icon: 'moon' },
    { id: 'light', label: 'Light', sub: 'Warm cream — bright spaces.',  icon: 'sun'  },
  ];
  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '0 20px 32px' }}>
      <div style={{ paddingTop: 52, marginBottom: 24 }}>
        <div style={{ font: 'var(--text-h1)', fontSize: 24 }}>Profile</div>
      </div>
      <SCard style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <div style={{ width: 52, height: 52, borderRadius: 999, background: 'var(--filo-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: 'var(--fg-1)', flexShrink: 0 }}>{ME.initials}</div>
        <div>
          <div style={{ font: 'var(--text-h3)', color: 'var(--fg-1)' }}>{ME.name}</div>
          <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginTop: 3 }}>{ME.role} · {ME.section}</div>
        </div>
      </SCard>
      <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: 11, marginBottom: 10 }}>Appearance</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {modes.map(m => (
          <SPressButton key={m.id} onClick={() => onTheme(m.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 12, background: 'var(--filo-surface)', border: theme === m.id ? '1px solid var(--filo-green)' : '0.5px solid var(--border-cream)', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
            <span style={{ width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: theme === m.id ? 'var(--filo-green)' : 'var(--filo-surface-3)', transition: 'background .15s' }}>
              <SIcon name={m.icon} size={18} color={theme === m.id ? 'var(--fg-1)' : 'var(--fg-2)'} />
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ font: 'var(--text-label)', fontWeight: 700, color: 'var(--fg-1)' }}>{m.label}</div>
              <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginTop: 2, fontSize: 12 }}>{m.sub}</div>
            </div>
            {theme === m.id && <SIcon name="check-circle-2" size={18} color="var(--filo-green)" />}
          </SPressButton>
        ))}
      </div>
      <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: 11, marginBottom: 10 }}>Account</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[['Notifications', 'bell'], ['PIN & security', 'lock'], ['Log out', 'log-out']].map(([label, icon]) => (
          <SPressButton key={label} onClick={() => label === 'Log out' ? setLogoutOpen(true) : setComingSoonOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 12, background: 'var(--filo-surface)', border: '0.5px solid var(--border-cream)', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
            <span style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--filo-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <SIcon name={icon} size={18} color="var(--fg-2)" />
            </span>
            <span style={{ flex: 1, font: 'var(--text-label)', fontWeight: 700, color: label === 'Log out' ? '#d9806f' : 'var(--fg-1)' }}>{label}</span>
            {label !== 'Log out' && <SIcon name="chevron-right" size={16} color="var(--fg-4)" />}
          </SPressButton>
        ))}
      </div>

      {/* Coming soon sheet */}
      {comingSoonOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'flex-end', zIndex: 50 }} onClick={() => setComingSoonOpen(false)}>
          <div style={{ width: '100%', background: 'var(--filo-surface)', borderRadius: '20px 20px 0 0', padding: '24px 20px 40px', border: '0.5px solid var(--border-cream)' }} onClick={e => e.stopPropagation()}>
            <div style={{ font: 'var(--text-h2)', marginBottom: 6 }}>Coming soon</div>
            <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginBottom: 24 }}>This feature is on the way in the next build of Filo.</div>
            <SPressButton onClick={() => setComingSoonOpen(false)}
              style={{ width: '100%', padding: '14px 0', borderRadius: 12, background: 'var(--filo-surface-3)', border: 'none', color: 'var(--fg-2)', font: 'var(--text-label)', fontWeight: 700, cursor: 'pointer' }}>
              Got it
            </SPressButton>
          </div>
        </div>
      )}

      {/* Log out confirmation */}
      {logoutOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'flex-end', zIndex: 50 }} onClick={() => setLogoutOpen(false)}>
          <div style={{ width: '100%', background: 'var(--filo-surface)', borderRadius: '20px 20px 0 0', padding: '24px 20px 40px', border: '0.5px solid var(--border-cream)' }} onClick={e => e.stopPropagation()}>
            <div style={{ font: 'var(--text-h2)', marginBottom: 6 }}>Sign out?</div>
            <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginBottom: 24 }}>You'll need to sign back in before your next shift.</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <SPressButton onClick={() => setLogoutOpen(false)}
                style={{ flex: 1, padding: '14px 0', borderRadius: 12, background: 'var(--filo-surface-3)', border: 'none', color: 'var(--fg-2)', font: 'var(--text-label)', fontWeight: 700, cursor: 'pointer' }}>
                Cancel
              </SPressButton>
              <SPressButton onClick={onLogout}
                style={{ flex: 1, padding: '14px 0', borderRadius: 12, background: 'transparent', border: '0.5px solid rgba(158,59,46,0.5)', color: '#d9806f', font: 'var(--text-label)', fontWeight: 700, cursor: 'pointer' }}>
                Sign out
              </SPressButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Tab button — onClick-based animation so the click always fires first ── */

function StaffTabButton({ t, active, unread, onClick }) {
  const [pressed, setPressed] = React.useState(false);
  const handle = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 200);
    onClick();
  };
  return (
    <button onClick={handle}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '10px 0 4px', background: 'none', border: 'none', cursor: 'pointer', color: active ? 'var(--filo-green)' : 'var(--fg-4)', position: 'relative',
        transform: pressed ? 'scale(0.86)' : 'scale(1)', transition: 'color .15s, transform .18s var(--ease-out)' }}>
      <SIcon name={t.icon} size={23} color={active ? 'var(--filo-green)' : 'var(--fg-4)'} />
      <span style={{ fontSize: 10, fontWeight: active ? 700 : 400, letterSpacing: '0.02em' }}>{t.label}</span>
      {t.id === 'messages' && unread > 0 && (
        <span style={{ position: 'absolute', top: 8, left: '50%', marginLeft: 6, width: 16, height: 16, borderRadius: 999, background: 'var(--filo-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--fg-1)' }}>{unread}</span>
      )}
    </button>
  );
}

/* ── App shell ───────────────────────────────────────────────────────────── */

function StaffApp() {
  const [tab,        setTab]        = React.useState('home');
  const [theme,      setTheme]      = React.useState('dark');
  const [shiftStart, setShiftStart] = React.useState(null);
  const [shiftMins,  setShiftMins]  = React.useState(0);

  React.useEffect(() => {
    if (!shiftStart) return;
    const tick = () => setShiftMins(Math.floor((Date.now() - shiftStart) / 60000));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [shiftStart]);

  const startShift = () => { setShiftStart(Date.now()); setShiftMins(0); };
  const endShift   = () => { setShiftStart(null); setShiftMins(0); };
  const logout     = () => { setShiftStart(null); setShiftMins(0); setTab('home'); };

  const tabs = [
    { id: 'home',     icon: 'home',           label: 'Home'     },
    { id: 'roster',   icon: 'calendar',       label: 'Roster'   },
    { id: 'pay',      icon: 'banknote',       label: 'Pay'      },
    { id: 'messages', icon: 'message-circle', label: 'Messages' },
    { id: 'profile',  icon: 'user',           label: 'Profile'  },
  ];
  const unread    = MESSAGES.filter(m => m.unread).length;
  const themeVars = theme === 'light' ? STAFF_LIGHT_VARS : {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--filo-black)', ...themeVars }}>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {tab === 'home'     && <HomeTab shiftStart={shiftStart} shiftMins={shiftMins} onStartShift={startShift} onEndShift={endShift} onTabChange={setTab} />}
        {tab === 'roster'   && <RosterTab />}
        {tab === 'pay'      && <PayTab />}
        {tab === 'messages' && <MessagesTab />}
        {tab === 'profile'  && <ProfileTab theme={theme} onTheme={setTheme} onLogout={logout} />}
      </div>
      <div style={{ display: 'flex', borderTop: '0.5px solid var(--border-cream)', background: theme === 'light' ? 'rgba(240,234,224,0.95)' : 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', paddingBottom: 20, flexShrink: 0 }}>
        {tabs.map(t => (
          <StaffTabButton key={t.id} t={t} active={tab === t.id} unread={unread} onClick={() => setTab(t.id)} />
        ))}
      </div>
    </div>
  );
}

window.StaffApp = StaffApp;
