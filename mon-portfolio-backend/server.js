const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Pour analyser les requêtes JSON
app.use(bodyParser.urlencoded({ extended: true })); // Pour analyser les requêtes URL-encoded

// Route de base
app.get('/', (req, res) => {
    res.send('Bienvenue sur le serveur de contact !');
});

// Route pour envoyer un e-mail
app.post('/send', (req, res) => {
    // Vérifiez si req.body est défini
    console.log('Données du formulaire:', req.body); // Ajoutez cette ligne pour déboguer

    const { name, email, phone, message } = req.body;

    // Configuration du transporteur Nodemailer
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true pour 465, false pour les autres ports
        auth: {
            user: 'nathan.fauchere23@gmail.com',
            pass: 'qjxt mznh sdng yipa' // mot de passe d'application
        },
        tls: {
            rejectUnauthorized: false // Ignorer les certificats auto-signés
        }
    });

    const mailOptions = {
        from: email,
        to: 'nathan.fauchere23@gmail.com', // Remplacez par votre adresse e-mail
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

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
