/* Filo POS — table order.
   Coursing model (matches a real pass):
   • Build the WHOLE order first — entrées, mains, dessert — across courses, holding
     them all. You can add a second/third course before anything is sent.
   • "Send order to kitchen" pushes the entire order as ONE docket, so the kitchen
     sees every course together and can start prep on the slow items straight away.
   • Course 1 fires immediately (away); later courses land on HOLD. When the table's
     ready, "Course away" fires the next course — the kitchen's hold flips to firing.
   • Long press any menu item to open suggested pairings without cluttering the order. */

const COURSE_NAMES = { 1: 'Entrées', 2: 'Mains', 3: 'Dessert' };
const courseLabel = (n) => COURSE_NAMES[n] || `Course ${n}`;

/* ── Pairing overlay — opened by long press ────────────────────────────── */
function PairingOverlay({ item, byId, onAdd, onClose }) {
  const pairs = (item.pair || []).map(pid => byId[pid]).filter(Boolean);
  const isDrink = item.kind === 'wine' || item.kind === 'cocktail';

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}
      onClick={onClose}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.65)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }} />
      <div style={{ position: 'relative', width: '100%', maxWidth: 480, background: 'var(--filo-surface)', border: '0.5px solid var(--border-green)', borderRadius: 20, padding: 28, boxShadow: 'var(--shadow-lg)' }}
        onClick={e => e.stopPropagation()}>

        {/* header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
          <div>
            <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginBottom: 5 }}>
              {isDrink ? 'Goes well with' : 'Suggested drinks'}
            </div>
            <div style={{ font: 'var(--text-h1)' }}>{item.name}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-3)', display: 'flex', padding: 4, marginTop: -2 }}>
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* pairing items */}
        {pairs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pairs.map(p => (
              <button key={p.id} onClick={() => { onAdd(p); onClose(); }}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 12, border: '0.5px solid var(--border-cream)', background: 'var(--filo-black)', cursor: 'pointer', textAlign: 'left', transition: 'border-color .15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--filo-green)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-cream)'}>
                <Icon name={isDrink ? 'utensils' : 'wine'} size={20} color="var(--filo-green)" />
                <div style={{ flex: 1 }}>
                  <div style={{ font: 'var(--text-h3)', color: 'var(--fg-1)' }}>{p.name}</div>
                  {p.unit && <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginTop: 2 }}>{p.unit}</div>}
                </div>
                <Money amount={p.price} size={16} />
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--filo-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="plus" size={16} color="var(--fg-1)" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div style={{ font: 'var(--text-body)', color: 'var(--fg-3)', textAlign: 'center', padding: '20px 0' }}>
            No pairings on record for this item.
          </div>
        )}

        <div style={{ font: 'var(--text-label)', color: 'var(--fg-4)', textAlign: 'center', marginTop: 20 }}>
          Tap a suggestion to add it to the order · tap outside to dismiss
        </div>
      </div>
    </div>
  );
}

/* ── Menu item card — tap to add, long press (500ms) for pairings ────────── */
function MenuItemCard({ item, onAdd, onPairRequest }) {
  const timerRef      = React.useRef(null);
  const longFiredRef  = React.useRef(false);
  const [holding, setHolding] = React.useState(false);
  const hasPairs = item.pair && item.pair.length > 0;

  const startHold = () => {
    longFiredRef.current = false;
    setHolding(true);
    if (hasPairs && onPairRequest) {
      timerRef.current = setTimeout(() => {
        longFiredRef.current = true;
        setHolding(false);
        onPairRequest(item);
      }, 500);
    }
  };

  const cancelHold = () => {
    setHolding(false);
    clearTimeout(timerRef.current);
  };

  const handleClick = () => {
    if (!longFiredRef.current) onAdd(item);
  };

  return (
    <button
      onMouseDown={startHold} onMouseUp={cancelHold} onMouseLeave={cancelHold}
      onClick={handleClick}
      style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16, textAlign: 'left', cursor: 'pointer', position: 'relative',
        background: holding ? 'var(--filo-surface-2)' : 'var(--filo-surface)',
        border: holding ? '0.5px solid var(--filo-green)' : '0.5px solid var(--border-cream)',
        borderRadius: 14,
        transform: holding ? 'scale(0.97)' : 'scale(1)',
        transition: 'transform .1s var(--ease-out), background .15s, border-color .2s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <span style={{ font: 'var(--text-h3)' }}>{item.name}</span>
        <Money amount={item.price} size={16} />
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', minHeight: 20 }}>
        {item.unit && <span style={{ font: 'var(--text-label)', color: 'var(--fg-3)' }}>{item.unit}</span>}
        {item.tags && item.tags.map(t => <Tag key={t}>{t}</Tag>)}
      </div>
      {/* subtle pairing hint — lets staff know a long press is available */}
      {hasPairs && (
        <span style={{ position: 'absolute', bottom: 10, right: 12, display: 'flex', alignItems: 'center', gap: 3, font: 'var(--text-label)', fontSize: 11, color: 'var(--fg-4)' }}>
          <Icon name="wine" size={12} color="var(--fg-4)" />
        </span>
      )}
    </button>
  );
}

