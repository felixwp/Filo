/* Filo POS — staff login. Single tap on a name card signs you in immediately. */

function StaffCard({ s, onLogin }) {
  const [pressed, setPressed] = React.useState(false);
  const handleClick = () => {
    if (pressed) return;
    setPressed(true);
    setTimeout(() => onLogin(s), 180);
  };
  return (
    <button key={s.id} onClick={handleClick}
      style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 14, cursor: 'pointer', textAlign: 'left',
        background: pressed ? 'var(--filo-green)' : 'var(--filo-surface)',
        border: pressed ? '1px solid var(--filo-green)' : '0.5px solid var(--border-cream)',
        transform: pressed ? 'scale(0.97)' : 'scale(1)',
        transition: 'background .15s, border-color .15s, transform .1s var(--ease-out)' }}>
      <div style={{ width: 52, height: 52, borderRadius: 999, background: pressed ? 'rgba(245,239,228,0.18)' : 'var(--filo-surface-3)', color: 'var(--fg-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: 'var(--text-h3)', flexShrink: 0 }}>{s.initials}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ font: 'var(--text-h3)', color: 'var(--fg-1)' }}>{s.name}</span>
        <span style={{ font: 'var(--text-label)', color: pressed ? 'rgba(245,239,228,0.7)' : 'var(--fg-3)' }}>{s.role} · {s.section}</span>
      </div>
    </button>
  );
}

function Login({ onLogin }) {
  const { staff } = window.FILO_DATA;
  return (
    <div style={{ display: 'flex', height: '100%', background: 'var(--filo-black)' }}>
      {/* left brand panel */}
      <div style={{ width: 420, background: 'var(--filo-green)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 44, flexShrink: 0 }}>
        <img src="../../assets/filo-mark-mono-cream.svg" height="56" alt="Filo" />
        <div>
          <div style={{ font: 'var(--text-wordmark)', letterSpacing: '0.10em', fontSize: 40, color: 'var(--fg-1)', textTransform: 'uppercase' }}>FILO</div>
          <div style={{ font: 'var(--text-h2)', fontWeight: 400, color: 'rgba(245,239,228,0.85)', marginTop: 14 }}>A good shift.</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '0.5px solid rgba(245,239,228,0.18)', paddingTop: 16 }}>
          <span style={{ font: 'var(--text-label)', color: 'rgba(245,239,228,0.7)' }}>Lumière · Tuesday 3 June</span>
          <span style={{ font: 'var(--text-label)', color: 'rgba(245,239,228,0.7)' }}>Float ready · A$420</span>
        </div>
      </div>
      {/* right select */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 64px' }}>
        <div style={{ font: 'var(--text-h1)', marginBottom: 6 }}>Good evening</div>
        <div style={{ font: 'var(--text-body)', color: 'var(--fg-3)', marginBottom: 32 }}>Tap your name.</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {staff.map(s => <StaffCard key={s.id} s={s} onLogin={onLogin} />)}
        </div>
      </div>
    </div>
  );
}
window.Login = Login;
