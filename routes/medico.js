const express = require('express');
const mdAutenticacion = require('../middlewares/autenticacion');

const app = express();

const Medico = require('../models/medico');


// ==========================================
// LISTA DE TODOS LOS MEDICOS
// ==========================================
app.get('/', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({}) 
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar los medicos',
                errors: err
            })
        }


        Medico.count({}, (err, conteo) => {
            res.status(200).json({
                ok: true,
                medicos,
                total: conteo
            });
        })        
    })

});


// ==========================================
// Actualizar medico
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken ,(req, res, next) => {
    let id = req.params.id;
    let body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe el medico con ese ID',
                errors: {message: 'No existe el medico con ese ID'}
            });
        }

        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                })
            }

            return res.status(200).json({
                ok: true,
                medico: medicoGuardado
            })
        })

    })
});


// ==========================================
// Crear un medico
// ==========================================
app.post('/', mdAutenticacion.verificaToken ,(req, res, next) => {

    let body = req.body;
    
    let medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital
    })

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al guardar el medico',
                errors: err
            }) 
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });
    })

});


// ==========================================
// Eliminar medico
// ==========================================
app.delete('/:id', mdAutenticacion.verificaToken ,(req, res, next) => {
    
    let id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            }) 
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe el medico con ese ID',
                errors: {message: 'No existe el medico con ese ID'}
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });

});

module.exports = app;