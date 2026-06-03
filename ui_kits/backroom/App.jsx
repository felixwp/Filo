/* Filo Backroom — app shell */

function CamerasScreen() {
  const [selected, setSelected] = React.useState(0);
  const [time, setTime]         = React.useState(new Date());
  React.useEffect(() => { const id = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(id); }, []);

  const fmt = (d) => d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  const FEEDS = [
    { label: 'Main Floor',    zone: 'Dining room · full coverage', gradient: 'linear-gradient(145deg,#0e1a14 0%,#111c18 40%,#0a120f 100%)', tint: 'rgba(13,74,40,0.06)'  },
    { label: 'Bar',           zone: 'Bar & service counter',        gradient: 'linear-gradient(145deg,#16120a 0%,#1a1508 40%,#120e06 100%)', tint: 'rgba(201,146,30,0.05)' },
    { label: 'Entry / Door',  zone: 'Front entrance & host stand',  gradient: 'linear-gradient(145deg,#0e1218 0%,#111520 40%,#0a0e16 100%)', tint: 'rgba(80,100,160,0.06)' },
    { label: 'Kitchen Pass',  zone: 'Pass & expedite station',      gradient: 'linear-gradient(145deg,#180f0a 0%,#1c1108 40%,#140c06 100%)', tint: 'rgba(180,80,40,0.05)'  },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar
        title="Cameras"
        subtitle="Live · 4 feeds · recording"
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: 'rgba(217,80,80,0.12)', border: '0.5px solid rgba(217,80,80,0.30)', borderRadius: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#d95050', boxShadow: '0 0 6px rgba(217,80,80,0.7)', animation: 'none' }} />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 700, color: '#d95050' }}>REC</span>
            </div>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-3)', fontVariantNumeric: 'tabular-nums' }}>{fmt(time)}</span>
          </div>
        }
      />

      <div style={{ flex: 1, padding: '16px 20px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 10, minHeight: 0 }}>
        {FEEDS.map((feed, i) => {
          const isSelected = selected === i;
          return (
            <div
              key={i}
              onClick={() => setSelected(i)}
              style={{
                position: 'relative', borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
                border: isSelected ? '1.5px solid rgba(13,74,40,0.8)' : '0.5px solid rgba(245,239,228,0.08)',
                boxShadow: isSelected ? '0 0 0 1px rgba(13,74,40,0.4), inset 0 0 0 1px rgba(13,74,40,0.2)' : 'none',
                transition: 'border-color .2s, box-shadow .2s',
                background: feed.gradient,
              }}
            >
              {/* Camera image area */}
              <div style={{ position: 'absolute', inset: 0, background: feed.gradient }} />
              <div style={{ position: 'absolute', inset: 0, background: feed.tint }} />

              {/* Scan lines */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)',
                zIndex: 1,
              }} />

              {/* Subtle vignette */}
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)', zIndex: 2 }} />

              {/* Top overlay — timestamp + REC */}
              <div style={{ position: 'absolute', top: 10, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 3 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(245,239,228,0.55)', letterSpacing: '0.04em' }}>
                  {fmt(time)}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#5cc88a', boxShadow: '0 0 5px rgba(92,200,138,0.7)' }} />
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, color: '#5cc88a', letterSpacing: '0.06em' }}>LIVE</span>
                </div>
              </div>

              {/* Camera index */}
              <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 3 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(245,239,228,0.25)', letterSpacing: '0.06em' }}>CAM {String(i + 1).padStart(2, '0')}</span>
              </div>

              {/* Bottom overlay — label */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3,
                background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
                padding: '24px 12px 10px',
              }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, color: 'var(--fg-1)', marginBottom: 2 }}>{feed.label}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'rgba(245,239,228,0.45)' }}>{feed.zone}</div>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div style={{ position: 'absolute', inset: 0, border: '1.5px solid rgba(13,74,40,0.6)', borderRadius: 10, zIndex: 4, pointerEvents: 'none' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SettingsScreen() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="Settings" subtitle="Venue · menu · staff · integrations" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: 'var(--fg-4)' }}>
        <Icon name="settings" size={38} color="var(--fg-4)" />
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, color: 'var(--fg-3)' }}>Settings</span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--fg-4)' }}>Coming in the next build.</span>
      </div>
    </div>
  );
}

function BackroomApp() {
  const [nav, setNav] = React.useState('dashboard');
  const d = window.BR_DATA;

  const screens = {
    dashboard: <Dashboard />,
    reports:   <Reports />,
    suppliers: <Suppliers />,
    roster:    <Roster />,
    cameras:   <CamerasScreen />,
    settings:  <SettingsScreen />,
  };

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: 'var(--font-sans)', color: 'var(--fg-1)' }}>
      <Sidebar active={nav} onNav={setNav} owner={d.owner} venue={d.venue} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: 'var(--filo-black)' }}>
        {screens[nav]}
      </div>
    </div>
  );
}
window.BackroomApp = BackroomApp;
