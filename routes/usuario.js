const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

const app = express();

const Usuario = require("../models/usuario");

// ===================================
// Obtener todos los usuarios
// ===================================
app.get("/", (req, res, next) => {

  let desde = req.query.desde || 0;
  desde = Number(desde);
  

  Usuario.find({}, "nombre email img role")
  .skip(desde)
  .limit(5) // TRAE LOS PRIMEROS 5
  .exec((err, usuarios) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error cargando usuarios",
        errors: err
      });
    }

    Usuario.count({}, (err, conteo) => {
      res.status(200).json({
        ok: true,
        usuarios,
        total: conteo
      });
    })
  });
});


// ===================================
// Actualizar usuarios
// ===================================
app.put("/:id", mdAutenticacion.verificaToken ,(req, res) => {
  let id = req.params.id; //Obtiene el parametro id
  let body = req.body;

  Usuario.findById(id, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar usuario",
        errors: err
      });
    }

    if (!usuario) {
      // 400 es cuando no existe un dato solicitado
      return res.status(400).json({
        ok: false,
        mensaje: "El usuario con el id" + id + " no existe",
        errors: { message: "No existe un usuario con ese ID" }
      });
    }

    usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.role = body.role;

    usuario.save((err, usuarioGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar usuario",
          errors: err
        });
      }

      // Carita feliz
      usuarioGuardado.password = ":)";

      res.status(200).json({
        ok: true,
        usuarios: usuarioGuardado
      });
    });
  });
});

// =====================================
//  Crear un nuevo usuario
// =====================================
app.post("/", mdAutenticacion.verificaToken ,(req, res) => {
  let body = req.body;

  // SE CREA EL USUARIO
  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role
  });

  //SE GUARDA EL USUARIO
  usuario.save((err, usuarioGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear usuario",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      usuarios: usuarioGuardado,
      usuarioDecoded: req.usuario
    });
  });
});

// ==========================================
// Borrar un usuario mediante el id
// ==========================================
app.delete("/:id", mdAutenticacion.verificaToken ,(req, res) => {
  let id = req.params.id;

  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error borrar usuario",
        errors: err
      });
    }

    if (!usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe un usuario con ese id",
        errors: {message: "No existe un usuario con ese id"}
      });
    }

    res.status(200).json({
      ok: true,
      usuarios: usuarioBorrado
    });
  });
});
module.exports = app;
