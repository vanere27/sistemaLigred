// Importar tipografía Ancízar Sans desde Google Fonts (alternativa disponible)
// Como Ancízar no está en Google Fonts, usamos la importación directa de UNAL
// o la aproximamos con una serif similar

// ─── Paleta oficial UNAL (Guía de Identidad Visual) ──────────────
export const C = {
  // Colores complementarios oficiales (de la imagen de la guía)
  verde:        '#46673F',  // Pantone 7743C — RGB 70 107 63
  verdeOscuro:  '#2D4A28',  // Verde más oscuro para hover
  verdeClaro:   '#EAF0E8',  // Verde muy claro para fondos
  verdeMedio:   '#5A7D53',  // Verde medio

  rojo:         '#762327',  // Pantone 188C — RGB 118 35 47
  rojoClaro:    '#F9EDED',  // Rojo muy claro para fondos

  grisOscuro:   '#565C5C',  // Pantone 425C — RGB 86 90 92
  grisClaro:    '#B1B2B0',  // Pantone 421C — RGB 177 178 176
  grisMuyClaro: '#F2F2F2',  // Fondo general
  grisBorde:    '#D0D0D0',  // Bordes
  grisTexto:    '#565C5C',  // Texto secundario (mismo Pantone 425C)

  // Neutros
  blanco:       '#FFFFFF',
  negro:        '#1A1A1A',
  grisOscuroTexto: '#333333',

  // Estados
  exito:        '#46673F',  // Usa el verde institucional
  exitoClaro:   '#EAF0E8',
  advertencia:  '#8B5E00',
  advertenciaClaro: '#FFF8E1',
  info:         '#1565C0',
  infoClaro:    '#E3F2FD',
  amarillo:     '#8B5E00',
  azul:         '#1565C0',
}

// ─── Tipografía Ancízar Sans ──────────────────────────────────────
// Ancízar es la tipografía institucional de la UNAL
// Se carga desde el servidor de la UNAL o se aproxima con Georgia (serif)
// Para usarla: descarga los archivos .woff2 de identidad.unal.edu.co
// y ponlos en frontend/src/assets/fonts/
export const FONT = "'Inter', 'Segoe UI', Arial, sans-serif"
export const FONT_ITALIC = "'Ancizar Sans', 'Georgia', serif"


// ─── Estilos base ─────────────────────────────────────────────────
export const inputStyle = {
  width: '100%', padding: '8px 12px', borderRadius: 0,
  border: '1px solid #D0D0D0', background: '#FFFFFF',
  color: '#333333', fontSize: 13, boxSizing: 'border-box',
  fontFamily: "'Ancizar Sans', Georgia, serif",
  outline: 'none', transition: 'border-color 0.2s'
}

export const labelStyle = {
  fontSize: 11, color: '#333333', letterSpacing: 0.5,
  display: 'block', marginBottom: 5,
  fontFamily: "'Ancizar Sans', Georgia, serif",
  textTransform: 'uppercase', fontWeight: 700
}

export const btnPrimary = {
  background: '#46673F', border: 'none', borderRadius: 0,
  padding: '9px 22px', color: '#FFFFFF', fontSize: 12,
  letterSpacing: 1, cursor: 'pointer',
  fontFamily: "'Ancizar Sans', Georgia, serif",
  textTransform: 'uppercase', transition: 'background 0.2s', fontWeight: 700
}

export const btnSecondary = {
  background: '#FFFFFF', border: '1px solid #D0D0D0', borderRadius: 0,
  padding: '9px 22px', color: '#565C5C', fontSize: 12,
  letterSpacing: 1, cursor: 'pointer',
  fontFamily: "'Ancizar Sans', Georgia, serif",
  textTransform: 'uppercase', transition: 'all 0.2s'
}

export const btnDanger = {
  background: '#FFFFFF', border: '1px solid #762327', borderRadius: 0,
  padding: '5px 12px', color: '#762327', fontSize: 11,
  cursor: 'pointer', fontFamily: "'Ancizar Sans', Georgia, serif",
  transition: 'all 0.2s'
}

export const btnEdit = {
  background: '#EAF0E8', border: '1px solid #46673F', borderRadius: 0,
  padding: '5px 12px', color: '#2D4A28', fontSize: 11,
  cursor: 'pointer', fontFamily: "'Ancizar Sans', Georgia, serif",
  transition: 'all 0.2s'
}