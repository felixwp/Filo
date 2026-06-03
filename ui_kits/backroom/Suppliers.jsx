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

function StockRow({ item, priceAlert }) {
  const statusTone = { critical: 'red', low: 'amber', ok: 'occupied' }[item.status];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0', borderBottom: '0.5px solid var(--border-cream)' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, color: 'var(--fg-1)' }}>{item.item}</span>
          {priceAlert && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 6px', background: 'rgba(201,122,30,0.16)', borderRadius: 999, flexShrink: 0 }}>
              <Icon name="arrow-up" size={9} color="#e0973f" />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 9, fontWeight: 700, color: '#e0973f' }}>{priceAlert.changePct}%</span>
            </div>
          )}
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>{item.supplier}</div>
      </div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-4)', flexShrink: 0 }}>{item.unit}</div>
      <StockBar current={item.current} par={item.par} status={item.status} />
      <Pill tone={statusTone} style={{ width: 68, justifyContent: 'center', flexShrink: 0 }}>{item.status}</Pill>
    </div>
  );
}

function PriceAlertPanel({ alerts }) {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) {
    return (
      <div
        onClick={() => setDismissed(false)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(201,122,30,0.08)', border: '0.5px solid rgba(201,122,30,0.22)', borderRadius: 11, cursor: 'pointer' }}
      >
        <Icon name="trending-up" size={13} color="#e0973f" />
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: '#e0973f', fontWeight: 700 }}>{alerts.length} price increases dismissed</span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-4)', marginLeft: 'auto' }}>Show</span>
      </div>
    );
  }

  const estimatedImpact = Math.round(alerts.reduce((sum, a) => sum + (a.newPrice - a.oldPrice) * 8, 0));

  return (
    <div style={{ background: 'rgba(201,122,30,0.07)', border: '0.5px solid rgba(201,122,30,0.28)', borderRadius: 14, padding: 18 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(201,122,30,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="trending-up" size={15} color="#e0973f" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, color: 'var(--fg-1)', marginBottom: 1 }}>
              {alerts.length} price increases
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-3)' }}>Since your last order · {new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</div>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 6, fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-4)' }}
        >Dismiss</button>
      </div>

      {/* Alert rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {alerts.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: i < alerts.length - 1 ? '0.5px solid rgba(201,122,30,0.15)' : 'none' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--fg-1)' }}>{a.item}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>{a.supplier} · {a.unit}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginBottom: 3 }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-4)', textDecoration: 'line-through', fontVariantNumeric: 'tabular-nums' }}>${a.oldPrice.toFixed(2)}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums' }}>${a.newPrice.toFixed(2)}</span>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', background: 'rgba(201,122,30,0.18)', borderRadius: 999 }}>
                <Icon name="arrow-up" size={10} color="#e0973f" />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, color: '#e0973f' }}>{a.changePct}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Impact line */}
      <div style={{ marginTop: 14, padding: '10px 12px', background: 'rgba(0,0,0,0.18)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="info" size={12} color="var(--fg-4)" />
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.5 }}>
          Estimated <span style={{ color: '#e0973f', fontWeight: 700 }}>+${estimatedImpact}</span> impact on this week's orders. Consider reviewing menu prices.
        </span>
      </div>
    </div>
  );
}

function SupplierSheet({ sup, onClose }) {
  const [contactSent, setContactSent] = React.useState(null);
  const handleContact = (type) => { setContactSent(type); setTimeout(onClose, 1600); };
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 50 }} onClick={onClose}>
      <div style={{ width: '100%', background: 'var(--filo-surface)', borderRadius: '16px 16px 0 0', padding: '28px 28px 32px', border: '0.5px solid var(--border-cream)' }} onClick={e => e.stopPropagation()}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: 'var(--border-cream-2)', borderRadius: 999, margin: '0 auto 22px' }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 18, color: 'var(--fg-1)', marginBottom: 3 }}>{sup.name}</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--fg-3)' }}>{sup.category}</div>
          </div>
          {sup.dueToday && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', background: 'rgba(201,122,30,0.14)', borderRadius: 8 }}>
              <Icon name="clock" size={12} color="#e0973f" />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700, color: '#e0973f' }}>Order due today</span>
            </div>
          )}
        </div>

        {/* Contact info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22, padding: '16px 18px', background: 'var(--filo-surface-2)', borderRadius: 12, border: '0.5px solid var(--border-cream)' }}>
          {[
            { icon: 'user',      label: 'Contact',    value: sup.contact },
            { icon: 'phone',     label: 'Phone',      value: sup.phone   },
            { icon: 'mail',      label: 'Email',      value: sup.email   },
            { icon: 'calendar',  label: 'Next order', value: sup.nextOrder },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Icon name={row.icon} size={14} color="var(--fg-4)" />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-4)', width: 72, flexShrink: 0 }}>{row.label}</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--fg-1)' }}>{row.value}</span>
            </div>
          ))}
        </div>

        {contactSent ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '14px 18px', background: 'rgba(20,99,58,0.15)', borderRadius: 10, border: '0.5px solid rgba(20,99,58,0.3)' }}>
            <Icon name="check-circle-2" size={16} color="#5cc88a" />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: '#5cc88a' }}>
              {contactSent === 'call' ? `Calling ${sup.contact}…` : `Email opened for ${sup.contact}`}
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <Button full variant="secondary" icon="phone" onClick={() => handleContact('call')}>Call</Button>
            <Button full variant="primary" icon="mail" onClick={() => handleContact('email')}>Email</Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Suppliers() {
  const d = window.BR_DATA;
  const [orderSent, setOrderSent] = React.useState(false);
  const [activeSupplier, setActiveSupplier] = React.useState(null);

  const criticalCount = d.stock.filter(s => s.status === 'critical').length;
  const lowCount      = d.stock.filter(s => s.status === 'low').length;
  const okCount       = d.stock.filter(s => s.status === 'ok').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {activeSupplier && <SupplierSheet sup={activeSupplier} onClose={() => setActiveSupplier(null)} />}
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
          {d.stock.map((item, i) => {
            const priceAlert = d.priceAlerts.find(a => a.item === item.item) || null;
            return <StockRow key={i} item={item} priceAlert={priceAlert} />;
          })}
        </div>

        {/* Right — price alerts + AI order + suppliers */}
        <div style={{ overflowY: 'auto', padding: '22px 28px 28px 24px', display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* Price change alerts */}
          <PriceAlertPanel alerts={d.priceAlerts} />

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
                <Panel key={sup.id} onClick={() => setActiveSupplier(sup)} style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', transition: 'background .15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--filo-surface-2)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--fg-1)' }}>{sup.name}</div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>{sup.category} · {sup.contact}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: sup.dueToday ? '#e0973f' : 'var(--fg-4)', fontWeight: sup.dueToday ? 700 : 400 }}>{sup.nextOrder}</div>
                    <Icon name="chevron-right" size={14} color="var(--fg-4)" />
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
