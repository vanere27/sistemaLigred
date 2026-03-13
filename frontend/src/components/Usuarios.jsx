import { useState, useEffect } from 'react'
import { useAuth } from '../context/useAuth'
import api from '../services/api'
import { C, FONT, inputStyle, labelStyle, btnDanger } from './unal-tokens'
import { SectionHeader, FormCard, TableHeader, TableRow, Badge } from './unal-components.jsx'

const rolBadge = { admin: 'success', profesor: 'info', viewer: 'default' }
const rolLabel = { admin: 'Administrador', profesor: 'Profesor', viewer: 'Visitante' }

const COLS = [
  { label: 'Nombre',   width: '1fr' },
  { label: 'Correo',   width: '1fr' },
  { label: 'Rol',      width: '130px' },
  { label: 'Acciones', width: '80px' },
]

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [form, setForm] = useState({ nombre:'', email:'', password:'', rol:'viewer' })
  const [mostrarForm, setMostrarForm] = useState(false)
  const { usuario } = useAuth()

  const cargar = () => api.get('/usuarios').then(r => setUsuarios(r.data))
  useEffect(() => { cargar() }, [])

  const guardar = async () => {
    await api.post('/auth/register', form)
    setForm({ nombre:'', email:'', password:'', rol:'viewer' })
    setMostrarForm(false); cargar()
  }

  const eliminar = async (id) => {
    if (id === usuario?.id) { alert('No puedes eliminar tu propio usuario.'); return }
    if (window.confirm('¿Eliminar este usuario?')) { await api.delete(`/usuarios/${id}`); cargar() }
  }

  const gridTemplate = COLS.map(c => c.width).join(' ')
  const inp = { ...inputStyle, fontFamily: FONT }
  const lbl = { ...labelStyle, fontFamily: FONT }

  return (
    <div>
      <SectionHeader
        title="Gestión de Usuarios"
        count={usuarios.length}
        esAdmin={true}
        onAdd={() => setMostrarForm(!mostrarForm)}
        labelAdd="+ Nuevo usuario"
      />

      {mostrarForm && (
        <FormCard title="Crear nuevo usuario" onSave={guardar} onCancel={() => setMostrarForm(false)} saveLabel="Crear usuario">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={lbl}>Nombre completo</label>
              <input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})}
                placeholder="Dr. Juan Pérez" style={inp}
                onFocus={e => e.target.style.borderColor = C.verde}
                onBlur={e => e.target.style.borderColor = C.grisBorde} />
            </div>
            <div>
              <label style={lbl}>Correo institucional</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                placeholder="usuario@unal.edu.co" style={inp}
                onFocus={e => e.target.style.borderColor = C.verde}
                onBlur={e => e.target.style.borderColor = C.grisBorde} />
            </div>
            <div>
              <label style={lbl}>Contraseña</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                placeholder="Mínimo 6 caracteres" style={inp}
                onFocus={e => e.target.style.borderColor = C.verde}
                onBlur={e => e.target.style.borderColor = C.grisBorde} />
            </div>
            <div>
              <label style={lbl}>Rol en el sistema</label>
              <select value={form.rol} onChange={e => setForm({...form, rol: e.target.value})} style={inp}
                onFocus={e => e.target.style.borderColor = C.verde}
                onBlur={e => e.target.style.borderColor = C.grisBorde}>
                <option value="viewer">Visitante — solo puede ver</option>
                <option value="profesor">Profesor — puede registrar préstamos</option>
                <option value="admin">Administrador — acceso total</option>
              </select>
            </div>
          </div>
        </FormCard>
      )}

      <div style={{ overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <TableHeader columns={COLS} />
        {usuarios.length === 0 && (
          <div style={{ padding: '32px', textAlign: 'center', background: C.blanco, color: C.grisTexto, fontSize: 13, fontFamily: FONT }}>
            No hay usuarios registrados
          </div>
        )}
        {usuarios.map(u => (
          <TableRow key={u.id} gridTemplate={gridTemplate}>
            <span style={{ fontSize: 12, fontFamily: FONT, color: C.grisOscuroTexto }}>{u.nombre}</span>
            <span style={{ fontSize: 11, fontFamily: FONT, color: C.grisTexto }}>{u.email}</span>
            <Badge text={rolLabel[u.rol] || u.rol} type={rolBadge[u.rol] || 'default'} />
            <button onClick={() => eliminar(u.id)} style={btnDanger}
              onMouseEnter={e => { e.currentTarget.style.background = C.rojo; e.currentTarget.style.color = C.blanco }}
              onMouseLeave={e => { e.currentTarget.style.background = C.blanco; e.currentTarget.style.color = C.rojo }}
            >Borrar</button>
          </TableRow>
        ))}
      </div>
    </div>
  )
}