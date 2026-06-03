/* Filo Backroom — shared primitives */

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

function Button({ children, variant = 'primary', icon, onClick, full, style = {}, size = 'md', disabled }) {
  const base = {
    fontFamily: 'var(--font-sans)', fontWeight: 700,
    fontSize: size === 'lg' ? 18 : size === 'sm' ? 13 : 15,
    border: 'none', borderRadius: 'var(--radius-btn)',
    minHeight: size === 'lg' ? 56 : size === 'sm' ? 34 : 44,
    padding: size === 'lg' ? '0 28px' : size === 'sm' ? '0 14px' : '0 20px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    transition: 'transform .1s var(--ease-out), background .15s, border-color .15s',
    width: full ? '100%' : undefined, whiteSpace: 'nowrap',
    opacity: disabled ? 0.45 : 1,
  };
  const variants = {
    primary:   { background: 'var(--filo-green)',   color: 'var(--fg-on-green)' },
    secondary: { background: 'transparent',         color: 'var(--fg-1)', border: '1px solid var(--border-cream-2)' },
    ghost:     { background: 'transparent',         color: 'var(--fg-2)' },
    danger:    { background: 'transparent',         color: '#d9806f', border: '1px solid rgba(158,59,46,0.6)' },
    gold:      { background: 'var(--filo-gold)',    color: 'var(--filo-black)' },
  };
  const [press, setPress] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const hoverBg = { primary: 'var(--filo-green-bright)', secondary: 'var(--filo-surface-2)', gold: 'var(--filo-gold-soft)' }[variant];
  return (
    <button disabled={disabled} onClick={onClick}
      onMouseDown={() => !disabled && setPress(true)}
      onMouseUp={() => setPress(false)}
      onMouseLeave={() => { setPress(false); setHover(false); }}
      onMouseEnter={() => !disabled && setHover(true)}
      style={{ ...base, ...variants[variant], ...(hover && hoverBg ? { background: hoverBg } : {}), transform: press ? 'scale(0.97)' : 'scale(1)', ...style }}>
      {icon && <Icon name={icon} size={size === 'lg' ? 20 : size === 'sm' ? 14 : 17} />}
      {children}
    </button>
  );
}

function Pill({ children, tone = 'neutral', dot, style = {} }) {
  const tones = {
    occupied: { bg: 'rgba(20,99,58,0.22)',    fg: '#5cc88a' },
    ordering: { bg: 'rgba(201,122,30,0.20)',  fg: '#e0973f' },
    available:{ bg: 'transparent',            fg: 'var(--fg-3)', border: '0.5px solid var(--border-cream)' },
    neutral:  { bg: 'var(--filo-surface-3)',  fg: 'var(--fg-2)' },
    green:    { bg: 'var(--filo-green)',       fg: 'var(--fg-1)' },
    amber:    { bg: 'rgba(201,122,30,0.20)',  fg: '#e0973f' },
    red:      { bg: 'rgba(158,59,46,0.18)',   fg: '#d9806f' },
    gold:     { bg: 'rgba(201,146,30,0.15)',  fg: 'var(--filo-gold)' },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{ font: 'var(--text-pill)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 10px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 6, background: t.bg, color: t.fg, border: t.border, ...style }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 999, background: t.fg, flexShrink: 0 }} />}
      {children}
    </span>
  );
}

function Panel({ children, accent, style = {}, ...rest }) {
  return (
    <div {...rest} style={{ background: 'var(--filo-surface)', border: accent ? '0.5px solid rgba(20,99,58,0.55)' : '0.5px solid var(--border-cream)', borderRadius: 'var(--radius-card)', ...style }}>
      {children}
    </div>
  );
}

function fmtAUD(n) { return '$' + Number(n).toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 2 }); }

function Money({ amount, size = 18, color = 'var(--filo-gold)', weight = 700 }) {
  return <span style={{ fontFamily: 'var(--font-sans)', fontWeight: weight, fontSize: size, color, fontVariantNumeric: 'tabular-nums' }}>{fmtAUD(amount)}</span>;
}

