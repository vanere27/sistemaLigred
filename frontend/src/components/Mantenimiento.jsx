import { useState, useEffect } from 'react'
import { useAuth } from '../context/useAuth'
import api from '../services/api'
import { C, FONT, inputStyle, labelStyle, btnDanger } from './unal-tokens'
import { SectionHeader, FormCard, TableHeader, TableRow, Badge } from './unal-components.jsx'

const tipoBadge = { Preventivo: 'info', Correctivo: 'danger', 'Calibración': 'warning' }

const COLS = [
  { label: 'Equipo',        width: '1fr' },
  { label: 'Tipo',          width: '100px' },
  { label: 'Descripción',   width: '1fr' },
  { label: 'Técnico',       width: '130px' },
  { label: 'Fecha',         width: '100px' },
  { label: 'Próximo',       width: '100px' },
  { label: 'Acciones',      width: '80px' },
]

export default function Mantenimiento() {
  const [registros, setRegistros] = useState([])
  const [equipos, setEquipos] = useState([])
  const [form, setForm] = useState({ equipoId:'', tipo:'', descripcion:'', fecha:'', tecnico:'', proxima:'' })
  const [mostrarForm, setMostrarForm] = useState(false)
  const { usuario } = useAuth()
  const esAdmin = usuario?.rol === 'admin'

  const cargar = () => {
    api.get('/mantenimiento').then(r => setRegistros(r.data))
    api.get('/equipos').then(r => setEquipos(r.data))
  }
  useEffect(() => { cargar() }, [])

  const guardar = async () => {
    await api.post('/mantenimiento', { ...form, equipoId: parseInt(form.equipoId) })
    setForm({ equipoId:'', tipo:'', descripcion:'', fecha:'', tecnico:'', proxima:'' })
    setMostrarForm(false); cargar()
  }

  const eliminar = async (id) => {
    if (window.confirm('¿Eliminar este registro?')) { await api.delete(`/mantenimiento/${id}`); cargar() }
  }

  const gridTemplate = COLS.map(c => c.width).join(' ')
  const inp = { ...inputStyle, fontFamily: FONT }
  const lbl = { ...labelStyle, fontFamily: FONT }

  return (
    <div>
      <SectionHeader
        title="Registro de Mantenimiento"
        count={registros.length}
        esAdmin={esAdmin}
        onAdd={() => setMostrarForm(!mostrarForm)}
        labelAdd="+ Registrar mantenimiento"
      />

      {mostrarForm && esAdmin && (
        <FormCard title="Nuevo registro de mantenimiento" onSave={guardar} onCancel={() => setMostrarForm(false)} saveLabel="Registrar">
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
              <label style={lbl}>Tipo de mantenimiento</label>
              <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})} style={inp}
                onFocus={e => e.target.style.borderColor = C.verde}
                onBlur={e => e.target.style.borderColor = C.grisBorde}>
                <option value="">Seleccionar...</option>
                <option>Preventivo</option>
                <option>Correctivo</option>
                <option>Calibración</option>
              </select>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={lbl}>Descripción</label>
              <textarea value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})}
                placeholder="Describe el trabajo realizado..." rows={2}
                style={{ ...inp, resize: 'vertical' }}
                onFocus={e => e.target.style.borderColor = C.verde}
                onBlur={e => e.target.style.borderColor = C.grisBorde} />
            </div>
            <div>
              <label style={lbl}>Técnico responsable</label>
              <input value={form.tecnico} onChange={e => setForm({...form, tecnico: e.target.value})}
                placeholder="Nombre del técnico" style={inp}
                onFocus={e => e.target.style.borderColor = C.verde}
                onBlur={e => e.target.style.borderColor = C.grisBorde} />
            </div>
            <div>
              <label style={lbl}>Fecha realizado</label>
              <input type="date" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} style={inp}
                onFocus={e => e.target.style.borderColor = C.verde}
                onBlur={e => e.target.style.borderColor = C.grisBorde} />
            </div>
            <div>
              <label style={lbl}>Próximo mantenimiento (opcional)</label>
              <input type="date" value={form.proxima} onChange={e => setForm({...form, proxima: e.target.value})} style={inp}
                onFocus={e => e.target.style.borderColor = C.verde}
                onBlur={e => e.target.style.borderColor = C.grisBorde} />
            </div>
          </div>
        </FormCard>
      )}

      <div style={{ overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <TableHeader columns={COLS} />
        {registros.length === 0 && (
          <div style={{ padding: '32px', textAlign: 'center', background: C.blanco, color: C.grisTexto, fontSize: 13, fontFamily: FONT }}>
            No hay registros de mantenimiento
          </div>
        )}
        {registros.map(r => (
          <TableRow key={r.id} gridTemplate={gridTemplate}>
            <span style={{ fontSize: 12, fontFamily: FONT, color: C.grisOscuroTexto }}>{r.equipo?.descripcion || `Equipo #${r.equipoId}`}</span>
            <Badge text={r.tipo} type={tipoBadge[r.tipo] || 'default'} />
            <span style={{ fontSize: 11, fontFamily: FONT, color: C.grisTexto }}>{r.descripcion}</span>
            <span style={{ fontSize: 11, fontFamily: FONT, color: C.grisTexto }}>{r.tecnico}</span>
            <span style={{ fontSize: 11, fontFamily: FONT, color: C.grisTexto }}>{new Date(r.fecha).toLocaleDateString('es-CO')}</span>
            <span style={{ fontSize: 11, fontFamily: FONT, color: r.proxima ? C.advertencia : C.grisClaro }}>
              {r.proxima ? new Date(r.proxima).toLocaleDateString('es-CO') : '—'}
            </span>
            <div>
              {esAdmin && (
                <button onClick={() => eliminar(r.id)} style={btnDanger}
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