import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import { useNavigate } from 'react-router-dom'
import Equipos from '../components/Equipos'
import Prestamos from '../components/Prestamos'
import Insumos from '../components/Insumos'
import Reservas from '../components/Reservas'
import Mantenimiento from '../components/Mantenimiento'
import Usuarios from '../components/Usuarios'
import Materias from '../components/Materias'
import { C, FONT } from '../components/unal-tokens'
import escudoUnal from '../assets/escudoUnal.svg'

export default function Dashboard() {
  const [tab, setTab] = useState('equipos')
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const esAdmin = usuario?.rol === 'admin'

  const handleLogout = () => { logout(); navigate('/login') }

  const tabs = [
    { id: 'equipos',       label: 'Equipos',       icon: '⚙' },
    { id: 'prestamos',     label: 'Préstamos',      icon: '↗' },
    { id: 'reservas',      label: 'Reservas',       icon: '📅' },
    { id: 'insumos',       label: 'Insumos',        icon: '🧪' },
    { id: 'mantenimiento', label: 'Mantenimiento',  icon: '🔧' },
    { id: 'materias', label: 'Líneas de Trabajo', icon: '🔬' },
    ...(esAdmin ? [{ id: 'usuarios', label: 'Usuarios', icon: '👤' }] : []),
  ]

  const componentes = {
    equipos:       <Equipos />,
    prestamos:     <Prestamos />,
    reservas:      <Reservas />,
    insumos:       <Insumos />,
    mantenimiento: <Mantenimiento />,
    materias:      <Materias />,
    usuarios:      <Usuarios />,
  }

  const rolLabel = { admin: 'Administrador', profesor: 'Profesor', viewer: 'Visitante' }

  return (
    <div style={{
      minHeight: '100vh',
      background: C.grisMuyClaro,
      fontFamily: FONT,
      display: 'flex',
      flexDirection: 'column',
      color: C.grisOscuroTexto
    }}>

      {/* Franja verde superior */}
      <div style={{ height: 6, background: C.verde }} />
      <div style={{ height: 3, background: C.rojo }} />

      {/* HEADER — fondo blanco, escudo a la IZQUIERDA */}
      <header style={{
        background: C.blanco,
        borderBottom: `1px solid ${C.grisBorde}`,
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 6px rgba(0,0,0,0.07)'
      }}>

        {/* IZQUIERDA: escudo + nombre universidad + dependencia */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <img
            src={escudoUnal}
            alt="Escudo UNAL"
            style={{ height: 70, width: 'auto' }}
          />
          <div style={{ borderLeft: `2px solid ${C.verde}`, paddingLeft: 16 }}>
            <div style={{
              fontSize: 10, color: C.grisTexto,
              letterSpacing: 2, textTransform: 'uppercase',
              fontFamily: FONT, marginBottom: 2
            }}>
              Universidad Nacional de Colombia · Sede Manizales
            </div>
            <div style={{
              fontSize: 20, color: C.grisOscuroTexto,
              fontWeight: 700, fontFamily: FONT, letterSpacing: 0.5
            }}>
              Laboratorio LIGRED
            </div>
            <div style={{
              fontSize: 11, color: C.verde,
              fontFamily: FONT, letterSpacing: 1,
              textTransform: 'uppercase', marginTop: 2
            }}>
              Sistema de Gestión de Recursos
            </div>
          </div>
        </div>

        {/* DERECHA: usuario + botón salir */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: 14, color: C.grisOscuroTexto,
              fontWeight: 700, fontFamily: FONT
            }}>
              {usuario?.nombre}
            </div>
            <div style={{
              fontSize: 11, color: C.grisTexto,
              letterSpacing: 1, fontFamily: FONT,
              textTransform: 'uppercase'
            }}>
              {rolLabel[usuario?.rol] || usuario?.rol}
            </div>
          </div>
          <button onClick={handleLogout} style={{
            background: C.blanco,
            border: `1px solid ${C.rojo}`,
            borderRadius: 0, padding: '8px 20px',
            color: C.rojo, fontSize: 11,
            cursor: 'pointer', fontFamily: FONT,
            letterSpacing: 1, textTransform: 'uppercase',
            fontWeight: 700, transition: 'all 0.2s'
          }}
            onMouseEnter={e => {
              e.currentTarget.style.background = C.rojo
              e.currentTarget.style.color = C.blanco
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = C.blanco
              e.currentTarget.style.color = C.rojo
            }}
          >
            Salir
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>

        {/* SIDEBAR */}
        <nav style={{
          width: 210,
          background: C.blanco,
          borderRight: `1px solid ${C.grisBorde}`,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '14px 20px 10px',
            fontSize: 9, color: C.grisTexto,
            letterSpacing: 2, textTransform: 'uppercase',
            fontFamily: FONT, fontWeight: 700,
            borderBottom: `1px solid ${C.grisBorde}`,
            background: C.grisMuyClaro
          }}>
            Módulos del sistema
          </div>

          <div style={{ flex: 1 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                width: '100%', padding: '12px 20px',
                textAlign: 'left',
                background: tab === t.id ? C.verdeClaro : 'transparent',
                border: 'none',
                borderLeft: tab === t.id
                  ? `4px solid ${C.verde}`
                  : `4px solid transparent`,
                borderBottom: `1px solid ${C.grisBorde}`,
                color: tab === t.id ? C.verdeOscuro : C.grisTexto,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 10,
                fontSize: 12, fontFamily: FONT,
                fontWeight: tab === t.id ? 700 : 400,
                transition: 'all 0.12s'
              }}
                onMouseEnter={e => {
                  if (tab !== t.id) e.currentTarget.style.background = C.grisMuyClaro
                }}
                onMouseLeave={e => {
                  if (tab !== t.id) e.currentTarget.style.background = 'transparent'
                }}
              >
                <span style={{ fontSize: 15, minWidth: 22 }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Pie del sidebar */}
          <div style={{
            padding: '12px 20px',
            borderTop: `3px solid ${C.verde}`,
            background: C.verdeOscuro
          }}>
            <div style={{
              fontSize: 9, color: 'rgba(255,255,255,0.7)',
              letterSpacing: 1, fontFamily: FONT
            }}>
              LIGRED v1.0 · UNAL Manizales
            </div>
          </div>
        </nav>

        {/* CONTENIDO PRINCIPAL */}
        <main style={{
          flex: 1, padding: 32,
          overflowY: 'auto',
          background: C.grisMuyClaro
        }}>
          {componentes[tab]}
        </main>
      </div>
    </div>
  )
}