/* Filo POS — shared primitives. Exports to window. */

function Icon({ name, size = 24, color, style = {}, strokeWidth = 2 }) {
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
  return <span ref={ref} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, color, flexShrink: 0, ...style }} />;
}

function Button({ children, variant = 'primary', icon, onClick, full, style = {}, size = 'md' }) {
  const base = {
    fontFamily: 'var(--font-sans)', fontWeight: 700,
    fontSize: size === 'lg' ? 18 : 16,
    border: 'none', borderRadius: 'var(--radius-btn)',
    minHeight: size === 'lg' ? 56 : 48, padding: size === 'lg' ? '0 28px' : '0 20px',
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9,
    transition: 'transform .1s var(--ease-out), background .15s, border-color .15s',
    width: full ? '100%' : undefined, whiteSpace: 'nowrap',
  };
  const variants = {
    primary:   { background: 'var(--filo-green)', color: 'var(--fg-on-green)' },
    secondary: { background: 'transparent', color: 'var(--fg-1)', border: '1px solid var(--border-cream-2)' },
    ghost:     { background: 'transparent', color: 'var(--fg-2)' },
    danger:    { background: 'transparent', color: '#d9806f', border: '1px solid rgba(158,59,46,0.6)' },
    gold:      { background: 'var(--filo-gold)', color: 'var(--filo-black)' },
  };
  const [press, setPress] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const hoverBg = { primary: 'var(--filo-green-bright)', secondary: 'var(--filo-surface-2)', gold: 'var(--filo-gold-soft)' }[variant];
  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPress(true)} onMouseUp={() => setPress(false)} onMouseLeave={() => { setPress(false); setHover(false); }}
      onMouseEnter={() => setHover(true)}
      style={{ ...base, ...variants[variant], ...(hover && hoverBg ? { background: hoverBg } : {}), transform: press ? 'scale(0.97)' : 'scale(1)', ...style }}>
      {icon && <Icon name={icon} size={size === 'lg' ? 20 : 18} />}
      {children}
    </button>
  );
}

function Pill({ children, tone = 'neutral', dot, style = {} }) {
  const tones = {
    occupied: { bg: 'rgba(20,99,58,0.22)', fg: '#5cc88a' },
    ordering: { bg: 'rgba(201,122,30,0.20)', fg: '#e0973f' },
    bill:     { bg: 'rgba(201,146,30,0.20)', fg: '#d8a73a' },
    available:{ bg: 'transparent', fg: 'var(--fg-3)', border: '0.5px solid var(--border-cream)' },
    neutral:  { bg: 'var(--filo-surface-3)', fg: 'var(--fg-2)' },
    green:    { bg: 'var(--filo-green)', fg: 'var(--fg-1)' },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{ font: 'var(--text-pill)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 10px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 6, background: t.bg, color: t.fg, border: t.border, ...style }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 999, background: t.fg }} />}
      {children}
    </span>
  );
}

function Tag({ children }) {
  return <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--fg-2)', background: 'var(--filo-surface-3)', padding: '3px 7px', borderRadius: 6 }}>{children}</span>;
}

function Panel({ children, accent, style = {}, ...rest }) {
  return <div {...rest} style={{ background: 'var(--filo-surface)', border: accent ? '0.5px solid var(--border-green)' : '0.5px solid var(--border-cream)', borderRadius: 'var(--radius-card)', ...style }}>{children}</div>;
}

function fmtAUD(amount) { return 'A$' + Number(amount).toFixed(amount % 1 === 0 ? 0 : 2); }
function Money({ amount, size = 18, color = 'var(--filo-gold)', weight = 700 }) {
  return <span style={{ fontFamily: 'var(--font-sans)', fontWeight: weight, fontSize: size, color, fontVariantNumeric: 'tabular-nums' }}>{fmtAUD(amount)}</span>;
}

function TopBar({ title, subtitle, onBack, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: '0.5px solid var(--border-cream)', flexShrink: 0 }}>
      {onBack && (
        <button onClick={onBack} style={{ width: 44, height: 44, borderRadius: 11, background: 'var(--filo-surface)', border: '0.5px solid var(--border-cream)', color: 'var(--fg-1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="chevron-left" size={22} />
        </button>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <div style={{ font: 'var(--text-h1)' }}>{title}</div>
        {subtitle && <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)' }}>{subtitle}</div>}
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>{right}</div>
    </div>
  );
}

/* Nav item — onClick-based animation so the click always registers before the animation plays */
function NavItem({ icon, label, active, onClick }) {
  const [pressed, setPressed] = React.useState(false);
  const handleClick = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 200);
    onClick();
  };
  return (
    <button onClick={handleClick} title={label}
      style={{ width: 56, height: 56, borderRadius: 14, border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
        background: active ? 'var(--filo-green)' : 'transparent', color: active ? 'var(--fg-1)' : 'var(--fg-4)',
        transform: pressed ? 'scale(0.86)' : 'scale(1)',
        transition: 'background .15s, color .15s, transform .18s var(--ease-out)' }}>
      <Icon name={icon} size={23} />
      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.04em' }}>{label}</span>
    </button>
  );
}

function fmtShift(mins) {
  if (mins < 1) return null;
  const h = Math.floor(mins / 60), m = mins % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function NavRail({ active, onNav, user, onLogout, shiftMins = 0 }) {
  const canSeeSales = user && ['Manager', 'Owner'].includes(user.role);
  const items = [
    { id: 'floor',     icon: 'layout-grid', label: 'Floor'    },
    { id: 'kds',       icon: 'monitor',     label: 'Kitchen'  },
    { id: 'guide',     icon: 'book-open',   label: 'Guide'    },
    ...(canSeeSales ? [{ id: 'dashboard', icon: 'bar-chart-3', label: 'Sales' }] : []),
    { id: 'settings',  icon: 'settings',    label: 'Settings' },
  ];
  const [logoutHover, setLogoutHover] = React.useState(false);
  const shiftLabel = fmtShift(shiftMins);
  return (
    <div style={{ width: 84, background: 'var(--filo-black)', borderRight: '0.5px solid var(--border-cream)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '18px 0', gap: 8, flexShrink: 0 }}>
      <img src="../../assets/filo-mark-green.svg" height="38" style={{ marginBottom: 18 }} alt="Filo" />
      {items.map(it => (
        <NavItem key={it.id} icon={it.icon} label={it.label} active={active === it.id} onClick={() => onNav(it.id)} />
      ))}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingTop: 12 }}>
        {user && (
          <div title={`${user.name} · ${user.role}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 40, height: 40, borderRadius: 999, background: 'var(--filo-green)', color: 'var(--fg-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: 'var(--text-label)', fontWeight: 700, letterSpacing: '0.02em', flexShrink: 0 }}>
              {user.initials}
            </div>
            {shiftLabel && (
              <span style={{ fontSize: 9, color: 'var(--fg-4)', fontWeight: 600, letterSpacing: '0.02em', fontVariantNumeric: 'tabular-nums' }}>{shiftLabel}</span>
            )}
          </div>
        )}
        <button onClick={onLogout} title="Switch user"
          onMouseEnter={() => setLogoutHover(true)} onMouseLeave={() => setLogoutHover(false)}
          style={{ width: 56, height: 52, borderRadius: 14, border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
            background: logoutHover ? 'rgba(158,59,46,0.16)' : 'transparent', color: logoutHover ? '#d9806f' : 'var(--fg-4)', transition: 'background .15s, color .15s' }}>
          <Icon name="log-out" size={22} />
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.04em' }}>Log out</span>
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { Icon, Button, Pill, Tag, Panel, Money, fmtAUD, TopBar, NavRail });
