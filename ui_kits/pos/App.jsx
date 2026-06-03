/* Filo POS — app orchestrator. Routes between screens, holds session + kitchen state. */

const LIGHT_VARS = {
  '--filo-black':    '#F0EAE0',
  '--filo-surface':  '#FFFFFF',
  '--filo-surface-2':'#F5EFE4',
  '--filo-surface-3':'#EDE7DC',
  '--fg-1':  '#0A0A0A',
  '--fg-2':  'rgba(10,10,10,0.75)',
  '--fg-3':  'rgba(10,10,10,0.50)',
  '--fg-4':  'rgba(10,10,10,0.28)',
  '--fg-on-green': '#F5EFE4',
  '--border-cream':   'rgba(10,10,10,0.12)',
  '--border-cream-2': 'rgba(10,10,10,0.25)',
  '--border-green':   'rgba(13,74,40,0.30)',
  '--glass-bg': 'rgba(240,234,224,0.88)',
};

const BREAK_THRESHOLD_MINS = 330; // 5.5 hours

function App() {
  const [user,        setUser]        = React.useState(null);
  const [nav,         setNav]         = React.useState('floor');
  const [activeTable, setActiveTable] = React.useState(null);
  const [pay,         setPay]         = React.useState(null);
  const [toast,       setToast]       = React.useState(null);
  const [theme,       setTheme]       = React.useState('dark');
  const [shiftStart,  setShiftStart]  = React.useState(null);
  const [shiftMins,   setShiftMins]   = React.useState(0);
  const [breakAlert,  setBreakAlert]  = React.useState(false);

  /* shift timer — ticks every 30s */
  React.useEffect(() => {
    if (!shiftStart) return;
    const tick = () => {
      const mins = Math.floor((Date.now() - shiftStart) / 60000);
      setShiftMins(mins);
      if (mins >= BREAK_THRESHOLD_MINS) setBreakAlert(true);
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [shiftStart]);

  const handleLogin = (staff) => {
    setUser(staff);
    setShiftStart(Date.now());
    setShiftMins(0);
    setBreakAlert(false);
  };

  const [dockets, setDockets] = React.useState({
    9: { table: 9, covers: 5, sentMins: 7, courses: [
      { n: 1, label: 'Entrées', state: 'away',   items: [{ name: 'Charred leeks, romesco', qty: 2 }, { name: 'Burrata, peach & basil', qty: 1 }, { name: 'Crispy squid, aioli', qty: 2 }] },
      { n: 2, label: 'Mains',   state: 'firing', items: [{ name: 'Hand-rolled tagliatelle', qty: 2 }, { name: 'Roast cauliflower, tahini', qty: 1 }, { name: 'Triple-cooked chips', qty: 2 }] },
    ] },
    14: { table: 14, covers: 7, sentMins: 3, courses: [
      { n: 1, label: 'Entrées', state: 'firing', items: [{ name: 'Charred leeks, romesco', qty: 2 }, { name: 'Beef tartare, capers', qty: 2 }, { name: 'Crispy squid, aioli', qty: 3 }] },
      { n: 2, label: 'Mains',   state: 'hold',   items: [{ name: 'Dry-aged sirloin, 300g', qty: 3 }, { name: 'Whole sea bream', qty: 2 }, { name: 'Roast cauliflower, tahini', qty: 2 }] },
      { n: 3, label: 'Dessert', state: 'hold',   items: [{ name: 'Dark chocolate délice', qty: 4 }] },
    ] },
  });

  const reminders = [
    { icon: 'utensils', color: '#5cc88a', title: 'Table 9 · mains',   sub: 'Firing now · plate up',         table: 9  },
    { icon: 'wine',     color: '#d8a73a', title: 'Table 14 · wine',   sub: 'Pour with starters',            table: 14 },
    { icon: 'flame',    color: '#5cc88a', title: 'Table 14 · mains',  sub: 'Held · course away when ready', table: 14 },
  ];

  const flash     = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2100); };
  const openTable  = (t) => { if (!t) return; setActiveTable(t); setNav('floor'); };
  const backToFloor = () => setActiveTable(null);
  const logout      = () => { setUser(null); setNav('floor'); setActiveTable(null); setPay(null); setToast(null); setShiftStart(null); setShiftMins(0); setBreakAlert(false); };

  const sendOrder = (table, courses) => {
    setDockets(d => {
      const ex = d[table.num];
      if (!ex) {
        const cs = courses.map((c, i) => ({ ...c, state: i === 0 ? 'firing' : 'hold' }));
        flash(`Docket sent · ${courses.length} course${courses.length > 1 ? 's' : ''} · ${courses[0].label.toLowerCase()} firing`);
        return { ...d, [table.num]: { table: table.num, covers: table.covers || table.seats, sentMins: 0, courses: cs } };
      }
      const merged = [...ex.courses];
      courses.forEach(c => { if (!merged.find(m => m.n === c.n)) merged.push({ ...c, state: 'hold' }); });
      merged.sort((a, b) => a.n - b.n);
      flash(`Added to T${table.num}'s docket · held for course-away`);
      return { ...d, [table.num]: { ...ex, courses: merged } };
    });
  };

  const fireCourse = (table, n) => {
    setDockets(d => {
      const ex = d[table.num]; if (!ex) return d;
      return { ...d, [table.num]: { ...ex, courses: ex.courses.map(c => c.n === n ? { ...c, state: 'firing' } : c) } };
    });
    flash(`${n === 1 ? 'Entrées' : n === 2 ? 'Mains' : n === 3 ? 'Dessert' : 'Course ' + n} away · T${table.num} firing`);
  };

  const markReady = (tableNum, n) => {
    setDockets(d => {
      const ex = d[tableNum]; if (!ex) return d;
      return { ...d, [tableNum]: { ...ex, courses: ex.courses.map(c => c.n === n ? { ...c, state: 'away' } : c) } };
    });
  };

  const themeVars = theme === 'light' ? LIGHT_VARS : {};

  let screen;
  if (user) {
    if (activeTable) {
      screen = <TableOrder table={activeTable} user={user} onBack={backToFloor}
        docket={dockets[activeTable.num] || null}
        onSendOrder={sendOrder} onFireCourse={fireCourse}
        onBill={(t, items, total) => setPay({ table: t, items, total })} />;
    } else if (nav === 'floor')   { screen = <FloorPlan user={user} onOpenTable={openTable} reminders={reminders} onLogout={logout} />; }
    else if (nav === 'kds')       { screen = <KDS dockets={dockets} onReady={markReady} />; }
    else if (nav === 'dashboard') { screen = <Dashboard />; }
    else if (nav === 'guide')     { screen = <Guide />; }
    else if (nav === 'settings')  { screen = <Settings theme={theme} onTheme={setTheme} />; }
  }

  const minsLeft = BREAK_THRESHOLD_MINS + 30 - shiftMins; // mins until mandatory break (6h mark)

  return (
    <div style={{ display: 'flex', height: '100%', position: 'relative', ...themeVars }}>
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <NavRail active={activeTable ? 'floor' : nav} user={user} onLogout={logout} shiftMins={shiftMins}
            onNav={(n) => { setActiveTable(null); setNav(n); setPay(null); }} />
          <div style={{ flex: 1, minWidth: 0, position: 'relative', display: 'flex', flexDirection: 'column' }}>
            {/* break reminder banner */}
            {breakAlert && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', background: 'rgba(201,122,30,0.12)', borderBottom: '1px solid rgba(201,122,30,0.38)', flexShrink: 0 }}>
                <Icon name="clock" size={18} color="var(--filo-amber)" />
                <span style={{ font: 'var(--text-label)', color: 'var(--fg-1)', flex: 1 }}>
                  Break due · {Math.floor(shiftMins / 60)}h {shiftMins % 60}m on shift.
                  {minsLeft > 0 ? ` Break required within ${minsLeft} min.` : ' Take your break now.'}
                </span>
                <button onClick={() => setBreakAlert(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-3)', padding: '4px 8px', font: 'var(--text-label)', fontWeight: 600 }}>Dismiss</button>
              </div>
            )}
            <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>{screen}</div>
          </div>
          {pay && <Payment table={pay.table} items={pay.items} total={pay.total} onClose={() => setPay(null)} onSettled={() => { setPay(null); setActiveTable(null); flash('Table settled · receipt printed'); }} />}
        </>
      )}
      {toast && (
        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--glass-bg)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid var(--glass-border)', borderRadius: 12, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: 'var(--shadow-md)', zIndex: 40 }}>
          <Icon name="check-circle-2" size={18} color="#5cc88a" />
          <span style={{ font: 'var(--text-body)', color: 'var(--fg-1)' }}>{toast}</span>
        </div>
      )}
    </div>
  );
}
window.App = App;
