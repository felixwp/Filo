/* Filo Backroom — app shell */

function CamerasScreen() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="Cameras" subtitle="Live and recorded feeds · venue security" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40, textAlign: 'center' }}>
        <div style={{ width: 68, height: 68, borderRadius: 20, background: 'var(--filo-surface)', border: '0.5px solid var(--border-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="camera" size={30} color="var(--fg-3)" />
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 18, color: 'var(--fg-1)' }}>Cameras</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--fg-3)', maxWidth: 360, lineHeight: 1.65 }}>
          For when venues have cameras, they go here, pretty much. Live CCTV feeds from across the floor, bar, entry, and kitchen — plus recorded footage, incident flagging, and camera management, all from Filo.
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-4)', marginTop: 6 }}>Coming in the next build</div>
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
