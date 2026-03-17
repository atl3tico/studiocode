const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'pozo.tecnico@gmail.com',
        pass: 'oqau krec zgov jtem'
    }
});

async function sendEmail(to) {
    try {
        await transporter.sendMail({
            from: '"k1k" <pozo.tecnico@gmail.com>',
            to: to,
            subject: "Solicitud de presupuesto: Puerta de entrada (Alcalá de Henares)",
            text: `Buenos días,

Busco presupuesto para la sustitución de una puerta de entrada a piso en Alcalá de Henares (instalación completa, incluida retirada de la antigua).

Requisitos:
- Puerta blindada estándar (Grado 1-2 suficiente).
- Homologada (normativa de fuego EI30/ruido para comunidad).
- Prioridad: El presupuesto más económico posible.

¿Podrían enviarme una horquilla de precios orientativa por este medio antes de concertar visita técnica?

Muchas gracias.`
        });
        console.log('Email sent to ' + to);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

const targetEmail = process.argv[2];
if (targetEmail) {
    sendEmail(targetEmail);
} else {
    console.log('No email provided');
}
