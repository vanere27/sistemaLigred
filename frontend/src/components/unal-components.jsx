import { C, FONT, btnPrimary, btnSecondary } from './unal-tokens'

export function SectionHeader({ title, count, onAdd, esAdmin, labelAdd = '+ Agregar' }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'flex-end', marginBottom: 24,
      paddingBottom: 12, borderBottom: `2px solid ${C.verde}`
    }}>
      <div>
        <h1 style={{
          fontSize: 20, fontWeight: 700, margin: 0,
          color: C.grisOscuroTexto, fontFamily: FONT, letterSpacing: 0.5
        }}>{title}</h1>
        {count !== undefined && (
          <p style={{ color: C.grisTexto, fontSize: 11, margin: '4px 0 0', fontFamily: FONT }}>
            {count} registro{count !== 1 ? 's' : ''}
          </p>
        )}
      </div>
      {esAdmin && onAdd && (
        <button onClick={onAdd} style={btnPrimary}
          onMouseEnter={e => e.currentTarget.style.background = C.verdeOscuro}
          onMouseLeave={e => e.currentTarget.style.background = C.verde}
        >{labelAdd}</button>
      )}
    </div>
  )
}

export function FormCard({ title, children, onSave, onCancel, saveLabel = 'Guardar' }) {
  return (
    <div style={{
      background: C.blanco, border: `1px solid ${C.grisBorde}`,
      borderTop: `3px solid ${C.verde}`, borderRadius: 0,
      padding: 24, marginBottom: 24,
      boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
    }}>
      <h3 style={{
        fontSize: 12, color: C.verdeOscuro, letterSpacing: 2,
        marginBottom: 20, marginTop: 0, textTransform: 'uppercase',
        fontFamily: FONT, borderBottom: `1px solid ${C.grisBorde}`,
        paddingBottom: 10
      }}>{title}</h3>
      {children}
      <div style={{
        display: 'flex', gap: 8, marginTop: 20,
        paddingTop: 16, borderTop: `1px solid ${C.grisBorde}`
      }}>
        <button onClick={onSave} style={btnPrimary}
          onMouseEnter={e => e.currentTarget.style.background = C.verdeOscuro}
          onMouseLeave={e => e.currentTarget.style.background = C.verde}
        >{saveLabel}</button>
        <button onClick={onCancel} style={btnSecondary}
          onMouseEnter={e => { e.currentTarget.style.background = C.grisMuyClaro }}
          onMouseLeave={e => { e.currentTarget.style.background = C.blanco }}
        >Cancelar</button>
      </div>
    </div>
  )
}

export function TableHeader({ columns }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: columns.map(c => c.width || '1fr').join(' '),
      gap: 12, padding: '10px 16px',
      background: C.verdeOscuro,
    }}>
      {columns.map((col, i) => (
        <span key={i} style={{
          fontSize: 10,
          color: '#FFFFFF',
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          fontFamily: FONT,
          fontWeight: 700
        }}>{col.label}</span>
      ))}
    </div>
  )
}

export function TableRow({ children, gridTemplate }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: gridTemplate,
      gap: 12, padding: '12px 16px', alignItems: 'center',
      background: C.blanco, borderBottom: `1px solid ${C.grisBorde}`,
      transition: 'background 0.12s'
    }}
      onMouseEnter={e => e.currentTarget.style.background = C.verdeClaro}
      onMouseLeave={e => e.currentTarget.style.background = C.blanco}
    >
      {children}
    </div>
  )
}

export function Badge({ text, type = 'default' }) {
  const styles = {
    success: { bg: '#EAF0E8', color: '#2D4A28', border: '#46673F' },
    warning: { bg: '#FFF3E0', color: '#8B5E00', border: '#FFCC80' },
    danger:  { bg: '#F9EDED', color: '#762327', border: '#C8858A' },
    info:    { bg: '#E3F2FD', color: '#1565C0', border: '#90CAF9' },
    default: { bg: C.grisMuyClaro, color: C.grisTexto, border: C.grisBorde },
  }
  const s = styles[type] || styles.default
  return (
    <span style={{
      fontSize: 10, padding: '3px 8px', borderRadius: 0,
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      fontFamily: FONT, letterSpacing: 0.5,
      fontWeight: 700, textTransform: 'uppercase'
    }}>{text}</span>
  )
}

export function Alerta({ mensaje, tipo = 'warning' }) {
  const colores = {
    warning: { bg: '#FFF3E0', border: '#8B5E00', color: '#8B5E00' },
    danger:  { bg: '#F9EDED', border: C.rojo, color: C.rojo },
    info:    { bg: '#E3F2FD', border: '#1565C0', color: '#1565C0' },
  }
  const col = colores[tipo] || colores.warning
  return (
    <div style={{
      background: col.bg, border: `1px solid ${col.border}`,
      borderLeft: `4px solid ${col.border}`,
      padding: '10px 16px', marginBottom: 20,
      fontSize: 12, color: col.color, fontFamily: FONT
    }}>
      {mensaje}
    </div>
  )
}