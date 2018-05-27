const express = require('express');

const app = express();

const path = require('path');
const fs = require('fs');
// RUTAS
// CREAR UN ESTANDAR DE RESPUESTA JSON
app.get('/:tipo/:img', (req, res, next) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    //Encontrar una imagen
    let pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);
    
    if ( fs.existsSync(pathImagen) ) {
        res.sendFile(pathImagen);
    } else {
        // Encontrar la no imagen
        let pathNoImagen = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImagen);
    }

});

module.exports = app;