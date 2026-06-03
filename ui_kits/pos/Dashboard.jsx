/* Filo POS — live sales dashboard. Owner-facing figures, gold for money. */
function Stat({ label, value, gold, sub }) {
  return (
    <Panel style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ font: 'var(--text-label)', color: 'var(--fg-3)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 34, color: gold ? 'var(--filo-gold)' : 'var(--fg-1)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      {sub && <span style={{ font: 'var(--text-label)', color: 'var(--fg-3)' }}>{sub}</span>}
    </Panel>
  );
}

function Dashboard() {
  const d = window.FILO_DATA.dashboard;
  const max = Math.max(...d.hourly);
  const hours = ['5p', '6p', '7p', '8p', '9p', '10p', '11p', '12a', '1a', '2a'];
  const labourFg = d.labourStatus === 'green' ? '#5cc88a' : d.labourStatus === 'amber' ? '#e0973f' : '#d9806f';
  const labourStatusLabel = { green: 'On target', amber: 'Watch', red: 'Over target' }[d.labourStatus];
  const channelColors = ['var(--filo-green)', '#e0973f', 'rgba(245,239,228,0.22)'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0 }}>
      <TopBar title="Sales tonight" subtitle="Live · updates every order"
        right={<Pill tone="occupied" dot>{d.open} tables open</Pill>} />
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 14 }}>
          <Stat label="Revenue" value={`$${d.revenue.toLocaleString()}`} gold sub="+12% vs last Tue" />
          <Stat label="Covers" value={d.covers} sub="86 seated · 7 open" />
          <Stat label="Average spend" value={`$${d.avgSpend}`} sub="per cover" />
          <Stat label="Tips pooled" value={`$${d.tips}`} gold sub="auto by hours worked" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 0.9fr 0.85fr', gap: 14 }}>
          <Panel style={{ padding: 22 }}>
            <div style={{ font: 'var(--text-h2)', marginBottom: 4 }}>Covers by hour</div>
            <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginBottom: 22 }}>Service curve · tonight</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 180 }}>
              {d.hourly.map((v, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: '100%', height: `${(v / max) * 150}px`, background: i === 6 ? 'var(--filo-gold)' : 'var(--filo-green)', borderRadius: '6px 6px 0 0', transition: 'height .4s var(--ease-out)' }} />
                  <span style={{ font: 'var(--text-label)', color: 'var(--fg-4)' }}>{hours[i]}</span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel style={{ padding: 22 }}>
            <div style={{ font: 'var(--text-h2)', marginBottom: 18 }}>Top items</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {d.topItems.map((it, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ font: 'var(--text-num)', color: 'var(--fg-4)', width: 22 }}>{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: 'var(--text-h3)', fontWeight: 400 }}>{it.name}</div>
                    <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)' }}>{it.count} sold</div>
                  </div>
                  <Money amount={it.revenue} size={16} />
                </div>
              ))}
            </div>
          </Panel>
          {/* Labour + Channel column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Labour cost card */}
            <div style={{
              background: 'var(--filo-surface)', border: '0.5px solid var(--border-cream)',
              borderLeft: `3px solid ${labourFg}`, borderRadius: 'var(--radius-card)',
              padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              <span style={{ font: 'var(--text-label)', fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Labour cost</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 28, color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{d.labourPct}%</span>
                <span style={{ font: 'var(--text-label)', color: 'var(--fg-4)', marginLeft: 'auto' }}>target {d.labourTarget}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: labourFg, flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700, color: labourFg }}>{labourStatusLabel}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-4)', marginLeft: 2 }}>· {(d.labourPct - d.labourTarget).toFixed(1)}% over</span>
              </div>
            </div>
            {/* Channel breakdown */}
            <Panel style={{ padding: '16px 18px', flex: 1 }}>
              <div style={{ font: 'var(--text-h2)', marginBottom: 3 }}>By channel</div>
              <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginBottom: 12 }}>Tonight's split</div>
              <div style={{ display: 'flex', height: 5, borderRadius: 999, overflow: 'hidden', marginBottom: 12, gap: 2 }}>
                {d.channels.map((c, i) => (
                  <div key={i} style={{ width: `${c.pct}%`, background: channelColors[i], borderRadius: 999 }} />
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {d.channels.map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 7, height: 7, borderRadius: 999, background: channelColors[i], flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-2)', flex: 1 }}>{c.label}</span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-4)', fontVariantNumeric: 'tabular-nums', width: 30, textAlign: 'right' }}>{c.pct}%</span>
                    <Money amount={c.revenue} size={12} />
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}
window.Dashboard = Dashboard;
