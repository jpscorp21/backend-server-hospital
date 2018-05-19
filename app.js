// REQUIRES
var express = require('express');
var mongoose = require('mongoose');


// INICIALIZAR VARIABLES
var app = express();

// CONEXION A LA BASE DE DATOS

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    else console.log('Base de datos \x1b[32m%s\x1b[0m','online');
});

// RUTAS
// CREAR UN ESTANDAR DE RESPUESTA JSON
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });

});

// ESCUCHAR PETICIONES
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m','online');
});