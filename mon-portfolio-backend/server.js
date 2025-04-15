require('dotenv').config(); // ✅ Charger les variables d'environnement

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route de base
app.get('/', (req, res) => {
    res.send('Bienvenue sur le serveur de contact !');
});

// Route pour envoyer un e-mail
app.post('/send', (req, res) => {
    console.log('Données du formulaire:', req.body);

    const { name, email, phone, message } = req.body;

    // ✅ Configuration avec variables d'environnement
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER, // Le mail du destinataire
        subject: `Nouveau message de ${name}`,
        text: `Nom: ${name}\nEmail: ${email}\nTéléphone: ${phone}\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
            return res.status(500).send(error.toString());
        }
        console.log('E-mail envoyé:', info.response);
        res.status(200).send('Message envoyé avec succès !');
    });
});

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
