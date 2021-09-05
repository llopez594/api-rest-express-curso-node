const debug = require('debug')('app:inicio');
// const dbDebug = require('debug')('app:db');

const express = require('express');
const usuarios = require('./routes/usuarios');
const config = require('config');
// const logger = require('./logger')
const morgan = require('morgan');
const Joi = require('joi');
const app = express();

app.use(express.json()); //body
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use('/api/usuarios', usuarios);

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


app.get('/', (req, res) => {
    res.send('Hola mundo desde express.');
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`escuchando en el puerto ${port}...`)
});