/* ── Course status chip ─────────────────────────────────────────────────── */
function CourseStatus({ state }) {
  const map = {
    building: { fg: 'var(--filo-gold)',  label: 'Building', dot: true },
    hold:     { fg: 'var(--filo-gold)',  label: 'On hold',  dot: true },
    firing:   { fg: '#5cc88a', label: 'Firing',   icon: 'flame'         },
    away:     { fg: '#5cc88a', label: 'Away',     icon: 'check-circle-2' },
  };
  const s = map[state] || map.building;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--text-micro)', letterSpacing: '0.1em', textTransform: 'uppercase', color: s.fg }}>
      {s.icon ? <Icon name={s.icon} size={13} color={s.fg} /> : <span style={{ width: 7, height: 7, borderRadius: 999, background: s.fg }} />}
      {s.label}
    </span>
  );
}

/* ── Main table order screen ────────────────────────────────────────────── */
function TableOrder({ table, user, onBack, onSendOrder, onFireCourse, onBill, docket }) {
  const { menu, byId } = window.FILO_DATA;
  const cats = Object.keys(menu);
  const [cat,         setCat]         = React.useState('Starters');
  const [order,       setOrder]       = React.useState([]);
  const [course,      setCourse]      = React.useState(1);
  const [pairingItem, setPairingItem] = React.useState(null);
  const [pulse,       setPulse]       = React.useState(false);
  const [notesOpen,   setNotesOpen]   = React.useState(false);
  const [noteText,    setNoteText]    = React.useState('');
  const [noteSaved,   setNoteSaved]   = React.useState(false);

  const docketCourses = (docket && docket.courses) || [];
  const stateOf = (n) => { const dc = docketCourses.find(c => c.n === n); return dc ? dc.state : 'building'; };

  const add = (item) => {
    if (stateOf(course) !== 'building') return;
    setOrder(o => [...o, { key: Math.random().toString(36).slice(2), item, course }]);
  };
  const remove = (key) => setOrder(o => o.filter(x => x.key !== key));

  const courses     = [...new Set(order.map(o => o.course))].sort((a, b) => a - b);
  const courseTabs  = [...new Set([...order.map(o => o.course), course])].sort((a, b) => a - b);
  const startNewCourse = () => setCourse(Math.max(0, ...courseTabs) + 1);
  const selectCourse   = (c) => { if (stateOf(c) === 'building') setCourse(c); };

  const buildingToSend = courses.filter(c => stateOf(c) === 'building' && order.some(o => o.course === c));
  const buildPayload = (nums) => nums.map(n => {
    const map = {};
    order.filter(o => o.course === n).forEach(o => { map[o.item.name] = (map[o.item.name] || 0) + 1; });
    return { n, label: courseLabel(n), items: Object.entries(map).map(([name, qty]) => ({ name, qty })) };
  });
  const sendOrder = () => {
    if (!buildingToSend.length) return;
    onSendOrder && onSendOrder(table, buildPayload(buildingToSend));
    setPulse(true); setTimeout(() => setPulse(false), 1100);
  };

  const total    = order.reduce((s, o) => s + o.item.price, 0);
  const firstSend = !docket;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0, position: 'relative' }}>
      <TopBar title={`Table ${table.num}`} subtitle={`${table.covers || table.seats} PAX · ${user.section}`} onBack={onBack}
        right={<>
          {table.birthday && <Pill tone="bill" dot>Birthday</Pill>}
          <Button variant={noteText ? 'primary' : 'secondary'} icon="sticky-note" onClick={() => setNotesOpen(true)}>Notes{noteText ? ' ·' : ''}</Button>
          <Button variant="gold" icon="receipt" onClick={() => onBill(table, order, total)}>Bill · {fmtAUD(total)}</Button>
        </>} />

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* category rail */}
        <div style={{ width: 150, borderRight: '0.5px solid var(--border-cream)', padding: 12, display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
          {cats.map(c => {
            const on = cat === c;
            return <button key={c} onClick={() => setCat(c)}
              style={{ textAlign: 'left', padding: '12px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', font: 'var(--text-h3)', fontWeight: on ? 700 : 400,
                background: on ? 'var(--filo-green)' : 'transparent', color: on ? 'var(--fg-1)' : 'var(--fg-3)', transition: 'background .15s, color .15s' }}>{c}</button>;
          })}
        </div>

        {/* menu grid */}
        <div style={{ flex: 1, padding: 18, overflowY: 'auto', minWidth: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignContent: 'start' }}>
            {menu[cat].map(item => (
              <MenuItemCard key={item.id} item={item} onAdd={add} onPairRequest={setPairingItem} />
            ))}
          </div>
          {/* long-press hint — shown once, subtly */}
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, font: 'var(--text-label)', color: 'var(--fg-4)', fontSize: 12 }}>
            <Icon name="wine" size={13} color="var(--fg-4)" />
            Hold any item with this icon for pairing suggestions
          </div>
        </div>

        {/* order panel */}
        <div style={{ width: 348, borderLeft: '0.5px solid var(--border-cream)', display: 'flex', flexDirection: 'column', flexShrink: 0, background: 'var(--filo-black)' }}>
          <div style={{ padding: '16px 18px 12px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <span style={{ font: 'var(--text-h2)' }}>Order</span>
              {docket
                ? <span style={{ font: 'var(--text-label)', color: '#5cc88a', display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="check" size={14} color="#5cc88a" /> With kitchen</span>
                : <span style={{ font: 'var(--text-label)', color: 'var(--fg-3)' }}>Adding to {courseLabel(course).toLowerCase()}</span>}
            </div>
            {/* course tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {courseTabs.map(c => {
                const st = stateOf(c);
                const on = c === course && st === 'building';
                const sent = st !== 'building';
                return (
                  <button key={c} onClick={() => selectCourse(c)} disabled={sent}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 999, cursor: sent ? 'default' : 'pointer',
                      font: 'var(--text-pill)', letterSpacing: '0.04em', textTransform: 'uppercase',
                      background: on ? 'var(--filo-green)' : 'var(--filo-surface)',
                      color: st === 'firing' || st === 'away' ? '#5cc88a' : on ? 'var(--fg-1)' : 'var(--fg-3)',
                      border: `0.5px solid ${on ? 'var(--filo-green)' : sent ? 'rgba(92,200,138,0.35)' : 'var(--border-cream)'}`,
                      opacity: sent ? 0.8 : 1, transition: 'background .12s, color .12s' }}>
                    {st === 'firing' && <Icon name="flame"         size={12} color="#5cc88a" />}
                    {st === 'away'   && <Icon name="check"         size={12} color="#5cc88a" />}
                    {st === 'hold'   && <Icon name="pause"         size={11} color="var(--filo-gold)" />}
                    {courseLabel(c)}
                  </button>
                );
              })}
              <button onClick={startNewCourse}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 999, cursor: 'pointer',
                  font: 'var(--text-pill)', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--fg-2)',
                  background: 'transparent', border: '0.5px dashed var(--border-cream)' }}>
                <Icon name="plus" size={13} color="var(--fg-2)" /> Course
              </button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {courses.length === 0 && (
              <div style={{ font: 'var(--text-body)', color: 'var(--fg-4)', marginTop: 20, lineHeight: 1.5 }}>
                No items yet. Tap dishes to build each course, then send the whole order to the kitchen as one docket.
              </div>
            )}
            {courses.map(c => {
              const items  = order.filter(o => o.course === c);
              const st     = stateOf(c);
              const courseTotal = items.reduce((s, o) => s + o.item.price, 0);
              const editable = st === 'building';
              return (
                <div key={c}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ font: 'var(--text-pill)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-2)' }}>{courseLabel(c)}</span>
                    <CourseStatus state={st} />
                    <span style={{ marginLeft: 'auto', font: 'var(--text-label)', color: 'var(--fg-3)' }}>{fmtAUD(courseTotal)}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {items.map(o => (
                      <div key={o.key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: 'var(--filo-surface)', borderRadius: 10, opacity: editable ? 1 : 0.6 }}>
                        <span style={{ font: 'var(--text-body)', flex: 1 }}>{o.item.name}</span>
                        <Money amount={o.item.price} size={14} color="var(--fg-2)" />
                        {editable && <button onClick={() => remove(o.key)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-4)', display: 'flex', padding: 0 }}><Icon name="x" size={16} /></button>}
                      </div>
                    ))}
                  </div>
                  {st === 'hold' && (
                    <button onClick={() => onFireCourse && onFireCourse(table, c)}
                      style={{ marginTop: 8, width: '100%', minHeight: 44, borderRadius: 10, cursor: 'pointer', font: 'var(--text-h3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        background: 'transparent', color: '#5cc88a', border: '1px solid rgba(92,200,138,0.5)', transition: 'background .15s' }}>
                      <Icon name="flame" size={17} color="#5cc88a" /> Course away
                    </button>
                  )}
                  {st === 'firing' && (
                    <div style={{ marginTop: 8, minHeight: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, font: 'var(--text-label)', color: '#5cc88a', background: 'rgba(20,99,58,0.14)' }}>
                      <Icon name="flame" size={15} color="#5cc88a" /> Firing — with the pass
                    </div>
                  )}
                  {st === 'away' && (
                    <div style={{ marginTop: 8, minHeight: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, font: 'var(--text-label)', color: 'var(--fg-3)' }}>
                      <Icon name="check-circle-2" size={15} color="#5cc88a" /> Sent to table
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* footer */}
          <div style={{ borderTop: '0.5px solid var(--border-cream)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {buildingToSend.length > 0 && (
              <button onClick={sendOrder}
                style={{ width: '100%', minHeight: 52, borderRadius: 12, border: 'none', cursor: 'pointer', font: 'var(--text-h2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                  background: pulse ? '#14633A' : 'var(--filo-green)', color: 'var(--fg-1)', boxShadow: pulse ? '0 0 0 3px rgba(20,99,58,0.4), 0 0 24px rgba(20,99,58,0.5)' : 'none', transition: 'box-shadow .3s, background .3s' }}>
                <Icon name={pulse ? 'printer' : 'send-horizontal'} size={19} />
                {pulse
                  ? 'Docket printing at the pass'
                  : firstSend
                    ? `Send order · ${buildingToSend.length} course${buildingToSend.length > 1 ? 's' : ''}`
                    : `Send ${buildingToSend.length} added course${buildingToSend.length > 1 ? 's' : ''}`}
              </button>
            )}
            {firstSend && buildingToSend.length > 1 && (
              <div style={{ font: 'var(--text-micro)', color: 'var(--fg-4)', textAlign: 'center', lineHeight: 1.5, marginTop: -4 }}>
                Whole docket goes to the kitchen together · {courseLabel(buildingToSend[0]).toLowerCase()} fires now, the rest hold for course-away
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ font: 'var(--text-h3)', color: 'var(--fg-2)' }}>Running total</span>
              <Money amount={total} size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* pairing overlay — sits above everything, only appears on long press */}
      {pairingItem && (
        <PairingOverlay item={pairingItem} byId={byId} onAdd={add} onClose={() => setPairingItem(null)} />
      )}

      {/* notes overlay */}
      {notesOpen && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}
          onClick={() => setNotesOpen(false)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.65)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }} />
          <div style={{ position: 'relative', width: '100%', maxWidth: 500, background: 'var(--filo-surface)', border: '0.5px solid var(--border-green)', borderRadius: 20, padding: 28, boxShadow: 'var(--shadow-lg)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginBottom: 4 }}>Table {table.num} · {table.covers || table.seats} PAX</div>
                <div style={{ font: 'var(--text-h1)' }}>Guest notes</div>
              </div>
              <button onClick={() => setNotesOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-3)', padding: 4, marginTop: -2 }}>
                <Icon name="x" size={20} />
              </button>
            </div>
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Dietary requirements, allergies, preferences, birthday, special occasion..."
              autoFocus
              style={{ width: '100%', minHeight: 120, background: 'var(--filo-black)', border: '0.5px solid var(--border-cream)', borderRadius: 12, padding: '12px 14px', color: 'var(--fg-1)', fontFamily: 'var(--font-sans)', fontSize: 14, resize: 'none', outline: 'none', lineHeight: 1.5, boxSizing: 'border-box', marginBottom: 16 }}
            />
            {noteSaved ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '12px 16px', background: 'rgba(20,99,58,0.15)', borderRadius: 10 }}>
                <Icon name="check-circle-2" size={18} color="#5cc88a" />
                <span style={{ font: 'var(--text-label)', fontWeight: 700, color: '#5cc88a' }}>Notes saved to table</span>
              </div>
            ) : (
              <Button variant="primary" full onClick={() => { setNoteSaved(true); setTimeout(() => { setNoteSaved(false); setNotesOpen(false); }, 1500); }} disabled={!noteText.trim()}>
                Save notes
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
window.TableOrder = TableOrder;
