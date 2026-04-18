const express = require('express');
const mysql2 = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const db = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion MySQL:', err);
        return;
    }
    console.log('Connecte a la base de donnees MySQL !');
});

app.post('/api/repondants', (req, res) => {
    const data = req.body;
    console.log('Donnees recues:', data);
    const sql = 'INSERT INTO repondants SET ?';
    db.query(sql, data, (err, result) => {
        if (err) {
            res.status(500).json({ erreur: err.message });
            return;
        }
        res.json({ message: 'Donnees enregistrees avec succes !' });
    });
});

app.get('/api/statistiques', (req, res) => {
    const sql = 'SELECT COUNT(*) as total, AVG(revenu) as revenu_moyen, AVG(epargne) as epargne_moyenne, AVG(dettes) as dettes_moyennes FROM repondants';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ erreur: err.message });
            return;
        }
        res.json(result[0]);
    });
});

app.get('/api/statistiques/sexe', (req, res) => {
    const sql = 'SELECT sexe, COUNT(*) as total FROM repondants GROUP BY sexe';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ erreur: err.message });
            return;
        }
        res.json(result);
    });
});

app.get('/api/statistiques/depenses', (req, res) => {
    const sql = 'SELECT AVG(alimentation) as alimentation, AVG(loyer) as loyer, AVG(transport) as transport, AVG(sante) as sante, AVG(scolarite) as scolarite, AVG(electricite) as electricite, AVG(eau) as eau, AVG(television) as television, AVG(internet) as internet FROM repondants';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ erreur: err.message });
            return;
        }
        res.json(result[0]);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Serveur demarre sur le port ' + PORT);
});