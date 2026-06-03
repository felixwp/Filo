/* Filo POS — Guide & Settings */

/* ── Settings sub-screens ───────────────────────────────────────────────── */

function SectionLabel({ children }) {
  return <div style={{ font: 'var(--text-pill)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 12 }}>{children}</div>;
}

function SettingVenue({ onBack }) {
  const fields = [
    { label: 'Venue name',     value: 'Lumière',                                    icon: 'building-2' },
    { label: 'Address',        value: '23 Great Portland Street, London W1W 8QR',   icon: 'map-pin' },
    { label: 'Capacity',       value: '64 covers',                                  icon: 'users' },
    { label: 'Cuisine',        value: 'Modern European',                             icon: 'utensils' },
    { label: 'Service hours',  value: 'Tue – Sat  ·  18:00 – 23:00',               icon: 'clock' },
    { label: 'Currency',       value: 'Australian dollar (A$)',                     icon: 'banknote' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="Venue details" subtitle="Lumière" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {fields.map(f => (
            <button key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 12, background: 'var(--filo-surface)', border: '0.5px solid var(--border-cream)', cursor: 'pointer', textAlign: 'left' }}>
              <Icon name={f.icon} size={20} color="var(--fg-3)" />
              <div style={{ flex: 1 }}>
                <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginBottom: 2 }}>{f.label}</div>
                <div style={{ font: 'var(--text-body)', color: 'var(--fg-1)' }}>{f.value}</div>
              </div>
              <Icon name="chevron-right" size={18} color="var(--fg-4)" />
            </button>
          ))}
          <div style={{ marginTop: 8 }}>
            <Button variant="danger" icon="trash-2">Delete venue</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingMenu({ onBack }) {
  const menu = window.FILO_DATA?.menu || {};
  const categories = Object.keys(menu);
  const [cat, setCat] = React.useState(categories[0] || 'Starters');
  const items = menu[cat] || [];
  const totalItems = Object.values(menu).flat().length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="Menu management" subtitle={`${totalItems} items`} onBack={onBack}
        right={<Button variant="primary" icon="plus">Add item</Button>} />
      <div style={{ display: 'flex', gap: 8, padding: '12px 24px', borderBottom: '0.5px solid var(--border-cream)', flexShrink: 0 }}>
        {categories.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{ flexShrink: 0, padding: '8px 16px', borderRadius: 999, border: 'none', cursor: 'pointer', font: 'var(--text-label)', fontWeight: cat === c ? 700 : 400, background: cat === c ? 'var(--filo-green)' : 'var(--filo-surface)', color: cat === c ? 'var(--fg-1)' : 'var(--fg-3)', transition: 'all .15s' }}>
            {c} <span style={{ opacity: 0.55 }}>({menu[c].length})</span>
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map(item => (
          <button key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 12, background: 'var(--filo-surface)', border: '0.5px solid var(--border-cream)', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: item.tags?.length ? 6 : 0 }}>
                <span style={{ font: 'var(--text-body)', color: 'var(--fg-1)' }}>{item.name}</span>
              </div>
              {item.tags?.length > 0 && (
                <div style={{ display: 'flex', gap: 6 }}>{item.tags.map(t => <Tag key={t}>{t}</Tag>)}</div>
              )}
              {item.unit && <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginTop: 4 }}>{item.unit}</div>}
            </div>
            <Money amount={item.price} size={16} />
            <Icon name="chevron-right" size={18} color="var(--fg-4)" />
          </button>
        ))}
      </div>
    </div>
  );
}