function TopBar({ title, subtitle, right, border = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 28px', borderBottom: border ? '0.5px solid var(--border-cream)' : 'none', flexShrink: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 21, color: 'var(--fg-1)', lineHeight: 1.2 }}>{title}</div>
        {subtitle && <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)' }}>{subtitle}</div>}
      </div>
      {right && <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>{right}</div>}
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick, badge }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%', height: 42, borderRadius: 10, border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 11, padding: '0 13px',
        background: active ? 'var(--filo-green)' : hover ? 'var(--filo-surface-2)' : 'transparent',
        color: active ? 'var(--fg-1)' : hover ? 'var(--fg-1)' : 'var(--fg-3)',
        transition: 'background .15s, color .15s',
        fontFamily: 'var(--font-sans)', fontWeight: active ? 700 : 400, fontSize: 14,
      }}>
      <Icon name={icon} size={17} />
      <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
      {badge && (
        <span style={{ minWidth: 18, height: 18, borderRadius: 999, background: active ? 'rgba(255,255,255,0.25)' : 'rgba(201,122,30,0.25)', color: active ? 'var(--fg-1)' : '#e0973f', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
          {badge}
        </span>
      )}
    </button>
  );
}

function Sidebar({ active, onNav, owner, venue }) {
  const d = window.BR_DATA;
  const criticalCount = d.stock.filter(s => s.status === 'critical' || s.status === 'low').length;
  const orderDue = d.suppliers.some(s => s.dueToday);

  const items = [
    { id: 'dashboard', icon: 'layout-dashboard', label: 'Dashboard'    },
    { id: 'reports',   icon: 'bar-chart-2',       label: 'Reports'      },
    { id: 'suppliers', icon: 'truck',              label: 'Suppliers', badge: criticalCount || undefined },
    { id: 'roster',    icon: 'users',              label: 'Roster & Pay' },
    { id: 'cameras',   icon: 'camera',             label: 'Cameras'     },
    { id: 'settings',  icon: 'settings',           label: 'Settings'    },
  ];

  return (
    <div style={{ width: 232, background: 'var(--filo-black)', borderRight: '0.5px solid var(--border-cream)', display: 'flex', flexDirection: 'column', padding: '20px 10px 20px', flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 6, marginBottom: 24 }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 264 240" height="30" aria-label="Filo" style={{ flexShrink: 0 }}>
          <circle cx="120" cy="120" r="120" fill="#0D4A28" />
          <g fill="none" stroke="#F5EFE4" strokeWidth="11" strokeLinecap="round">
            <path d="M90 142 A30 30 0 0 1 150 142" />
            <path d="M68 142 A52 52 0 0 1 172 142" />
            <path d="M46 142 A74 74 0 0 1 194 142" />
          </g>
          <circle cx="250" cy="92" r="9" fill="#C9921E" />
        </svg>
        <div>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 15, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-1)', lineHeight: 1.1 }}>Filo</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 10, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--fg-4)', marginTop: 1 }}>Backroom</div>
        </div>
      </div>

      {/* Venue */}
      <div style={{ paddingLeft: 6, marginBottom: 18, paddingBottom: 18, borderBottom: '0.5px solid var(--border-cream)' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, color: 'var(--fg-1)' }}>{venue.name}</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-4)', marginTop: 2 }}>{venue.suburb}</div>
      </div>

      {/* Nav */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map(it => (
          <SidebarItem key={it.id} icon={it.icon} label={it.label} active={active === it.id} onClick={() => onNav(it.id)} badge={it.badge} />
        ))}
      </div>

      {/* User */}
      <div style={{ marginTop: 'auto', paddingTop: 18, borderTop: '0.5px solid var(--border-cream)', display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 4 }}>
        <div style={{ width: 34, height: 34, borderRadius: 999, background: 'var(--filo-green)', color: 'var(--fg-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
          {owner.initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, color: 'var(--fg-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{owner.name}</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-4)', marginTop: 1 }}>{owner.role}</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Icon, Button, Pill, Panel, Money, fmtAUD, TopBar, Sidebar });
