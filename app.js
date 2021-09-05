const debug = require('debug')('app:inicio');
// const dbDebug = require('debug')('app:db');
const express = require('express');
const config = require('config');
// const logger = require('./logger')
const morgan = require('morgan');
const Joi = require('joi');
const app = express();

app.use(express.json()); //body
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

//configuracion de entornos
console.log('aplicacion: ' + config.get('nombre'));
console.log('DB server: ' + config.get('configDB.host'));

//uso de middleware de tercero - morgan
if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    // console.log('Morgan Hablitado...');
    debug('Morgan Hablitado...');
}

//trabajos con la base de datos
debug('Conectando con la bd....');


// app.use(logger);

const usuarios = [
    {id:1, nombre:"Grover"},
    {id:2, nombre:"Luis"},
    {id:3, nombre:"Pablo"},
];



app.get('/', (req, res) => {
    res.send('Hola mundo desde express.');
})

app.get('/api/usuarios', (req, res) => {
   res.send(usuarios);
});

app.get('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) res.status(404).send('El usuario no fue encontrado');
    res.send(usuario);
});

app.post('/api/usuarios', (req, res) => {

    const { error, value } = validarUsuario(req.body.nombre);
    if (!error) {
        const usuario = {
            id: usuarios.length+1,
            nombre: req.body.nombre
        };
        usuarios.push(usuario);
        res.send(usuario);
    } else {
        res.status(400).send(error.details[0].message);
    }
});

app.put('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return;
    }

    const { error, value } = validarUsuario(req.body.nombre);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    usuario.nombre = value.nombre;
    res.send(usuario);
});

app.delete('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return;
    }

    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);

    res.send(usuarios);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`escuchando en el puerto ${port}...`)
});

function existeUsuario(id) {
    return (usuarios.find(u => u.id === parseInt(id)));
}

function validarUsuario(nom) {
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });

    return (schema.validate({ nombre: nom }));
}