import { useState, useEffect } from 'react'
import { useAuth } from '../context/useAuth'
import api from '../services/api'
import { C, FONT, inputStyle, labelStyle, btnEdit, btnDanger } from './unal-tokens'
import { SectionHeader, FormCard, TableHeader, TableRow, Badge } from './unal-components.jsx'

const CATEGORIAS = ['Servidor','Computador Portátil','Computador','Tablet','Escritorio','Microscopio','Centrifugadora','Balanza','Otro']
const estadoBadge = { Disponible: 'success', Prestado: 'warning', Mantenimiento: 'danger' }

const COLS = [
  { label: 'Código',      width: '90px' },
  { label: 'Descripción', width: '1fr' },
  { label: 'Categoría',   width: '130px' },
  { label: 'Ubicación',   width: '90px' },
  { label: 'Estado',      width: '110px' },
  { label: 'Encargado',   width: '140px' },
  { label: 'Prestado a',  width: '130px' },
  { label: 'Acciones',    width: '110px' },
]

export default function Equipos() {
  const [equipos, setEquipos] = useState([])
  const [profesores, setProfesores] = useState([])
  const [form, setForm] = useState({ codigo:'', descripcion:'', categoria:'', ubicacion:'', estado:'Disponible', encargadoId:'', prestadoA:'' })
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const { usuario } = useAuth()
  const esAdmin = usuario?.rol === 'admin'

  const cargar = () => {
    api.get('/equipos').then(r => setEquipos(r.data))
    api.get('/usuarios/profesores').then(r => setProfesores(r.data))
  }
  useEffect(() => { cargar() }, [])

  const resetForm = () => setForm({ codigo:'', descripcion:'', categoria:'', ubicacion:'', estado:'Disponible', encargadoId:'', prestadoA:'' })

  const guardar = async () => {
    const data = {
      ...form,
      encargadoId: form.encargadoId ? parseInt(form.encargadoId) : null,
      prestadoA: form.estado === 'Prestado' ? form.prestadoA : null
    }
    if (editando) { await api.put(`/equipos/${editando}`, data) }
    else { await api.post('/equipos', data) }
    resetForm(); setMostrarForm(false); setEditando(null); cargar()
  }

  const eliminar = async (id) => {
    if (window.confirm('¿Eliminar este equipo?\n\nSe eliminarán también todos los préstamos y registros de mantenimiento asociados.')) {
      await api.delete(`/equipos/${id}`); cargar()
    }
  }

  const editar = (eq) => {
    setForm({
      codigo: eq.codigo, descripcion: eq.descripcion,
      categoria: eq.categoria, ubicacion: eq.ubicacion,
      estado: eq.estado, encargadoId: eq.encargadoId || '',
      prestadoA: eq.prestadoA || ''
    })
    setEditando(eq.id); setMostrarForm(true)
  }

  const gridTemplate = COLS.map(c => c.width).join(' ')
  const inp = { ...inputStyle, fontFamily: FONT }
  const lbl = { ...labelStyle, fontFamily: FONT }

  return (
    <div>
      <SectionHeader
        title="Inventario de Equipos"
        count={equipos.length}
        esAdmin={esAdmin}
        onAdd={() => { setMostrarForm(!mostrarForm); setEditando(null); resetForm() }}
        labelAdd="+ Registrar equipo"
      />

      {mostrarForm && esAdmin && (
        <FormCard
          title={editando ? 'Editar equipo' : 'Registrar nuevo equipo'}
          onSave={guardar}
          onCancel={() => setMostrarForm(false)}
          saveLabel={editando ? 'Guardar cambios' : 'Registrar equipo'}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={lbl}>Código</label>
              <input value={form.codigo} onChange={e => setForm({...form, codigo: e.target.value})}
                placeholder="EQ-001" style={inp}
                onFocus={e => e.target.style.borderColor = C.verde}
                onBlur={e => e.target.style.borderColor = C.grisBorde} />
            </div>
            <div>
              <label style={lbl}>Categoría</label>
              <select value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} style={inp}
                onFocus={e => e.target.style.borderColor = C.verde}
                onBlur={e => e.target.style.borderColor = C.grisBorde}>
                <option value="">Seleccionar...</option>
                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={lbl}>Descripción</label>
              <textarea value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})}
                placeholder="Describe el equipo..." rows={2}
                style={{ ...inp, resize: 'vertical' }}
                onFocus={e => e.target.style.borderColor = C.verde}
                onBlur={e => e.target.style.borderColor = C.grisBorde} />
            </div>
            <div>
              <label style={lbl}>Ubicación</label>
              <input value={form.ubicacion} onChange={e => setForm({...form, ubicacion: e.target.value})}
                placeholder="Sala A" style={inp}
                onFocus={e => e.target.style.borderColor = C.verde}
                onBlur={e => e.target.style.borderColor = C.grisBorde} />
            </div>
            <div>
              <label style={lbl}>Profesor encargado</label>
              <select value={form.encargadoId} onChange={e => setForm({...form, encargadoId: e.target.value ? parseInt(e.target.value) : ''})} style={inp}
                onFocus={e => e.target.style.borderColor = C.verde}
                onBlur={e => e.target.style.borderColor = C.grisBorde}>
                <option value="">Sin asignar</option>
                {profesores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Estado</label>
              <select value={form.estado} onChange={e => setForm({...form, estado: e.target.value})} style={inp}
                onFocus={e => e.target.style.borderColor = C.verde}
                onBlur={e => e.target.style.borderColor = C.grisBorde}>
                <option>Disponible</option>
                <option>Prestado</option>
                <option>Mantenimiento</option>
              </select>
            </div>
            {form.estado === 'Prestado' && (
              <div>
                <label style={lbl}>Prestado a</label>
                <input value={form.prestadoA} onChange={e => setForm({...form, prestadoA: e.target.value})}
                  placeholder="Nombre de quien tiene el equipo"
                  style={inp}
                  onFocus={e => e.target.style.borderColor = C.verde}
                  onBlur={e => e.target.style.borderColor = C.grisBorde} />
              </div>
            )}
          </div>
        </FormCard>
      )}

      <div style={{ overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <TableHeader columns={COLS} />
        {equipos.length === 0 && (
          <div style={{ padding: '32px', textAlign: 'center', background: C.blanco, color: C.grisTexto, fontSize: 13, fontFamily: FONT }}>
            No hay equipos registrados
          </div>
        )}
        {equipos.map(eq => (
          <TableRow key={eq.id} gridTemplate={gridTemplate}>
            <span style={{ fontSize: 11, fontFamily: FONT, color: C.verde, fontWeight: 700 }}>{eq.codigo}</span>
            <span style={{ fontSize: 12, fontFamily: FONT, color: C.grisOscuroTexto }}>{eq.descripcion}</span>
            <span style={{ fontSize: 11, fontFamily: FONT, color: C.grisTexto }}>{eq.categoria}</span>
            <span style={{ fontSize: 11, fontFamily: FONT, color: C.grisTexto }}>{eq.ubicacion}</span>
            <Badge text={eq.estado} type={estadoBadge[eq.estado]} />
            <span style={{ fontSize: 11, fontFamily: FONT, color: C.azul }}>
              {eq.encargado ? eq.encargado.nombre : <span style={{ color: C.grisClaro }}>—</span>}
            </span>
            <span style={{ fontSize: 11, fontFamily: FONT, color: C.advertencia }}>
              {eq.estado === 'Prestado' && eq.prestadoA ? eq.prestadoA : <span style={{ color: C.grisClaro }}>—</span>}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {esAdmin && (
                <>
                  <button onClick={() => editar(eq)} style={btnEdit}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >Editar</button>
                  <button onClick={() => eliminar(eq.id)} style={btnDanger}
                    onMouseEnter={e => { e.currentTarget.style.background = C.rojo; e.currentTarget.style.color = C.blanco }}
                    onMouseLeave={e => { e.currentTarget.style.background = C.blanco; e.currentTarget.style.color = C.rojo }}
                  >Borrar</button>
                </>
              )}
            </div>
          </TableRow>
        ))}
      </div>
    </div>
  )
}