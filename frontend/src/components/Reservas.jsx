import { useState, useEffect } from 'react'
import { useAuth } from '../context/useAuth'
import api from '../services/api'
import { C, FONT, inputStyle, labelStyle, btnDanger } from './unal-tokens'
import { SectionHeader, FormCard, TableHeader, TableRow, Badge } from './unal-components.jsx'

const estadoBadge = { Pendiente: 'warning', Confirmada: 'success', Cancelada: 'danger' }

const COLS = [
  { label: 'Recurso / Sala', width: '1fr' },
  { label: 'Solicitante',    width: '150px' },
  { label: 'Fecha',          width: '110px' },
  { label: 'Horario',        width: '130px' },
  { label: 'Estado',         width: '100px' },
  { label: 'Acciones',       width: '80px' },
]

export default function Reservas() {
  const [reservas, setReservas] = useState([])
  const [form, setForm] = useState({ recurso:'', solicitante:'', fecha:'', horaInicio:'', horaFin:'' })
  const [mostrarForm, setMostrarForm] = useState(false)
  const { usuario } = useAuth()
  const puedeAgregar = usuario?.rol === 'admin' || usuario?.rol === 'profesor'
  const esAdmin = usuario?.rol === 'admin'

  const cargar = () => api.get('/reservas').then(r => setReservas(r.data))
  useEffect(() => { cargar() }, [])

  const guardar = async () => {
    await api.post('/reservas', form)
    setForm({ recurso:'', solicitante:'', fecha:'', horaInicio:'', horaFin:'' })
    setMostrarForm(false); cargar()
  }

  const eliminar = async (id) => {
    if (window.confirm('¿Eliminar esta reserva?')) { await api.delete(`/reservas/${id}`); cargar() }
  }

  const gridTemplate = COLS.map(c => c.width).join(' ')
  const inp = { ...inputStyle, fontFamily: FONT }
  const lbl = { ...labelStyle, fontFamily: FONT }

  return (
    <div>
      <SectionHeader
        title="Reservas de Espacios y Equipos"
        count={reservas.length}
        esAdmin={puedeAgregar}
        onAdd={() => setMostrarForm(!mostrarForm)}
        labelAdd="+ Nueva reserva"
      />

      {mostrarForm && puedeAgregar && (
        <FormCard title="Nueva reserva" onSave={guardar} onCancel={() => setMostrarForm(false)} saveLabel="Registrar reserva">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={lbl}>Recurso / Sala</label>
              <input value={form.recurso} onChange={e => setForm({...form, recurso: e.target.value})}
                placeholder="Sala A, Equipo EQ-001..." style={inp}
                onFocus={e => e.target.style.borderColor = C.verde}
                onBlur={e => e.target.style.borderColor = C.grisBorde} />
            </div>
            <div>
              <label style={lbl}>Solicitante</label>
              <input value={form.solicitante} onChange={e => setForm({...form, solicitante: e.target.value})}
                placeholder="Nombre completo" style={inp}
                onFocus={e => e.target.style.borderColor = C.verde}
                onBlur={e => e.target.style.borderColor = C.grisBorde} />
            </div>
            <div>
              <label style={lbl}>Fecha</label>
              <input type="date" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} style={inp}
                onFocus={e => e.target.style.borderColor = C.verde}
                onBlur={e => e.target.style.borderColor = C.grisBorde} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <label style={lbl}>Hora inicio</label>
                <input type="time" value={form.horaInicio} onChange={e => setForm({...form, horaInicio: e.target.value})} style={inp}
                  onFocus={e => e.target.style.borderColor = C.verde}
                  onBlur={e => e.target.style.borderColor = C.grisBorde} />
              </div>
              <div>
                <label style={lbl}>Hora fin</label>
                <input type="time" value={form.horaFin} onChange={e => setForm({...form, horaFin: e.target.value})} style={inp}
                  onFocus={e => e.target.style.borderColor = C.verde}
                  onBlur={e => e.target.style.borderColor = C.grisBorde} />
              </div>
            </div>
          </div>
        </FormCard>
      )}

      <div style={{ overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <TableHeader columns={COLS} />
        {reservas.length === 0 && (
          <div style={{ padding: '32px', textAlign: 'center', background: C.blanco, color: C.grisTexto, fontSize: 13, fontFamily: FONT }}>
            No hay reservas registradas
          </div>
        )}
        {reservas.map(r => (
          <TableRow key={r.id} gridTemplate={gridTemplate}>
            <span style={{ fontSize: 12, fontFamily: FONT, color: C.grisOscuroTexto }}>{r.recurso}</span>
            <span style={{ fontSize: 12, fontFamily: FONT, color: C.grisOscuroTexto }}>{r.solicitante}</span>
            <span style={{ fontSize: 11, fontFamily: FONT, color: C.grisTexto }}>{new Date(r.fecha).toLocaleDateString('es-CO')}</span>
            <span style={{ fontSize: 11, fontFamily: FONT, color: C.grisTexto }}>{r.horaInicio} — {r.horaFin}</span>
            <Badge text={r.estado} type={estadoBadge[r.estado]} />
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