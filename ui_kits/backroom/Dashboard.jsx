/* Filo Backroom — Dashboard. Live tonight view. */

function LiveDot() {
  const [on, setOn] = React.useState(true);
  React.useEffect(() => {
    const id = setInterval(() => setOn(v => !v), 950);
    return () => clearInterval(id);
  }, []);
  return <span style={{ width: 7, height: 7, borderRadius: 999, background: on ? '#5cc88a' : 'rgba(92,200,138,0.25)', display: 'inline-block', transition: 'background 0.5s', flexShrink: 0 }} />;
}

function StatCard({ label, value, sub, gold }) {
  return (
    <Panel style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 7 }}>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 400, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 36, lineHeight: 1, color: gold ? 'var(--filo-gold)' : 'var(--fg-1)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      {sub && <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-3)' }}>{sub}</span>}
    </Panel>
  );
}

function CostCard({ label, pct, target, amount, status }) {
  const fg = { green: '#5cc88a', amber: '#e0973f', red: '#d9806f' }[status];
  const statusLabel = { green: 'On target', amber: 'Watch', red: 'Over target' }[status];
  const diff = Math.abs(pct - target).toFixed(1);
  const diffLabel = pct <= target ? `${diff}% under` : `${diff}% over`;

  return (
    <div style={{
      background: 'var(--filo-surface)',
      border: '0.5px solid var(--border-cream)',
      borderLeft: `3px solid ${fg}`,
      borderRadius: 'var(--radius-card)',
      padding: '14px 18px',
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 9 }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 26, color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{pct}%</span>
        {amount != null && (
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--fg-3)', fontVariantNumeric: 'tabular-nums' }}>${amount.toLocaleString()}</span>
        )}
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-4)', marginLeft: 'auto' }}>target {target}%</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: fg, flexShrink: 0 }} />
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700, color: fg }}>{statusLabel}</span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-4)', marginLeft: 2 }}>· {diffLabel}</span>
      </div>
    </div>
  );
}

