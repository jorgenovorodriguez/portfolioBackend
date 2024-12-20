const getDB = require('../DB/getDB');
const nodemailer = require('nodemailer');
const axios = require('axios');
const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_PASS,
    SMTP_MAIL,
    RECAPTCHA_KEY,
    GCLOUD_API_KEY,
} = process.env;

const saveMessage = async (req, res) => {
    const { name, email, message, captchaToken } = req.body;

    let connection;

    if (!name || !email || !message || !captchaToken) {
        return res.status(400).json({
            error: true,
            status: 400,
            body: 'All fields are required',
        });
    }

    try {
        console.log('entro');

        const recaptchaResponse = await axios
            .post(
                `https://recaptchaenterprise.googleapis.com/v1/projects/portfolio-1727828146213/assessments?key=${GCLOUD_API_KEY}`,
                {
                    event: {
                        token: captchaToken,
                        siteKey: RECAPTCHA_KEY,
                    },
                }
            )
            .catch((err) => {
                console.error(
                    'Error in reCAPTCHA validation FALLO:',
                    err.response.data
                );
                throw err;
            });

        const { score, 'error-codes': errorCodes } = recaptchaResponse.data;

        if (score < 0.5) {
            return res.status(400).json({
                error: true,
                status: 400,
                body: 'Captcha validation failed or suspicious activity detected',
                errorCodes,
            });
        }

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

        return res.status(200).json({
            error: false,
            status: 200,
            body: 'Message saved and email sent successfully!',
        });
    } catch (error) {
        console.error('Error saving message or sending email:', error);
        return res.status(500).json({
            error: true,
            status: 500,
            body: 'Error saving message or sending email.',
        });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    saveMessage,
};
