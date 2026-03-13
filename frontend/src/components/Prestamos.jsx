import { useState, useEffect } from 'react'
import { useAuth } from '../context/useAuth'
import api from '../services/api'
import { C, FONT, inputStyle, labelStyle } from './unal-tokens'
import { SectionHeader, FormCard, TableHeader, TableRow, Badge } from './unal-components.jsx'

const estadoBadge = { Activo: 'warning', Devuelto: 'success', Vencido: 'danger' }

const COLS = [
  { label: 'Equipo',        width: '1fr' },
  { label: 'Solicitante',   width: '150px' },
  { label: 'Fecha salida',  width: '110px' },
  { label: 'Fecha retorno', width: '110px' },
  { label: 'Estado',        width: '100px' },
  { label: 'Acciones',      width: '120px' },
]

export default function Prestamos() {
  const [prestamos, setPrestamos] = useState([])
  const [equipos, setEquipos] = useState([])
  const [form, setForm] = useState({ equipoId:'', solicitante:'', fechaSalida:'', fechaRetorno:'', notas:'' })
  const [mostrarForm, setMostrarForm] = useState(false)
  const { usuario } = useAuth()
  const puedeAgregar = usuario?.rol === 'admin' || usuario?.rol === 'profesor'
  const esAdmin = usuario?.rol === 'admin'

  const cargar = () => {
    api.get('/prestamos').then(r => setPrestamos(r.data))
    api.get('/equipos').then(r => setEquipos(r.data.filter(e => e.estado === 'Disponible')))
  }
  useEffect(() => { cargar() }, [])

  const guardar = async () => {
    await api.post('/prestamos', { ...form, equipoId: parseInt(form.equipoId) })
    setForm({ equipoId:'', solicitante:'', fechaSalida:'', fechaRetorno:'', notas:'' })
    setMostrarForm(false); cargar()
  }

  const devolver = async (id) => {
    await api.put(`/prestamos/${id}`, { estado: 'Devuelto' }); cargar()
  }

  const eliminar = async (id) => {
    if (window.confirm('¿Eliminar este préstamo?')) { await api.delete(`/prestamos/${id}`); cargar() }
  }

  const gridTemplate = COLS.map(c => c.width).join(' ')
  const inp = { ...inputStyle, fontFamily: FONT }
  const lbl = { ...labelStyle, fontFamily: FONT }

  return (
    <div>
      <SectionHeader
        title="Registro de Préstamos"
        count={prestamos.length}
        esAdmin={puedeAgregar}
        onAdd={() => setMostrarForm(!mostrarForm)}
        labelAdd="+ Registrar préstamo"
      />

      {mostrarForm && puedeAgregar && (
        <FormCard title="Nuevo préstamo" onSave={guardar} onCancel={() => setMostrarForm(false)} saveLabel="Registrar préstamo">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={lbl}>Equipo</label>
              <select value={form.equipoId} onChange={e => setForm({...form, equipoId: e.target.value})} style={inp}
                onFocus={e => e.target.style.borderColor = C.verde}
                onBlur={e => e.target.style.borderColor = C.grisBorde}>
                <option value="">Seleccionar equipo...</option>
                {equipos.map(eq => <option key={eq.id} value={eq.id}>{eq.codigo} — {eq.descripcion}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Solicitante</label>
              <input value={form.solicitante} onChange={e => setForm({...form, solicitante: e.target.value})}
                placeholder="Nombre completo" style={inp}
                onFocus={e => e.target.style.borderColor = C.verde}
                onBlur={e => e.target.style.borderColor = C.grisBorde} />
            </div>
            <div>
              <label style={lbl}>Fecha de salida</label>
              <input type="date" value={form.fechaSalida} onChange={e => setForm({...form, fechaSalida: e.target.value})} style={inp}
                onFocus={e => e.target.style.borderColor = C.verde}
                onBlur={e => e.target.style.borderColor = C.grisBorde} />
            </div>
            <div>
              <label style={lbl}>Fecha de retorno</label>
              <input type="date" value={form.fechaRetorno} onChange={e => setForm({...form, fechaRetorno: e.target.value})} style={inp}
                onFocus={e => e.target.style.borderColor = C.verde}
                onBlur={e => e.target.style.borderColor = C.grisBorde} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={lbl}>Notas (opcional)</label>
              <input value={form.notas} onChange={e => setForm({...form, notas: e.target.value})}
                placeholder="Observaciones..." style={inp}
                onFocus={e => e.target.style.borderColor = C.verde}
                onBlur={e => e.target.style.borderColor = C.grisBorde} />
            </div>
          </div>
        </FormCard>
      )}

      <div style={{ overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <TableHeader columns={COLS} />
        {prestamos.length === 0 && (
          <div style={{ padding: '32px', textAlign: 'center', background: C.blanco, color: C.grisTexto, fontSize: 13, fontFamily: FONT }}>
            No hay préstamos registrados
          </div>
        )}
        {prestamos.map(p => (
          <TableRow key={p.id} gridTemplate={gridTemplate}>
            <span style={{ fontSize: 12, fontFamily: FONT, color: C.grisOscuroTexto }}>{p.equipo?.descripcion || `Equipo #${p.equipoId}`}</span>
            <span style={{ fontSize: 12, fontFamily: FONT, color: C.grisOscuroTexto }}>{p.solicitante}</span>
            <span style={{ fontSize: 11, fontFamily: FONT, color: C.grisTexto }}>{new Date(p.fechaSalida).toLocaleDateString('es-CO')}</span>
            <span style={{ fontSize: 11, fontFamily: FONT, color: C.grisTexto }}>{new Date(p.fechaRetorno).toLocaleDateString('es-CO')}</span>
            <Badge text={p.estado} type={estadoBadge[p.estado]} />
            <div style={{ display: 'flex', gap: 6 }}>
              {puedeAgregar && p.estado === 'Activo' && (
                <button onClick={() => devolver(p.id)} style={{
                  background: C.verdeClaro, border: `1px solid ${C.verde}`,
                  borderRadius: 0, padding: '5px 10px', color: C.verdeOscuro,
                  fontSize: 10, cursor: 'pointer', fontFamily: FONT
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >Devuelto</button>
              )}
              {esAdmin && (
                <button onClick={() => eliminar(p.id)} style={{
                  background: C.blanco, border: `1px solid ${C.rojo}`,
                  borderRadius: 0, padding: '5px 10px', color: C.rojo,
                  fontSize: 10, cursor: 'pointer', fontFamily: FONT
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.rojo; e.currentTarget.style.color = C.blanco }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.blanco; e.currentTarget.style.color = C.rojo }}
                >Borrar</button>
              )}
            </div>
          </TableRow>
        ))}
      </div>
    </div>
  )
}