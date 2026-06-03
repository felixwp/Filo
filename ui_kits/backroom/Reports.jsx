/* Filo Backroom — Reports. Weekly performance, revenue trend, menu performance, insights. */

function DailyRevenueChart({ data }) {
  const [hovered, setHovered] = React.useState(null);
  const [mounted, setMounted]  = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const CHART_H = 180;
  const maxRev  = Math.max(...data.map(d => d.revenue));
  const avgRev  = data.reduce((s, d) => s + d.revenue, 0) / data.length;
  const bestIdx = data.reduce((bi, d, i) => d.revenue > data[bi].revenue ? i : bi, 0);
  const slowIdx = data.reduce((si, d, i) => d.revenue < data[si].revenue ? i : si, 0);
  const totalRev  = data.reduce((s, d) => s + d.revenue, 0);
  const wkndRev   = data.filter(d => d.day === 'Sat' || d.day === 'Sun').reduce((s, d) => s + d.revenue, 0);
  const wkndPct   = Math.round(wkndRev / totalRev * 100);
  const hd        = hovered !== null ? data[hovered] : null;
  const hdDelta   = hd ? ((hd.revenue - hd.lastWeek) / hd.lastWeek * 100).toFixed(1) : null;

  return (
    <Panel style={{ padding: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 15, color: 'var(--fg-1)', marginBottom: 3 }}>Day by day</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-3)' }}>Mon 2 – Sun 8 Jun · daily revenue vs last week</div>
        </div>
        <div style={{ textAlign: 'right', minWidth: 220 }}>
          {hd ? (
            <div>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, color: hovered === bestIdx ? 'var(--filo-gold)' : 'var(--fg-1)', marginBottom: 2 }}>
                {hd.day} {hd.date} · ${hd.revenue.toLocaleString()}
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-3)' }}>
                Last week ${hd.lastWeek.toLocaleString()} ·{' '}
                <span style={{ color: hd.revenue >= hd.lastWeek ? '#5cc88a' : '#d9806f', fontWeight: 700 }}>
                  {hd.revenue >= hd.lastWeek ? '+' : ''}{hdDelta}%
                </span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 14, justifyContent: 'flex-end', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--filo-green)' }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-4)' }}>This week</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(245,239,228,0.12)' }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-4)' }}>Last week</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Revenue labels row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
        {data.map((day, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <span style={{
              fontFamily: 'var(--font-sans)', fontSize: 11, fontVariantNumeric: 'tabular-nums',
              color: i === bestIdx ? 'var(--filo-gold)' : hovered === i ? 'var(--fg-1)' : 'var(--fg-4)',
              fontWeight: i === bestIdx || hovered === i ? 700 : 400,
            }}>
              ${(day.revenue / 1000).toFixed(1)}k
            </span>
          </div>
        ))}
      </div>

      {/* Chart area */}
      <div style={{ position: 'relative' }}>
        {/* Average line */}
        <div style={{
          position: 'absolute', left: 0, right: 0,
          bottom: (avgRev / maxRev) * CHART_H,
          borderTop: '1px dashed rgba(245,239,228,0.13)',
          pointerEvents: 'none', zIndex: 0,
        }}>
          <span style={{
            position: 'absolute', right: 0, top: -14,
            fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--fg-4)',
            background: '#1c1c1c', padding: '1px 5px', borderRadius: 3,
          }}>avg ${Math.round(avgRev / 100) * 100 / 1000 * 10 / 10 | 0}k</span>
        </div>

        {/* Bars */}
        <div style={{ display: 'flex', gap: 10, height: CHART_H, position: 'relative' }}>
          {data.map((day, i) => {
            const isBest = i === bestIdx;
            const isH    = hovered === i;
            const barH   = mounted ? Math.max(3, Math.round((day.revenue / maxRev) * CHART_H)) : 0;
            const lastH  = Math.round((day.lastWeek / maxRev) * CHART_H);

            return (
              <div
                key={i}
                style={{ flex: 1, position: 'relative', cursor: 'default' }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Ghost bar — last week */}
                <div style={{
                  position: 'absolute', bottom: 0, left: '8%', width: '84%',
                  height: lastH,
                  background: isH ? 'rgba(245,239,228,0.10)' : 'rgba(245,239,228,0.05)',
                  borderRadius: '4px 4px 0 0',
                  transition: 'background 0.2s',
                }} />
                {/* Main bar — this week */}
                <div style={{
                  position: 'absolute', bottom: 0, left: '22%', width: '56%',
                  height: barH,
                  background: isBest
                    ? 'linear-gradient(to top, rgba(140,88,8,1), rgba(201,146,30,1))'
                    : isH
                      ? 'linear-gradient(to top, rgba(8,45,24,1), rgba(22,140,65,1))'
                      : 'linear-gradient(to top, rgba(8,45,24,1), rgba(13,74,40,1))',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.75s cubic-bezier(0.22, 1, 0.36, 1), background 0.2s, box-shadow 0.2s',
                  boxShadow: isBest
                    ? '0 -6px 28px rgba(201,146,30,0.36)'
                    : isH
                      ? '0 -3px 18px rgba(13,74,40,0.5)'
                      : 'none',
                  zIndex: 1,
                }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Day labels + delta row */}
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        {data.map((day, i) => {
          const isBest = i === bestIdx;
          const isSlow = i === slowIdx;
          const isH    = hovered === i;
          const delta  = Math.round((day.revenue - day.lastWeek) / day.lastWeek * 100);
          const isUp   = delta >= 0;
          return (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-sans)', fontSize: 12,
                fontWeight: (isBest || isH) ? 700 : 400,
                color: isBest ? 'var(--filo-gold)' : isH ? 'var(--fg-1)' : 'var(--fg-3)',
              }}>{day.day}</div>
              <div style={{
                fontFamily: 'var(--font-sans)', fontSize: 10, marginTop: 2,
                color: isUp ? '#5cc88a' : '#d9806f',
              }}>{isUp ? '+' : ''}{delta}%</div>
              {isBest && (
                <div style={{ marginTop: 4, display: 'inline-block', padding: '2px 6px', background: 'rgba(201,146,30,0.14)', borderRadius: 4 }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 9, color: 'var(--filo-gold)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Best</span>
                </div>
              )}
              {isSlow && (
                <div style={{ marginTop: 4, display: 'inline-block', padding: '2px 6px', background: 'rgba(201,122,30,0.12)', borderRadius: 4 }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 9, color: '#e0973f', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Quiet</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary strip */}
      <div style={{ display: 'flex', marginTop: 20, paddingTop: 18, borderTop: '0.5px solid rgba(245,239,228,0.08)' }}>
        {[
          { dot: 'var(--filo-gold)', label: 'Best day',      value: `${data[bestIdx].day} · $${data[bestIdx].revenue.toLocaleString()}` },
          { dot: '#e0973f',          label: 'Quietest day',  value: `${data[slowIdx].day} · $${data[slowIdx].revenue.toLocaleString()}` },
          { dot: '#5cc88a',          label: 'Weekend share', value: `${wkndPct}% of revenue` },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1,
            display: 'flex', alignItems: 'flex-start', gap: 10,
            paddingLeft: i > 0 ? 20 : 0,
            marginLeft: i > 0 ? 20 : 0,
            borderLeft: i > 0 ? '0.5px solid rgba(245,239,228,0.08)' : 'none',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: 999, background: s.dot, marginTop: 3, flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-4)', marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--fg-1)' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

    </Panel>
  );
}

function Reports() {
  const d = window.BR_DATA;
  const [exported, setExported] = React.useState(false);
  const handleExport = () => { setExported(true); setTimeout(() => setExported(false), 2500); };
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
        right={
          exported
            ? <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 14px', background: 'rgba(20,99,58,0.15)', borderRadius: 8, border: '0.5px solid rgba(20,99,58,0.3)' }}>
                <Icon name="check" size={14} color="#5cc88a" />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: '#5cc88a' }}>CSV saved to downloads</span>
              </div>
            : <Button variant="secondary" icon="download" size="sm" onClick={handleExport}>Export CSV</Button>
        }
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

        {/* Day by day */}
        <DailyRevenueChart data={d.dailyRevenue} />

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
