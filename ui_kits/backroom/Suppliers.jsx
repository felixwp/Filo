/* Filo Backroom — Suppliers. Stock levels, AI-suggested orders, supplier directory. */

function StockBar({ current, par, status }) {
  const pct = Math.min(100, Math.round((current / par) * 100));
  const barColor = { critical: '#d9806f', low: '#e0973f', ok: '#5cc88a' }[status];
  return (
    <div style={{ width: 120 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-3)', fontVariantNumeric: 'tabular-nums' }}>{current}</span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-4)', fontVariantNumeric: 'tabular-nums' }}>/{par}</span>
      </div>
      <div style={{ height: 4, background: 'var(--filo-surface-3)', borderRadius: 999 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 999, transition: 'width .5s var(--ease-out)' }} />
      </div>
    </div>
  );
}

function StockRow({ item }) {
  const statusTone = { critical: 'red', low: 'amber', ok: 'occupied' }[item.status];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0', borderBottom: '0.5px solid var(--border-cream)' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, color: 'var(--fg-1)' }}>{item.item}</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>{item.supplier}</div>
      </div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-4)', flexShrink: 0 }}>{item.unit}</div>
      <StockBar current={item.current} par={item.par} status={item.status} />
      <Pill tone={statusTone} style={{ width: 68, justifyContent: 'center', flexShrink: 0 }}>{item.status}</Pill>
    </div>
  );
}

function Suppliers() {
  const d = window.BR_DATA;
  const [orderSent, setOrderSent] = React.useState(false);

  const criticalCount = d.stock.filter(s => s.status === 'critical').length;
  const lowCount      = d.stock.filter(s => s.status === 'low').length;
  const okCount       = d.stock.filter(s => s.status === 'ok').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TopBar
        title="Suppliers"
        subtitle="Stock levels · orders · AI-suggested order"
        right={
          <div style={{ display: 'flex', gap: 8 }}>
            <Pill tone="red"      dot>{criticalCount} critical</Pill>
            <Pill tone="amber"    dot>{lowCount} low</Pill>
            <Pill tone="occupied" dot>{okCount} ok</Pill>
          </div>
        }
      />

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.15fr 1fr', minHeight: 0, overflow: 'hidden' }}>
        {/* Left — Stock levels */}
        <div style={{ borderRight: '0.5px solid var(--border-cream)', overflowY: 'auto', padding: '22px 24px 28px 28px' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16, color: 'var(--fg-1)', marginBottom: 4 }}>Stock levels</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-3)', marginBottom: 18 }}>Current vs par — updated end of each service</div>
          {d.stock.map((item, i) => <StockRow key={i} item={item} />)}
        </div>

        {/* Right — AI order + suppliers */}
        <div style={{ overflowY: 'auto', padding: '22px 28px 28px 24px', display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* AI suggested order */}
          <Panel accent style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(13,74,40,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="sparkles" size={17} color="#5cc88a" />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 15, color: 'var(--fg-1)', marginBottom: 2 }}>Suggested order</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-3)' }}>{d.aiOrder.supplierName} · {d.aiOrder.dueDate}</div>
              </div>
            </div>

            {d.aiOrder.lines.map((line, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '11px 0', borderBottom: i < d.aiOrder.lines.length - 1 ? '0.5px solid var(--border-cream)' : 'none' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--fg-1)' }}>{line.item}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>{line.note}</div>
                </div>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--fg-1)', whiteSpace: 'nowrap', flexShrink: 0 }}>{line.qty}</span>
              </div>
            ))}

            <div style={{ margin: '16px 0 18px', padding: '10px 12px', background: 'rgba(13,74,40,0.10)', borderRadius: 8, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <Icon name="info" size={13} color="var(--fg-4)" style={{ marginTop: 1, flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.5 }}>{d.aiOrder.basis}</span>
            </div>

            {orderSent ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '12px 16px', background: 'rgba(20,99,58,0.15)', borderRadius: 9 }}>
                <Icon name="check-circle-2" size={16} color="#5cc88a" />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: '#5cc88a' }}>Order sent to {d.aiOrder.supplierName}</span>
              </div>
            ) : (
              <Button full onClick={() => setOrderSent(true)} icon="send">Place order</Button>
            )}
          </Panel>

          {/* Supplier directory */}
          <div>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16, color: 'var(--fg-1)', marginBottom: 12 }}>Your suppliers</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {d.suppliers.map(sup => (
                <Panel key={sup.id} style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--fg-1)' }}>{sup.name}</div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>{sup.category} · {sup.contact} · {sup.phone}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: sup.dueToday ? '#e0973f' : 'var(--fg-4)', fontWeight: sup.dueToday ? 700 : 400 }}>
                      {sup.nextOrder}
                    </div>
                  </div>
                </Panel>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
window.Suppliers = Suppliers;