function SettingStaff({ onBack }) {
  const base = window.FILO_DATA?.staff || [];
  const allStaff = [
    ...base.map(s => ({ ...s, tonight: true })),
    { id: 's5',  name: 'Luca Ferreira',    role: 'Front of house', section: 'Section B', initials: 'LF', tonight: false },
    { id: 's6',  name: 'Sian Patel',       role: 'Bar',            section: 'Bar',       initials: 'SP', tonight: false },
    { id: 's7',  name: 'James Okafor',     role: 'Host',           section: 'Entrance',  initials: 'JO', tonight: false },
    { id: 's8',  name: 'Elodie Martin',    role: 'Front of house', section: 'Section A', initials: 'EM', tonight: false },
    { id: 's9',  name: 'Nina Kovač',       role: 'Sommelier',      section: 'All floor', initials: 'NK', tonight: false },
    { id: 's10', name: 'Rafael Costa',     role: 'Front of house', section: 'Section C', initials: 'RC', tonight: false },
    { id: 's11', name: 'Amy Chen',         role: 'Front of house', section: 'Section B', initials: 'AC', tonight: false },
    { id: 's12', name: 'Oliver Wright',    role: 'Bar',            section: 'Bar',       initials: 'OW', tonight: false },
    { id: 's13', name: 'Isabelle Nguyen',  role: 'Host',           section: 'Entrance',  initials: 'IN', tonight: false },
    { id: 's14', name: 'Danny Walsh',      role: 'Front of house', section: 'Section A', initials: 'DW', tonight: false },
  ];
  const [filter, setFilter] = React.useState('tonight');
  const shown = filter === 'tonight' ? allStaff.filter(s => s.tonight) : allStaff;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="Staff" subtitle={`${allStaff.length} active`} onBack={onBack}
        right={<Button variant="secondary" icon="user-plus">Add staff</Button>} />
      <div style={{ display: 'flex', gap: 8, padding: '12px 24px', borderBottom: '0.5px solid var(--border-cream)', flexShrink: 0 }}>
        {[['tonight', 'On tonight'], ['all', 'All staff']].map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id)} style={{ padding: '8px 16px', borderRadius: 999, border: 'none', cursor: 'pointer', font: 'var(--text-label)', fontWeight: filter === id ? 700 : 400, background: filter === id ? 'var(--filo-green)' : 'var(--filo-surface)', color: filter === id ? 'var(--fg-1)' : 'var(--fg-3)', transition: 'all .15s' }}>{label}</button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {shown.map(s => (
          <button key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 12, background: 'var(--filo-surface)', border: '0.5px solid var(--border-cream)', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ width: 40, height: 40, borderRadius: 999, background: 'var(--filo-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: 'var(--text-label)', fontWeight: 700, color: 'var(--fg-1)', flexShrink: 0 }}>{s.initials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ font: 'var(--text-body)', color: 'var(--fg-1)' }}>{s.name}</div>
              <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginTop: 2 }}>{s.role} · {s.section}</div>
            </div>
            {s.tonight && <Pill tone="occupied" dot>On tonight</Pill>}
            <Icon name="chevron-right" size={18} color="var(--fg-4)" />
          </button>
        ))}
      </div>
    </div>
  );
}

