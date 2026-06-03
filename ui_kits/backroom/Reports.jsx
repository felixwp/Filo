/* Filo Backroom — Reports. Weekly performance, revenue trend, menu performance, insights. */

function Reports() {
  const d = window.BR_DATA;
  const maxRev = Math.max(...d.weeklyRevenue.map(w => w.value));

  const insightFg = { green: '#5cc88a', amber: '#e0973f', gold: 'var(--filo-gold)', red: '#d9806f' };
  const insightBg = { green: 'rgba(20,99,58,0.10)', amber: 'rgba(201,122,30,0.09)', gold: 'rgba(201,146,30,0.09)', red: 'rgba(158,59,46,0.09)' };

  const pctChange = (a, b) => {
    const pct = ((a - b) / b * 100).toFixed(1);
    return pct > 0 ? `+${pct}%` : `${pct}%`;
  };

  const sortedItems  = [...d.menuItems].sort((a, b) => b.revenue - a.revenue);
  const topByMargin  = [...d.menuItems].sort((a, b) => b.margin - a.margin).slice(0, 5);
  const belowTarget  = [...d.menuItems].filter(item => item.margin < d.marginTarget).sort((a, b) => a.margin - b.margin);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar
        title="Reports"
        subtitle="Weekly performance · menu · trends · insights"
        right={<Button variant="secondary" icon="download" size="sm">Export CSV</Button>}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '22px 28px 28px', display: 'flex', flexDirection: 'column', gap: 22 }}>

        {/* Week comparison */}
        <div>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16, color: 'var(--fg-1)', marginBottom: 12 }}>This week at a glance</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {d.weekComps.map((wk, i) => (
              <Panel key={i} style={{ padding: '20px 22px' }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>{wk.label}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[
                    { label: 'Revenue',   value: `$${wk.revenue.toLocaleString()}`, gold: true },
                    { label: 'Covers',    value: wk.covers },
                    { label: 'Avg spend', value: `$${wk.avgSpend}` },
                    { label: 'Tips',      value: `$${wk.tips.toLocaleString()}`, gold: true },
                  ].map((stat, j) => (
                    <div key={j}>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-3)', marginBottom: 4 }}>{stat.label}</div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 20, color: stat.gold ? 'var(--filo-gold)' : 'var(--fg-1)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{stat.value}</div>
                    </div>
                  ))}
                </div>
                {i === 0 && (
                  <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px', background: 'rgba(20,99,58,0.10)', borderRadius: 7 }}>
                    <Icon name="trending-up" size={13} color="#5cc88a" />
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: '#5cc88a', fontWeight: 700 }}>
                      {pctChange(d.weekComps[0].revenue, d.weekComps[1].revenue)} revenue vs last week
                    </span>
                  </div>
                )}
              </Panel>
            ))}
          </div>
        </div>

        {/* Revenue trend */}
        <Panel style={{ padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 15, color: 'var(--fg-1)', marginBottom: 3 }}>Revenue trend</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-3)', marginBottom: 24 }}>Last 8 weeks · weekly total</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 130 }}>
            {d.weeklyRevenue.map((wk, i) => {
              const isLatest = i === d.weeklyRevenue.length - 1;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: isLatest ? 'var(--fg-1)' : 'var(--fg-4)', fontWeight: isLatest ? 700 : 400, fontVariantNumeric: 'tabular-nums' }}>
                    ${Math.round(wk.value / 1000)}k
                  </span>
                  <div style={{
                    width: '100%',
                    height: `${(wk.value / maxRev) * 98}px`,
                    background: isLatest ? 'var(--filo-gold)' : 'var(--filo-green)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height .4s var(--ease-out)',
                  }} />
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: isLatest ? 'var(--fg-2)' : 'var(--fg-4)', fontWeight: isLatest ? 700 : 400 }}>{wk.label}</span>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* Menu performance */}
        <div>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16, color: 'var(--fg-1)', marginBottom: 12 }}>Menu performance</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

            {/* Top by revenue */}
            <Panel style={{ padding: '20px 22px' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, color: 'var(--fg-1)', marginBottom: 4 }}>Top sellers · by revenue</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-3)', marginBottom: 16 }}>This week</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {sortedItems.slice(0, 6).map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-4)', width: 16, textAlign: 'right', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{i + 1}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--fg-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-3)', marginTop: 1 }}>{item.sold} sold · {item.margin}% margin</div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--filo-gold)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>${item.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Panel>

            {/* Below margin target */}
            <Panel style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, color: 'var(--fg-1)' }}>Below margin target</div>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 999, background: 'rgba(201,122,30,0.18)', color: '#e0973f' }}>{belowTarget.length} items</span>
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-3)', marginBottom: 16 }}>Target {d.marginTarget}% · consider repricing or removing</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {belowTarget.map((item, i) => {
                  const gap = (d.marginTarget - item.margin).toFixed(1);
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: 999, background: item.margin < 50 ? '#d9806f' : '#e0973f', flexShrink: 0, marginLeft: 5 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--fg-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-3)', marginTop: 1 }}>{item.category} · {item.sold} sold</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: item.margin < 50 ? '#d9806f' : '#e0973f', fontVariantNumeric: 'tabular-nums' }}>{item.margin}%</div>
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-4)' }}>−{gap}pp</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>
          </div>
        </div>

        {/* Insights */}
        <div>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16, color: 'var(--fg-1)', marginBottom: 12 }}>Weekly insights</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {d.insights.map((ins, i) => (
              <Panel key={i} style={{ padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start', background: insightBg[ins.tone] }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={ins.icon} size={17} color={insightFg[ins.tone]} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, color: 'var(--fg-1)', marginBottom: 5 }}>{ins.title}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.55 }}>{ins.body}</div>
                </div>
              </Panel>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
window.Reports = Reports;
