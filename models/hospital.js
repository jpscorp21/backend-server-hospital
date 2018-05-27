var mongoose = require('mongoose'); // Libreria de mongodb
var Schema = mongoose.Schema; // Esquema de mongo

var hospitalSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' } // Relacion con otra coleccion, donde se guarda el id usuario
}, {collection: 'hospitales'});

module.exports = mongoose.model('Hospital', hospitalSchema);

