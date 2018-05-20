const express = require('express');
const app = express();

// RUTAS
// CREAR UN ESTANDAR DE RESPUESTA JSON
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });

});

module.exports = app;