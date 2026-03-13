const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth',    require('./routes/auth.routes'));
app.use('/api/equipos', require('./routes/equipos.routes'));
app.use('/api/prestamos', require('./routes/prestamos.routes'));
app.use('/api/insumos', require('./routes/insumos.routes'));
app.use('/api/reservas', require('./routes/reservas.routes'));
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/profesores', require('./routes/profesores.routes'));
app.use('/api/mantenimiento', require('./routes/mantenimiento.routes'));
app.use('/api/materias', require('./routes/materias.routes'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`LIGRED API corriendo en puerto ${PORT}`));
