import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import api from '../services/api'
import { C, FONT } from '../components/unal-tokens'


export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) { setError('Por favor completa todos los campos'); return }
    setCargando(true); setError('')
    try {
      const res = await api.post('/auth/login', { email, password })
      login(res.data.usuario, res.data.token)
      navigate('/')
    } catch {
      setError('Correo o contraseña incorrectos')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: C.grisClaro,
      display: 'flex', flexDirection: 'column',
      fontFamily: FONT
    }}>
      {/* Franja verde superior — identidad UNAL */}
      <div style={{ height: 6, background: C.verde }} />
      <div style={{ height: 3, background: C.rojo }} />

      {/* Header institucional — logosímbolo sobre fondo blanco (norma UNAL) */}
      <header style={{
        background: C.blanco,
        borderBottom: `1px solid ${C.grisMedio}`,
        padding: '16px 40px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Izquierda: nombre dependencia */}
        <div>
          <div style={{ fontSize: 10, color: C.grisTexto, letterSpacing: 2, textTransform: 'uppercase' }}>
            Universidad Nacional de Colombia · Sede Manizales
          </div>
          <div style={{ fontSize: 13, color: C.grisOscuro, fontWeight: 700, letterSpacing: 1 }}>
            Laboratorio LIGRED
          </div>
        </div>
        {/* Derecha: logosímbolo UNAL */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            background: C.verde, padding: '6px 12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ color: C.blanco, fontSize: 16, fontFamily: FONT, fontWeight: 700, letterSpacing: 2 }}>UNAL</span>
          </div>
          <div>
            <div style={{ fontSize: 8, color: C.grisTexto, letterSpacing: 1, textTransform: 'uppercase' }}>Universidad</div>
            <div style={{ fontSize: 11, color: C.verde, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Nacional</div>
            <div style={{ fontSize: 8, color: C.grisTexto, letterSpacing: 1, textTransform: 'uppercase' }}>de Colombia</div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Título de la aplicación */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              display: 'inline-block',
              background: C.verde, color: C.blanco,
              padding: '8px 24px', marginBottom: 16
            }}>
              <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: 4, fontFamily: FONT }}>LIGRED</span>
            </div>
            <div style={{ fontSize: 13, color: C.grisTexto, fontFamily: FONT }}>
              Sistema de Gestión del Laboratorio
            </div>
          </div>

          {/* Formulario sobre fondo blanco */}
          <div style={{
            background: C.blanco,
            border: `1px solid ${C.grisMedio}`,
            borderTop: `3px solid ${C.verde}`,
            padding: '32px 36px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{
              fontSize: 13, color: C.grisOscuro, letterSpacing: 2,
              textTransform: 'uppercase', marginTop: 0, marginBottom: 24,
              fontFamily: FONT, fontWeight: 700,
              borderBottom: `1px solid ${C.grisMedio}`, paddingBottom: 12
            }}>
              Acceso al sistema
            </h2>

            <div style={{ marginBottom: 18 }}>
              <label style={{
                display: 'block', fontSize: 11, color: C.grisOscuro,
                letterSpacing: 1, marginBottom: 6, fontFamily: FONT,
                textTransform: 'uppercase', fontWeight: 700
              }}>Correo institucional</label>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="usuario@unal.edu.co"
                style={{
                  width: '100%', padding: '10px 12px',
                  border: `1px solid ${C.grisBorde}`, borderRadius: 0,
                  background: C.blanco, color: C.grisOscuro,
                  fontSize: 13, outline: 'none', boxSizing: 'border-box',
                  fontFamily: FONT, transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = C.verde}
                onBlur={e => e.target.style.borderColor = C.grisBorde}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block', fontSize: 11, color: C.grisOscuro,
                letterSpacing: 1, marginBottom: 6, fontFamily: FONT,
                textTransform: 'uppercase', fontWeight: 700
              }}>Contraseña</label>
              <input
                type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '10px 12px',
                  border: `1px solid ${C.grisBorde}`, borderRadius: 0,
                  background: C.blanco, color: C.grisOscuro,
                  fontSize: 13, outline: 'none', boxSizing: 'border-box',
                  fontFamily: FONT, transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = C.verde}
                onBlur={e => e.target.style.borderColor = C.grisBorde}
              />
            </div>

            {error && (
              <div style={{
                background: C.rojoClaro, borderLeft: `4px solid ${C.rojo}`,
                padding: '10px 14px', marginBottom: 20,
                fontSize: 12, color: C.rojo, fontFamily: FONT,
                border: `1px solid ${C.rojo}40`
              }}>
                {error}
              </div>
            )}

            <button onClick={handleLogin} disabled={cargando} style={{
              width: '100%', padding: '12px',
              background: cargando ? C.verdeMedio : C.verde,
              border: 'none', borderRadius: 0,
              color: C.blanco, fontSize: 12, letterSpacing: 2,
              cursor: cargando ? 'not-allowed' : 'pointer',
              fontFamily: FONT, textTransform: 'uppercase',
              fontWeight: 700, transition: 'background 0.2s'
            }}
              onMouseEnter={e => { if (!cargando) e.target.style.background = C.verdeOscuro }}
              onMouseLeave={e => { if (!cargando) e.target.style.background = C.verde }}
            >
              {cargando ? 'Verificando...' : 'Ingresar'}
            </button>
          </div>
        </div>
      </div>

      {/* Pie de página institucional */}
      <footer style={{
        background: C.verdeOscuro, padding: '12px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontFamily: FONT, letterSpacing: 1 }}>
          Universidad Nacional de Colombia · Sede Manizales
        </span>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: FONT }}>
          LIGRED v1.0 · {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  )
}