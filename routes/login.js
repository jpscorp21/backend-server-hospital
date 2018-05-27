const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SEED = require("../config/config").SEED;

const app = express();

const Usuario = require("../models/usuario");

// Google
const CLIENT_ID = require("../config/config").CLIENT_ID;
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(CLIENT_ID);

// ==========================================
// Autenticacion de Google
// ==========================================
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token, // EL token que recibimos
    audience: CLIENT_ID
  });

  //Se obtiene la informacion
  const payload = ticket.getPayload();
  //const userid = payload['sub'];

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  };
}

app.post("/google", async (req, res) => {
  let token = req.body.token;
  let googleUser = await verify(token).catch(e => {
    return res.status(403).json({
      ok: false,
      mensaje: "Token no valido"
    });
  });

  Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar usuario",
        errors: err
      });
    }

    if (usuarioDB) {
      if (usuarioDB.google === false) {
        return res.status(400).json({
          ok: false,
          mensaje: "Debe de usar su autenticacion normal"
        });
      } else {
        // Crear un token!!!
        let token = jwt.sign({ usuario: usuarioDB }, SEED, {
          expiresIn: 14400
        });

        res.status(200).json({
          ok: true,
          usuario: usuarioDB,
          token: token,
          id: usuarioDB._id
        });
      }
    } else {
      // El usuario no existe... hay que crearlo
      var usuario = new Usuario();

      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true
      usuario.password = ':)'

      usuario.save((err, usuarioDB) => {
        let token = jwt.sign({ usuario: usuarioDB }, SEED, {
          expiresIn: 14400
        });

        res.status(200).json({
          ok: true,
          usuario: usuarioDB,
          token: token,
          id: usuarioDB._id
        });
      });
    } 
  });

  // res.status(200).json({
  //   ok: true,
  //   mensaje: "OK!!!",
  //   googleUser
  // });
});

// ==========================================
// Autenticacion Normal
// ==========================================

app.post("/", (req, res) => {
  var body = req.body;

  Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar usuario",
        errors: err
      });
    }

    // Validar email
    if (!usuarioDB) {
      return res.status(500).json({
        ok: false,
        mensaje: "Credenciales incorrectas - email",
        errors: err
      });
    }

    // Validar password
    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        mensaje: "Credenciales incorrectas - password",
        errors: err
      });
    }

    usuarioDB.password = ":)";

    // Crear un token!!!
    let token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });

    res.status(200).json({
      ok: true,
      usuario: usuarioDB,
      token: token,
      id: usuarioDB._id
    });
  });
});

module.exports = app;
