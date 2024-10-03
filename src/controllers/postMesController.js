const getDB = require('../DB/getDB');
const responses = require('../network/responses');
const nodemailer = require('nodemailer');
const { SMTP_HOST, SMTP_PORT, SMTP_PASS, SMTP_MAIL } = process.env;

const saveMessage = async (req, res) => {
    const { name, email, message } = req.body;

    let connection;

    if (!name || !email || !message) {
        return responses.error(req, res, 'All fields are required', 400);
    }

    try {
        connection = await getDB();
        await connection.query(
            'INSERT INTO messages (name, email, message, createdAt) VALUES (?, ?, ?, ?)',
            [name, email, message, new Date()]
        );

        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: false,
            auth: {
                user: SMTP_MAIL,
                pass: SMTP_PASS,
            },
        });

        const mailOptions = {
            from: SMTP_MAIL,
            to: SMTP_MAIL,
            subject: `New message from ${email}`,
            text: `${name}: ${message}`,
        };

        await transporter.sendMail(mailOptions);

        return responses.success(
            req,
            res,
            'Message saved and email sent successfully!',
            200
        );
    } catch (error) {
        console.error('Error saving message or sending email:', error);
        return responses.error(
            req,
            res,
            'Error saving message or sending email.',
            500
        );
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    saveMessage,
};
