/* Filo Backroom — Roster & Pay. Staff hours, Australian Award penalty rates, tip split. */

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DAY_PENALTY = { Mon:1.0, Tue:1.0, Wed:1.0, Thu:1.0, Fri:1.0, Sat:1.25, Sun:1.5 };

const DAY_COLOR = {
  weekday: 'var(--filo-green)',
  Sat: '#e0973f',
  Sun: '#d9806f',
};

function dayColor(day) {
  if (day === 'Sat') return DAY_COLOR.Sat;
  if (day === 'Sun') return DAY_COLOR.Sun;
  return DAY_COLOR.weekday;
}

const GRID = '1fr 118px 64px 36px 36px 36px 36px 36px 36px 36px 110px 130px';

function TableHeader() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: GRID, gap: 0, padding: '11px 22px', borderBottom: '0.5px solid var(--border-cream)', background: 'var(--filo-surface-2)' }}>
      {['Staff member', 'Role', 'Hours', ...DAYS, 'Tips', 'Total pay'].map((h, i) => (
        <span key={i} style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 10, color: i === 8 ? '#e0973f' : i === 9 ? '#d9806f' : 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.07em', textAlign: i > 2 ? 'center' : 'left' }}>{h}</span>
      ))}
    </div>
  );
}

function StaffRow({ member, ratePerHour, last }) {
  const hours    = member.shiftDays.reduce((s, d) => s + d.hours, 0);
  const basePay  = member.shiftDays.reduce((s, d) => s + d.hours * member.rate * d.penalty, 0);
  const tipShare = hours * ratePerHour;
  const totalPay = basePay + tipShare;

  const workedDays = member.shiftDays.map(d => d.day);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: GRID, gap: 0, padding: '13px 22px', borderBottom: last ? 'none' : '0.5px solid var(--border-cream)', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <div style={{ width: 30, height: 30, borderRadius: 999, background: 'var(--filo-green)', color: 'var(--fg-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>
          {member.initials}
        </div>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--fg-1)' }}>{member.name}</span>
      </div>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-3)' }}>{member.role}</span>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums' }}>{hours}h</span>
      {DAYS.map(day => (
        <div key={day} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {workedDays.includes(day) ? (
            <div style={{ width: 9, height: 9, borderRadius: 999, background: dayColor(day) }} />
          ) : (
            <div style={{ width: 9, height: 9, borderRadius: 999, border: '1.5px solid var(--border-cream)' }} />
          )}
        </div>
      ))}
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--filo-gold)', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
        ${tipShare.toFixed(2)}
      </span>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
        ${totalPay.toFixed(2)}
      </span>
    </div>
  );
}

function Roster() {
  const d = window.BR_DATA;
  const totalHours   = d.staff.reduce((s, m) => s + m.shiftDays.reduce((a, x) => a + x.hours, 0), 0);
  const totalBasePay = d.staff.reduce((s, m) => s + m.shiftDays.reduce((a, x) => a + x.hours * m.rate * x.penalty, 0), 0);
  const ratePerHour  = d.tipPool.total / totalHours;
  const weekendPremium = d.staff.reduce((s, m) => s + m.shiftDays.filter(x => x.penalty > 1).reduce((a, x) => a + x.hours * m.rate * (x.penalty - 1), 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar
        title="Roster & Pay"
        subtitle={`Week · ${d.tipPool.period}`}
        right={<Button variant="secondary" icon="download" size="sm">Export payroll</Button>}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '22px 28px 28px' }}>
        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Tips pooled',       value: `$${d.tipPool.total.toLocaleString()}`,   sub: 'Auto-calculated',           gold: true  },
            { label: 'Total hours',       value: `${totalHours.toFixed(1)}h`,               sub: `${d.staff.length} staff`               },
            { label: 'Rate per hour',     value: `$${ratePerHour.toFixed(2)}`,              sub: 'Tips ÷ total hours'                     },
            { label: 'Weekend premium',   value: `$${weekendPremium.toFixed(0)}`,           sub: 'Sat ×1.25 · Sun ×1.5 (Award)'          },
          ].map((card, i) => (
            <Panel key={i} style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 7 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 400, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{card.label}</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 28, lineHeight: 1, color: card.gold ? 'var(--filo-gold)' : 'var(--fg-1)', fontVariantNumeric: 'tabular-nums' }}>{card.value}</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-3)' }}>{card.sub}</span>
            </Panel>
          ))}
        </div>

        {/* Roster table */}
        <Panel style={{ overflow: 'hidden' }}>
          <TableHeader />
          {d.staff.map((member, i) => (
            <StaffRow key={member.id} member={member} ratePerHour={ratePerHour} last={i === d.staff.length - 1} />
          ))}

          {/* Totals row */}
          <div style={{ display: 'grid', gridTemplateColumns: GRID, gap: 0, padding: '13px 22px', background: 'var(--filo-surface-2)', borderTop: '0.5px solid var(--border-cream)' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, color: 'var(--fg-1)', gridColumn: '1 / 3' }}>Totals</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums' }}>{totalHours.toFixed(1)}h</span>
            {DAYS.map(day => <span key={day} />)}
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, color: 'var(--filo-gold)', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
              ${d.tipPool.total.toLocaleString()}
            </span>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
              ${(totalBasePay + d.tipPool.total).toFixed(2)}
            </span>
          </div>
        </Panel>

        {/* Award legend + notes */}
        <div style={{ display: 'flex', gap: 20, marginTop: 14, alignItems: 'flex-start' }}>
          {/* Penalty rate key */}
          <Panel style={{ padding: '14px 18px', display: 'flex', gap: 18, alignItems: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700, color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Award rates</span>
            {[
              { dot: 'var(--filo-green)', label: 'Mon–Fri', rate: '×1.0' },
              { dot: '#e0973f',           label: 'Saturday', rate: '×1.25' },
              { dot: '#d9806f',           label: 'Sunday',   rate: '×1.5'  },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 8, height: 8, borderRadius: 999, background: r.dot, flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-2)' }}>{r.label}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 700, color: 'var(--fg-3)' }}>{r.rate}</span>
              </div>
            ))}
          </Panel>

          {/* Tip method note */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', paddingTop: 4, flex: 1 }}>
            <Icon name="info" size={13} color="var(--fg-4)" style={{ marginTop: 1, flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.55 }}>
              Penalty rates applied per Hospitality Industry (General) Award 2020. Base pay = hours × rate × penalty multiplier. Tips split proportionally by total hours worked.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
window.Roster = Roster;
