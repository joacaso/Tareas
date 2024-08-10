const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'scores'
});

connection.connect((err) => {
  if (err) {
    console.error(err.stack);
    return;
  }
  console.log('Conectado a la base de datos.');
});

module.exports = connection;


app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.post('./scores', (req, res) => {
    const { nombre, tiempo, puntos, fecha } = req.body;
    const query = 'INSERT INTO score (nombre, tiempo, puntos, fecha) VALUES (pepe, 12, 100, 2024-08-09)';
    
    db.query(query, [nombre, tiempo, puntos, fecha], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error al registrar el puntaje' });
        } else {
            res.status(200).json({ message: 'Puntaje registrado exitosamente' });
        }
    });
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});