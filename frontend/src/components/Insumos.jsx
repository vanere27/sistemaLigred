import { useState, useEffect } from 'react'
import { useAuth } from '../context/useAuth'
import api from '../services/api'
import { C, FONT, inputStyle, labelStyle, btnEdit, btnDanger } from './unal-tokens'
import { SectionHeader, FormCard, TableHeader, TableRow } from './unal-components.jsx'

const COLS = [
  { label: 'Referencia', width: '110px' },
  { label: 'Nombre',     width: '1fr' },
  { label: 'Cantidad',   width: '90px' },
  { label: 'Mínimo',     width: '80px' },
  { label: 'Unidad',     width: '80px' },
  { label: 'Ubicación',  width: '120px' },
  { label: 'Acciones',   width: '110px' },
]

export default function Insumos() {
  const [insumos, setInsumos] = useState([])
  const [form, setForm] = useState({ nombre:'', referencia:'', cantidad:'', minimo:'5', unidad:'', ubicacion:'' })
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const { usuario } = useAuth()
  const esAdmin = usuario?.rol === 'admin'

  const cargar = () => api.get('/insumos').then(r => setInsumos(r.data))
  useEffect(() => { cargar() }, [])

  const resetForm = () => setForm({ nombre:'', referencia:'', cantidad:'', minimo:'5', unidad:'', ubicacion:'' })

  const guardar = async () => {
    const data = { ...form, cantidad: parseInt(form.cantidad), minimo: parseInt(form.minimo) }
    if (editando) { await api.put(`/insumos/${editando}`, data) }
    else { await api.post('/insumos', data) }
    resetForm(); setMostrarForm(false); setEditando(null); cargar()
  }

  const eliminar = async (id) => {
    if (window.confirm('¿Eliminar este insumo?')) { await api.delete(`/insumos/${id}`); cargar() }
  }

  const editar = (i) => {
    setForm({ nombre: i.nombre, referencia: i.referencia, cantidad: String(i.cantidad), minimo: String(i.minimo), unidad: i.unidad, ubicacion: i.ubicacion })
    setEditando(i.id); setMostrarForm(true)
  }

  const stockBajo = insumos.filter(i => i.cantidad <= i.minimo).length
  const gridTemplate = COLS.map(c => c.width).join(' ')
  const inp = { ...inputStyle, fontFamily: FONT }
  const lbl = { ...labelStyle, fontFamily: FONT }

  const campos = [
    { key: 'nombre',     label: 'Nombre',          placeholder: 'Ácido Sulfúrico' },
    { key: 'referencia', label: 'Referencia',       placeholder: 'INS-001' },
    { key: 'cantidad',   label: 'Cantidad actual',  placeholder: '100' },
    { key: 'minimo',     label: 'Cantidad mínima',  placeholder: '5' },
    { key: 'unidad',     label: 'Unidad',           placeholder: 'mL, g, unidades...' },
    { key: 'ubicacion',  label: 'Ubicación',        placeholder: 'Estante A-3' },
  ]

  return (
    <div>
      <SectionHeader
        title="Inventario de Insumos"
        count={insumos.length}
        esAdmin={esAdmin}
        onAdd={() => { setMostrarForm(!mostrarForm); setEditando(null); resetForm() }}
        labelAdd="+ Agregar insumo"
      />

      {stockBajo > 0 && (
        <div style={{
          background: '#FFF8E1', borderLeft: `4px solid ${C.advertencia}`,
          border: `1px solid ${C.advertencia}40`,
          padding: '10px 16px', marginBottom: 20,
          fontSize: 12, color: C.advertencia, fontFamily: FONT
        }}>
          ⚠ {stockBajo} insumo{stockBajo > 1 ? 's' : ''} con stock por debajo del mínimo
        </div>
      )}

      {mostrarForm && esAdmin && (
        <FormCard
          title={editando ? 'Editar insumo' : 'Registrar nuevo insumo'}
          onSave={guardar}
          onCancel={() => setMostrarForm(false)}
          saveLabel={editando ? 'Guardar cambios' : 'Registrar insumo'}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {campos.map(f => (
              <div key={f.key}>
                <label style={lbl}>{f.label}</label>
                <input value={form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})}
                  placeholder={f.placeholder} style={inp}
                  onFocus={e => e.target.style.borderColor = C.verde}
                  onBlur={e => e.target.style.borderColor = C.grisBorde} />
              </div>
            ))}
          </div>
        </FormCard>
      )}

      <div style={{ overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <TableHeader columns={COLS} />
        {insumos.length === 0 && (
          <div style={{ padding: '32px', textAlign: 'center', background: C.blanco, color: C.grisTexto, fontSize: 13, fontFamily: FONT }}>
            No hay insumos registrados
          </div>
        )}
        {insumos.map(i => (
          <TableRow key={i.id} gridTemplate={gridTemplate}>
            <span style={{ fontSize: 11, color: C.verde, fontFamily: FONT, fontWeight: 700 }}>{i.referencia}</span>
            <span style={{ fontSize: 12, fontFamily: FONT, color: C.grisOscuroTexto }}>{i.nombre}</span>
            <span style={{ fontSize: 12, fontFamily: FONT, fontWeight: 700, color: i.cantidad <= i.minimo ? C.rojo : C.verde }}>{i.cantidad}</span>
            <span style={{ fontSize: 11, fontFamily: FONT, color: C.grisTexto }}>{i.minimo}</span>
            <span style={{ fontSize: 11, fontFamily: FONT, color: C.grisTexto }}>{i.unidad}</span>
            <span style={{ fontSize: 11, fontFamily: FONT, color: C.grisTexto }}>{i.ubicacion}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {esAdmin && (
                <>
                  <button onClick={() => editar(i)} style={btnEdit}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >Editar</button>
                  <button onClick={() => eliminar(i.id)} style={btnDanger}
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