function SettingHappyHour({ onBack }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const [activeDays, setActiveDays] = React.useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [discount, setDiscount] = React.useState('20%');
  const toggle = (d) => setActiveDays(a => a.includes(d) ? a.filter(x => x !== d) : [...a, d]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="Happy hour" subtitle="Mon–Fri · 17:00–19:00" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Panel style={{ padding: 20 }}>
            <SectionLabel>Days</SectionLabel>
            <div style={{ display: 'flex', gap: 6 }}>
              {days.map(d => {
                const on = activeDays.includes(d);
                return (
                  <button key={d} onClick={() => toggle(d)} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: on ? '1px solid var(--filo-green)' : '0.5px solid var(--border-cream)', background: on ? 'var(--filo-green)' : 'transparent', color: on ? 'var(--fg-1)' : 'var(--fg-3)', font: 'var(--text-label)', fontWeight: 700, cursor: 'pointer', transition: 'all .15s' }}>{d}</button>
                );
              })}
            </div>
          </Panel>
          <Panel style={{ padding: 20 }}>
            <SectionLabel>Time window</SectionLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, padding: '12px 16px', borderRadius: 10, background: 'var(--filo-surface-3)', font: 'var(--text-h3)', color: 'var(--fg-1)', textAlign: 'center' }}>17:00</div>
              <span style={{ color: 'var(--fg-3)', font: 'var(--text-label)' }}>to</span>
              <div style={{ flex: 1, padding: '12px 16px', borderRadius: 10, background: 'var(--filo-surface-3)', font: 'var(--text-h3)', color: 'var(--fg-1)', textAlign: 'center' }}>19:00</div>
            </div>
          </Panel>
          <Panel style={{ padding: 20 }}>
            <SectionLabel>Discount</SectionLabel>
            <div style={{ display: 'flex', gap: 8 }}>
              {['10%', '15%', '20%', '25%'].map(p => (
                <button key={p} onClick={() => setDiscount(p)} style={{ flex: 1, padding: '12px 0', borderRadius: 10, border: discount === p ? '1px solid var(--filo-green)' : '0.5px solid var(--border-cream)', background: discount === p ? 'var(--filo-green)' : 'transparent', color: discount === p ? 'var(--fg-1)' : 'var(--fg-3)', font: 'var(--text-label)', fontWeight: 700, cursor: 'pointer', transition: 'all .15s' }}>{p}</button>
              ))}
            </div>
          </Panel>
          <Panel style={{ padding: 20 }}>
            <SectionLabel>Eligible items</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['House wine', 'Cocktails', 'Soft drinks', 'Draught beer'].map(i => (
                <button key={i} style={{ padding: '8px 14px', borderRadius: 999, border: '0.5px solid var(--border-cream)', background: 'var(--filo-surface-3)', color: 'var(--fg-2)', font: 'var(--text-label)', cursor: 'pointer' }}>{i}</button>
              ))}
            </div>
          </Panel>
          <Button variant="primary" full icon="check">Save changes</Button>
        </div>
      </div>
    </div>
  );
}

function SettingTips({ onBack }) {
  const methods = [
    { id: 'pooled',     label: 'Pooled by hours worked', sub: 'Tips shared based on shift length',  icon: 'users' },
    { id: 'individual', label: 'Individual',              sub: 'Each staff member keeps table tips', icon: 'user' },
    { id: 'even',       label: 'Split evenly',            sub: 'Divided equally regardless of hours', icon: 'git-branch' },
  ];
  const [method, setMethod] = React.useState('pooled');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="Tips" subtitle="Pooled by hours worked" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {methods.map(m => (
            <button key={m.id} onClick={() => setMethod(m.id)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 12, background: 'var(--filo-surface)', border: method === m.id ? '1px solid var(--filo-green)' : '0.5px solid var(--border-cream)', cursor: 'pointer', textAlign: 'left', transition: 'border-color .15s' }}>
              <span style={{ width: 42, height: 42, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: method === m.id ? 'var(--filo-green)' : 'var(--filo-surface-3)', transition: 'background .15s' }}>
                <Icon name={m.icon} size={20} color={method === m.id ? 'var(--fg-1)' : 'var(--fg-2)'} />
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ font: 'var(--text-h3)', color: 'var(--fg-1)' }}>{m.label}</div>
                <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginTop: 3 }}>{m.sub}</div>
              </div>
              {method === m.id && <Icon name="check-circle-2" size={20} color="var(--filo-green)" />}
            </button>
          ))}
          <Panel style={{ padding: 20, marginTop: 4 }}>
            <SectionLabel>This week's pool</SectionLabel>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <Money amount={612} size={32} />
                <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginTop: 4 }}>Across 4 staff on tonight</div>
              </div>
              <Button variant="secondary" icon="receipt">View breakdown</Button>
            </div>
          </Panel>
          <Button variant="primary" full icon="check">Save changes</Button>
        </div>
      </div>
    </div>
  );
}

