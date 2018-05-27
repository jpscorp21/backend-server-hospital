// REQUIRES
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// INICIALIZAR VARIABLES
const app = express();


//BODY PARSER
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// SERVER INDEX CONFIG
//const serveIndex = require('serve-index');
//app.use(express.static(__dirname + '/'));
//app.use('/uploads', serveIndex(__dirname + '/uploads'));

// IMPORTAR RUTAS
const appRoutes = require('./routes/index');
const appUsuarios = require('./routes/usuario');
const loginRoutes = require('./routes/login');
const appHospitales = require('./routes/hospital');
const appMedicos = require('./routes/medico');
const appBusqueda = require('./routes/busqueda');
const appUpload = require('./routes/upload');
const appImagenes = require('./routes/imagenes');

//MIDDLEWARE SE EJECUTA ANTES QUE PASE A LA RUTAS
app.use('/usuarios', appUsuarios);
app.use('/login', loginRoutes);
app.use('/hospitales', appHospitales);
app.use('/medicos', appMedicos);
app.use('/busqueda', appBusqueda);
app.use('/upload', appUpload);
app.use('/img', appImagenes);

app.use('/', appRoutes);

// CONEXION A LA BASE DE DATOS
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    else console.log('Base de datos \x1b[32m%s\x1b[0m','online');
});


// ESCUCHAR PETICIONES
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m','online');
});