import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error("CRITICAL ERROR: SMTP_USER or SMTP_PASS is missing in the environment variables!");
        throw new Error("SMTP credentials missing from environment setup.");
    }
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(mailOptions);
};
