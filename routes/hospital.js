const express = require('express');
const mdAutenticacion = require('../middlewares/autenticacion');

const app = express();

const Hospital = require("../models/hospital");

// ==========================================
// Obtener todos los hospitales
// ==========================================
app.get('/', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')    
        .exec((err, hospitales) => {
        // Si falla
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error cargando hospitales",
                errors: err
            })
        }
        // Si funciona
        Hospital.count({}, (err, conteo) => {            
                res.status(200).json({
                ok: true,
                hospitales,
                total: conteo
            })
        })
        
    });    
});


// ==========================================
// Actualizar hospital
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res, next) => {
    let id = req.params.id;
    let body = req.body;

    // Buscar un hospital
    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar un hospital",
                errors: err
            });
        }

        if (!hospital) {
            //Cuando no existe el dato especificado
            return res.status(400).json({
                ok: false,
                mensaje: "El hospital con el id " + id + " no existe",
                errors: {message: "No existe un hospital con ese ID"}
            });
        }

        // Hospital guardado
        hospital.nombre = body.nombre,
        hospital.img = body.img,
        hospital.usuario = req.usuario._id;

        // Actualizando el hospital
        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                })
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });

        });

        
    });
});


// ==========================================
// Agregar un nuevo hospital
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res, next) => {
    let body = req.body;

    let hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id //El usuario que cargo
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error al crear hospital",
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });
    });
});


// ==========================================
// Borrar un usuario mediante el id
// ==========================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res, next) => {

    // Guardar el id
    let id = req.params.id;

    // Buscar el hospital para borrar
    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        // Comprobar si hubo error en el servidor
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar el hospital',
                errors: err
            })
        }

        // Comprobar si encontro el hospital a eliminar
        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese id',
                errors: {message: 'No existe un hospital con ese id'}
            })
        }

        // Si llegó aca, la eliminación fue exitosa
        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        })

    });    
});



module.exports = app;