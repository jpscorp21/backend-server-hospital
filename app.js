// REQUIRES
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


// INICIALIZAR VARIABLES
const app = express();


//BODY PARSER
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// IMPORTAR RUTAS
const appRoutes = require('./routes/index');
const appUsuarios = require('./routes/usuario');
const loginRoutes = require('./routes/login');

//MIDDLEWARE SE EJECUTA ANTES QUE PASE A LA RUTAS
app.use('/', appRoutes);
app.use('/usuarios', appUsuarios);
app.use('/login', loginRoutes);


// CONEXION A LA BASE DE DATOS

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    else console.log('Base de datos \x1b[32m%s\x1b[0m','online');
});



// ESCUCHAR PETICIONES
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m','online');
});