function SettingFloat({ onBack }) {
  const denoms = [
    { label: 'A$50', qty: 4,  each: 50 },
    { label: 'A$20', qty: 5,  each: 20 },
    { label: 'A$10', qty: 5,  each: 10 },
    { label: 'A$5',  qty: 8,  each: 5  },
    { label: 'A$2',  qty: 10, each: 2  },
    { label: 'A$1',  qty: 10, each: 1  },
  ];
  const total = denoms.reduce((s, d) => s + d.qty * d.each, 0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="Float" subtitle={`Current: A$${total}`} onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Panel style={{ padding: 20 }}>
            <SectionLabel>Denomination breakdown</SectionLabel>
            {denoms.map((d, i) => (
              <div key={d.label} style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: i < denoms.length - 1 ? '0.5px solid var(--border-cream)' : 'none' }}>
                <span style={{ font: 'var(--text-h3)', color: 'var(--fg-1)', width: 56 }}>{d.label}</span>
                <span style={{ font: 'var(--text-label)', color: 'var(--fg-3)', flex: 1 }}>× {d.qty}</span>
                <Money amount={d.qty * d.each} size={16} />
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, marginTop: 4, borderTop: '1px solid var(--border-cream-2)' }}>
              <span style={{ font: 'var(--text-h3)', color: 'var(--fg-1)', fontWeight: 700 }}>Total</span>
              <Money amount={total} size={22} />
            </div>
          </Panel>
          <Button variant="secondary" full icon="pencil">Edit float</Button>
        </div>
      </div>
    </div>
  );
}

function SettingBrand({ onBack }) {
  const colours = [
    { id: 'green',    label: 'Racing green',   hex: '#0D4A28' },
    { id: 'navy',     label: 'Midnight navy',  hex: '#1A2B4A' },
    { id: 'burgundy', label: 'Burgundy',       hex: '#4A1020' },
    { id: 'slate',    label: 'Slate',          hex: '#2A3040' },
  ];
  const [selected, setSelected] = React.useState('green');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="Brand colour" subtitle="Racing green" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginBottom: 4 }}>
            Primary accent colour for your venue's Filo interface.
          </div>
          {colours.map(c => (
            <button key={c.id} onClick={() => setSelected(c.id)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 12, background: 'var(--filo-surface)', border: selected === c.id ? `1px solid ${c.hex}` : '0.5px solid var(--border-cream)', cursor: 'pointer', textAlign: 'left', transition: 'border-color .15s' }}>
              <div style={{ width: 44, height: 44, borderRadius: 11, background: c.hex, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ font: 'var(--text-h3)', color: 'var(--fg-1)' }}>{c.label}</div>
                <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginTop: 3 }}>{c.hex}</div>
              </div>
              {selected === c.id && <Icon name="check-circle-2" size={20} color={c.hex} />}
            </button>
          ))}
          <Button variant="primary" full icon="check" style={{ marginTop: 4 }}>Apply colour</Button>
        </div>
      </div>
    </div>
  );
}

/* ── Guide ──────────────────────────────────────────────────────────────── */

