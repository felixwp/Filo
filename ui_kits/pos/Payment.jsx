/* Filo POS — payment modal. Glass overlay, split methods, tip, settle. */
function Payment({ table, items, total, onClose, onSettled }) {
  const [split, setSplit] = React.useState('even');
  const [tip, setTip] = React.useState(12.5);
  const [method, setMethod] = React.useState('card');
  const [settling, setSettling] = React.useState(false);
  const covers = (table && (table.covers || table.seats)) || 2;
  const tipAmt = +(total * tip / 100).toFixed(2);
  const grand = +(total + tipAmt).toFixed(2);
  const perHead = +(grand / covers).toFixed(2);
  const settle = () => { setSettling(true); setTimeout(() => onSettled(), 1100); };

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,8,8,0.55)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: 460, maxHeight: '88%', overflowY: 'auto', background: 'var(--glass-bg)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '1px solid var(--glass-border)', borderRadius: 18, boxShadow: 'var(--shadow-lg)', padding: 26 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ font: 'var(--text-h1)' }}>Settle table {table.num}</div>
            <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)', marginTop: 2 }}>{covers} covers</div>
          </div>
          <button onClick={onClose} style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--filo-surface)', border: '0.5px solid var(--border-cream)', color: 'var(--fg-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="x" size={20} /></button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderTop: '0.5px solid var(--border-cream)', borderBottom: '0.5px solid var(--border-cream)' }}>
          <span style={{ font: 'var(--text-body)', color: 'var(--fg-2)' }}>Subtotal</span>
          <Money amount={total} size={18} color="var(--fg-1)" />
        </div>

        <div style={{ margin: '20px 0 10px', font: 'var(--text-pill)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>Split</div>
        <div style={{ display: 'inline-flex', background: 'var(--filo-surface-3)', borderRadius: 10, padding: 4, gap: 4, width: '100%' }}>
          {[['even', 'Even split'], ['item', 'By item'], ['none', 'One bill']].map(([k, lbl]) => (
            <button key={k} onClick={() => setSplit(k)} style={{ flex: 1, border: 'none', cursor: 'pointer', font: 'var(--text-h3)', padding: '10px 0', borderRadius: 7, background: split === k ? 'var(--filo-green)' : 'transparent', color: split === k ? 'var(--fg-1)' : 'var(--fg-3)', transition: 'background .15s, color .15s' }}>{lbl}</button>
          ))}
        </div>
        {split === 'even' && <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', font: 'var(--text-body)', color: 'var(--fg-2)' }}><span>Per head</span><Money amount={perHead} size={16} color="var(--fg-1)" /></div>}

        <div style={{ margin: '20px 0 10px', font: 'var(--text-pill)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>Tip</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[0, 10, 12.5, 15].map(p => (
            <button key={p} onClick={() => setTip(p)} style={{ flex: 1, minHeight: 48, borderRadius: 10, cursor: 'pointer', font: 'var(--text-h3)', border: tip === p ? '1px solid var(--filo-gold)' : '0.5px solid var(--border-cream)', background: tip === p ? 'rgba(201,146,30,0.14)' : 'transparent', color: tip === p ? 'var(--filo-gold)' : 'var(--fg-2)', transition: 'all .15s' }}>{p === 0 ? 'None' : `${p}%`}</button>
          ))}
        </div>

        <div style={{ margin: '20px 0 10px', font: 'var(--text-pill)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>Method</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['card', 'credit-card', 'Card'], ['cash', 'banknote', 'Cash'], ['split', 'split', 'Card + cash']].map(([k, ic, lbl]) => (
            <button key={k} onClick={() => setMethod(k)} style={{ flex: 1, minHeight: 52, borderRadius: 10, cursor: 'pointer', font: 'var(--text-h3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, border: method === k ? '1px solid var(--filo-green-bright)' : '0.5px solid var(--border-cream)', background: method === k ? 'rgba(20,99,58,0.16)' : 'transparent', color: method === k ? 'var(--fg-1)' : 'var(--fg-2)', transition: 'all .15s' }}>
              <Icon name={ic} size={20} color={method === k ? '#5cc88a' : 'var(--fg-3)'} />{lbl}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '24px 0 18px' }}>
          <div>
            <div style={{ font: 'var(--text-h2)' }}>Total due</div>
            {tipAmt > 0 && <div style={{ font: 'var(--text-label)', color: 'var(--fg-3)' }}>incl. {fmtAUD(tipAmt)} tip</div>}
          </div>
          <Money amount={grand} size={30} />
        </div>
        <Button full size="lg" icon={settling ? 'check-circle-2' : 'lock'} onClick={settle} style={settling ? { background: '#14633A', boxShadow: '0 0 0 3px rgba(20,99,58,0.4), 0 0 24px rgba(20,99,58,0.5)' } : {}}>
          {settling ? 'Settled — receipt printing' : `Take payment · ${fmtAUD(grand)}`}
        </Button>
      </div>
    </div>
  );
}
window.Payment = Payment;
