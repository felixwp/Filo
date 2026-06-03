/* Filo POS — Kitchen Display System.
   One docket per table, showing the WHOLE order so the line can plan and prep.
   • Firing courses are active — the kitchen plates and marks them ready (away).
   • Held courses stay visible (dimmed, "ON HOLD") so prep starts early, but they
     don't get plated until front-of-house fires them with "Course away". */

function CourseBlock({ course, onReady }) {
  const st = course.state; // hold | firing | away
  const tone = { hold: 'var(--filo-gold)', firing: '#5cc88a', away: 'var(--fg-3)' }[st];
  const bg = st === 'firing' ? 'rgba(20,99,58,0.10)' : 'transparent';
  return (
    <div style={{ borderTop: '0.5px solid var(--border-cream)', padding: '11px 14px', background: bg, opacity: st === 'hold' ? 0.62 : 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ font: 'var(--text-pill)', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--fg-2)' }}>{course.label}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, font: 'var(--text-micro)', letterSpacing: '0.1em', textTransform: 'uppercase', color: tone }}>
          {st === 'firing' && <><Icon name="flame" size={12} color={tone} /> Firing</>}
          {st === 'hold' && <><Icon name="pause" size={11} color={tone} /> On hold</>}
          {st === 'away' && <><Icon name="check-circle-2" size={12} color={tone} /> Away</>}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {course.items.map((it, i) => (
          <div key={i} style={{ font: 'var(--text-body)', color: st === 'away' ? 'var(--fg-3)' : 'var(--fg-1)', display: 'flex', gap: 9, alignItems: 'center', textDecoration: st === 'away' ? 'line-through' : 'none' }}>
            <span style={{ font: 'var(--text-label)', fontWeight: 700, color: tone, minWidth: 16, fontVariantNumeric: 'tabular-nums' }}>{it.qty}×</span>
            {it.name}
          </div>
        ))}
      </div>
      {st === 'firing' && (
        <Button full variant="primary" icon="bell-ring" onClick={onReady} style={{ marginTop: 10, minHeight: 42 }}>Mark ready</Button>
      )}
      {st === 'hold' && (
        <div style={{ marginTop: 9, font: 'var(--text-micro)', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-4)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="clock" size={12} color="var(--fg-4)" /> Prep · hold for course-away
        </div>
      )}
    </div>
  );
}

function DocketCard({ docket, onReady }) {
  const anyFiring = docket.courses.some(c => c.state === 'firing');
  const allAway = docket.courses.every(c => c.state === 'away');
  const edge = allAway ? 'rgba(20,99,58,0.5)' : anyFiring ? 'var(--border-cream)' : 'rgba(201,146,30,0.6)';
  return (
    <div style={{ background: 'var(--filo-surface)', borderRadius: 14, border: `0.5px solid ${edge}`, overflow: 'hidden', opacity: allAway ? 0.55 : 1, transition: 'opacity .3s', alignSelf: 'start' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px' }}>
        <span style={{ font: 'var(--text-h2)' }}>T{docket.table}</span>
        <span style={{ font: 'var(--text-label)', color: 'var(--fg-3)' }}>{docket.covers} PAX</span>
        <span style={{ font: 'var(--text-num)', color: docket.sentMins > 10 ? 'var(--filo-gold)' : 'var(--fg-2)', fontVariantNumeric: 'tabular-nums' }}>{docket.sentMins}m</span>
      </div>
      {docket.courses.map(c => (
        <CourseBlock key={c.n} course={c} onReady={() => onReady(docket.table, c.n)} />
      ))}
    </div>
  );
}

function KDS({ dockets, onReady }) {
  const list = Object.values(dockets).filter(d => d.courses.length);
  const activeCourses = list.reduce((n, d) => n + d.courses.filter(c => c.state === 'firing').length, 0);
  const heldCourses = list.reduce((n, d) => n + d.courses.filter(c => c.state === 'hold').length, 0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0 }}>
      <TopBar title="Kitchen display" subtitle="The pass · live"
        right={<>
          <Pill tone="occupied" dot>{activeCourses} firing</Pill>
          <Pill tone="bill" dot>{heldCourses} held</Pill>
        </>} />
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14, alignItems: 'start' }}>
          {list.map(d => <DocketCard key={d.table} docket={d} onReady={onReady} />)}
        </div>
      </div>
    </div>
  );
}
window.KDS = KDS;