function Guide() {
  const recipes = [
    { name: 'Old Fashioned',   sub: 'Bourbon · sugar · Angostura · orange',  steps: 'Stir 50ml bourbon with sugar & bitters over ice. Strain over a large cube. Express orange.' },
    { name: 'Negroni',         sub: 'Gin · Campari · sweet vermouth',         steps: 'Equal parts, stirred over ice. Garnish with orange.' },
    { name: 'Espresso Martini', sub: 'Vodka · espresso · coffee liqueur',     steps: 'Shake hard with fresh espresso. Double strain. Three beans.' },
  ];
  const flow = ['Greet & seat within 2 min', 'Water & menus down', 'Take drinks, fire course 1', 'Course away before clearing', 'Offer dessert & digestifs', 'Settle & thank by name'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="Guide" subtitle="Recipes · service flow" />
      <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ font: 'var(--text-pill)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>Cocktail recipes</div>
          {recipes.map(r => (
            <Panel key={r.name} style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Icon name="wine" size={18} color="var(--filo-gold)" /><span style={{ font: 'var(--text-h2)' }}>{r.name}</span></div>
              <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', margin: '4px 0 10px 28px' }}>{r.sub}</div>
              <div style={{ font: 'var(--text-body)', color: 'var(--fg-2)', marginLeft: 28 }}>{r.steps}</div>
            </Panel>
          ))}
        </div>
        <Panel accent style={{ padding: 22, alignSelf: 'start' }}>
          <div style={{ font: 'var(--text-h2)', marginBottom: 16 }}>Service flow</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {flow.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--filo-green)', color: 'var(--fg-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: 'var(--text-label)', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ font: 'var(--text-body)', color: 'var(--fg-1)' }}>{f}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ── Settings ───────────────────────────────────────────────────────────── */

function SettingAppearance({ onBack, theme, onTheme }) {
  const modes = [
    { id: 'dark',  label: 'Dark',  sub: 'Obsidian Service — the default.',       icon: 'moon' },
    { id: 'light', label: 'Light', sub: 'Warm cream — for bright spaces.',        icon: 'sun'  },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="Appearance" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {modes.map(m => (
            <button key={m.id} onClick={() => onTheme(m.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 12, background: 'var(--filo-surface)', border: theme === m.id ? '1px solid var(--filo-green)' : '0.5px solid var(--border-cream)', cursor: 'pointer', textAlign: 'left', transition: 'border-color .15s' }}>
              <span style={{ width: 42, height: 42, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: theme === m.id ? 'var(--filo-green)' : 'var(--filo-surface-3)', transition: 'background .15s' }}>
                <Icon name={m.icon} size={20} color={theme === m.id ? 'var(--fg-1)' : 'var(--fg-2)'} />
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ font: 'var(--text-h3)', color: 'var(--fg-1)' }}>{m.label}</div>
                <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginTop: 3 }}>{m.sub}</div>
              </div>
              {theme === m.id && <Icon name="check-circle-2" size={20} color="var(--filo-green)" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Settings({ theme, onTheme }) {
  const [page, setPage] = React.useState(null);

  if (page === 'venue')      return <SettingVenue      onBack={() => setPage(null)} />;
  if (page === 'menu')       return <SettingMenu       onBack={() => setPage(null)} />;
  if (page === 'staff')      return <SettingStaff      onBack={() => setPage(null)} />;
  if (page === 'hours')      return <SettingHappyHour  onBack={() => setPage(null)} />;
  if (page === 'tips')       return <SettingTips       onBack={() => setPage(null)} />;
  if (page === 'float')      return <SettingFloat      onBack={() => setPage(null)} />;
  if (page === 'brand')      return <SettingBrand      onBack={() => setPage(null)} />;
  if (page === 'appearance') return <SettingAppearance onBack={() => setPage(null)} theme={theme} onTheme={onTheme} />;

  const rows = [
    { id: 'venue',      label: 'Venue details',    icon: 'building-2',  sub: 'Lumière · 64 covers · London' },
    { id: 'menu',       label: 'Menu management',  icon: 'utensils',    sub: '38 dishes · 12 drinks' },
    { id: 'staff',      label: 'Staff',            icon: 'users',       sub: '14 active · 4 on tonight' },
    { id: 'hours',      label: 'Happy hour',       icon: 'clock',       sub: 'Mon–Fri · 17:00–19:00' },
    { id: 'tips',       label: 'Tips',             icon: 'hand-coins',  sub: 'Pooled by hours worked' },
    { id: 'float',      label: 'Float',            icon: 'banknote',    sub: 'A$420.00 · configurable' },
    { id: 'brand',      label: 'Brand colour',     icon: 'palette',     sub: 'Racing green' },
    { id: 'appearance', label: 'Appearance',       icon: theme === 'light' ? 'sun' : 'moon', sub: theme === 'light' ? 'Light' : 'Dark' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar title="Settings" subtitle="Venue configuration" />
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        <div style={{ maxWidth: 620, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rows.map(({ id, label, icon, sub }) => (
            <button key={id} onClick={() => setPage(id)} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 18px', borderRadius: 12, cursor: 'pointer', textAlign: 'left', background: 'var(--filo-surface)', border: '0.5px solid var(--border-cream)', transition: 'background .15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--filo-surface-2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--filo-surface)'}>
              <span style={{ width: 42, height: 42, borderRadius: 11, background: 'var(--filo-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={icon} size={20} color="var(--fg-2)" />
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ font: 'var(--text-h3)' }}>{label}</div>
                <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginTop: 2 }}>{sub}</div>
              </div>
              <Icon name="chevron-right" size={20} color="var(--fg-4)" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

window.Guide = Guide; window.Settings = Settings;
