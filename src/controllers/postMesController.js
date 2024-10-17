const getDB = require('../DB/getDB');
const nodemailer = require('nodemailer');
const axios = require('axios');
const { SMTP_HOST, SMTP_PORT, SMTP_PASS, SMTP_MAIL, RECAPTCHA_KEY } =
    process.env;

const validateCaptcha = async (captchaToken) => {
    const response = await axios.post(
        `https://recaptchaenterprise.googleapis.com/v1/projects/portfolio-1727828146213/assessments?key=${RECAPTCHA_KEY}`,
        {
            event: {
                token: captchaToken,
                expectedAction: 'USER_ACTION',
                siteKey: RECAPTCHA_KEY,
            },
        }
    );

    const { success, score, 'error-codes': errorCodes } = response.data;

    return { success, score, errorCodes };
};

const saveToDatabase = async (connection, name, email, message) => {
    await connection.query(
        'INSERT INTO messages (name, email, message, createdAt) VALUES (?, ?, ?, ?)',
        [name, email, message, new Date()]
    );
};

const sendEmail = async (name, email, message) => {
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
};

const saveMessage = async (req, res) => {
    const { name, email, message, captchaToken } = req.body;

    if (!name || !email || !message || !captchaToken) {
        return res.status(400).json({
            error: true,
            status: 400,
            body: 'All fields are required',
        });
    }

    let connection;
    try {
        const { success, score, errorCodes } = await validateCaptcha(
            captchaToken
        );

        if (!success || score < 0.5) {
            return res.status(400).json({
                error: true,
                status: 400,
                body: 'Captcha validation failed or suspicious activity detected',
                errorCodes,
            });
        }

        connection = await getDB();
        await saveToDatabase(connection, name, email, message);
        await sendEmail(name, email, message);

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