function ChannelBreakdown({ channels }) {
  const total = channels.reduce((s, c) => s + c.revenue, 0);
  const colors = ['var(--filo-green)', '#e0973f', 'rgba(245,239,228,0.22)'];
  return (
    <Panel style={{ padding: '18px 20px' }}>
      <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 15, color: 'var(--fg-1)', marginBottom: 3 }}>Revenue by channel</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-3)', marginBottom: 14 }}>Tonight's split</div>
      {/* Segmented bar */}
      <div style={{ display: 'flex', height: 6, borderRadius: 999, overflow: 'hidden', marginBottom: 14, gap: 2 }}>
        {channels.map((c, i) => (
          <div key={i} style={{ width: `${c.pct}%`, background: colors[i], borderRadius: 999 }} />
        ))}
      </div>
      {/* Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {channels.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: colors[i], flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--fg-2)', flex: 1 }}>{c.label}</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-4)', fontVariantNumeric: 'tabular-nums', width: 34, textAlign: 'right' }}>{c.pct}%</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums', width: 54, textAlign: 'right' }}>${c.revenue.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function StaffOnTonight({ members }) {
  return (
    <Panel style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 15, color: 'var(--fg-1)' }}>Staff on tonight</span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-4)', fontVariantNumeric: 'tabular-nums' }}>{members.length} clocked in</span>
      </div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-3)', marginBottom: 14 }}>Active this service</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        {members.map((m, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 999, flexShrink: 0,
              background: 'var(--filo-green)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700, color: 'var(--fg-1)', letterSpacing: '0.03em' }}>{m.initials}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--fg-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-3)', marginTop: 1 }}>{m.role} · {m.section}</div>
            </div>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-4)', flexShrink: 0 }}>{m.clockedIn}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function NotesField() {
  const [note, setNote] = React.useState('');
  const [saved, setSaved] = React.useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2200); };
  return (
    <Panel style={{ padding: '16px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, color: 'var(--fg-1)' }}>Manager notes</span>
        {saved
          ? <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 700, color: '#5cc88a' }}>Saved</span>
          : <Button size="sm" variant="secondary" onClick={save} disabled={!note.trim()}>Save</Button>
        }
      </div>
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Events, incidents, supplier issues, anything worth logging for this service..."
        style={{
          width: '100%', minHeight: 62, background: 'var(--filo-surface-3)',
          border: '0.5px solid var(--border-cream)', borderRadius: 8,
          padding: '9px 11px', color: 'var(--fg-1)',
          fontFamily: 'var(--font-sans)', fontSize: 13,
          resize: 'none', outline: 'none', lineHeight: 1.5,
          boxSizing: 'border-box',
        }}
      />
    </Panel>
  );
}

function Dashboard() {
  const t = window.BR_DATA.tonight;
  const max = Math.max(...t.hourly);
  const nowIdx = 4;
  const [alertDismissed, setAlertDismissed] = React.useState(false);
  const c = t.costs;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar
        title="Good evening, Felix."
        subtitle="Tuesday 3 June · The Finch · Collingwood"
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--filo-surface)', border: '0.5px solid var(--border-cream)', borderRadius: 20, padding: '6px 14px' }}>
            <LiveDot />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--fg-2)' }}>Live</span>
          </div>
        }
      />

      {/* Low stock alert */}
      {!alertDismissed && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 28px', background: 'rgba(201,122,30,0.09)', borderBottom: '0.5px solid rgba(201,122,30,0.28)', flexShrink: 0 }}>
          <Icon name="alert-triangle" size={15} color="#e0973f" />
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--fg-1)', flex: 1 }}>
            <strong>Negroni pre-batch critically low</strong> · 1.5 L remaining against 4 L par · plus 4 other items below par. Mornington Meats order due tomorrow.
          </span>
          <button onClick={() => setAlertDismissed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-4)', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, padding: '2px 8px' }}>Dismiss</button>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px 28px' }}>

        {/* Row 1 — Revenue stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
          <StatCard label="Revenue tonight" value={`$${t.revenue.toLocaleString()}`} sub="+12% vs last Tuesday" gold />
          <StatCard label="Covers"          value={t.covers}                         sub={`${t.openTables} tables still open`} />
          <StatCard label="Avg spend"        value={`$${t.avgSpend}`}                 sub="per cover" />
          <StatCard label="Tips pooled"      value={`$${t.tips}`}                     sub="auto by hours worked" gold />
        </div>

        {/* Row 2 — Cost health */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
          <CostCard label="Labour cost"  pct={c.labour.pct} target={c.labour.target} amount={c.labour.amount} status={c.labour.status} />
          <CostCard label="Food cost"    pct={c.food.pct}   target={c.food.target}                             status={c.food.status}   />
          <CostCard label="Prime cost"   pct={c.prime.pct}  target={c.prime.target}                            status={c.prime.status}  />
          <CostCard label="Voids & comps" pct={c.voids.pct} target={c.voids.target}  amount={c.voids.amount}  status={c.voids.status}  />
        </div>

        {/* Row 3 — Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.55fr 0.85fr 0.85fr 0.85fr', gap: 12 }}>
          {/* Covers by hour */}
          <Panel style={{ padding: '20px 22px' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 15, color: 'var(--fg-1)', marginBottom: 2 }}>Covers by hour</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-3)', marginBottom: 20 }}>Service curve · tonight</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 7, height: 140 }}>
              {t.hourly.map((v, i) => {
                const isNow = i === nowIdx;
                const isFuture = i > nowIdx;
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
                    <div style={{
                      width: '100%',
                      height: `${Math.max(3, (v / max) * 122)}px`,
                      background: isNow ? 'var(--filo-gold)' : isFuture ? 'var(--filo-surface-3)' : 'var(--filo-green)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height .4s var(--ease-out)',
                      opacity: isFuture ? 0.4 : 1,
                    }} />
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: isNow ? 'var(--filo-gold)' : 'var(--fg-4)', fontWeight: isNow ? 700 : 400 }}>{t.hours[i]}</span>
                  </div>
                );
              })}
            </div>
          </Panel>

          {/* Top items */}
          <Panel style={{ padding: '20px 20px' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 15, color: 'var(--fg-1)', marginBottom: 16 }}>Top items</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              {t.topItems.map((it, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-4)', width: 14, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 700, color: 'var(--fg-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-3)', marginTop: 1 }}>{it.count} sold</div>
                  </div>
                  <Money amount={it.revenue} size={12} />
                </div>
              ))}
            </div>
          </Panel>

          {/* Channel + Notes stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <ChannelBreakdown channels={t.channels} />
            <NotesField />
          </div>

          {/* Staff on tonight */}
          <StaffOnTonight members={t.staffOnTonight} />
        </div>

      </div>
    </div>
  );
}
window.Dashboard = Dashboard;
