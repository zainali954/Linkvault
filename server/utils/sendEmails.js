import transporter from "../config/emailConfig.js";
import { emailVerifiedSuccessTemplate, forgotPasswordTemplate, verifyEmailTemplate } from "../templates/emailTemplates.js";

export const sendMail = async ({ to, subject, html }) => {
    try {
        const response = await transporter.sendMail({
            from: `"Authify" <${process.env.EMAIL_SENDER}>`,
            to,
            subject,
            html,
        });
    } catch (error) {
        console.error("Error sending email", error);
    }
};

export const sendVerificationEmail = async (email, url) => {
    const html = verifyEmailTemplate.replaceAll('{{MAGIC_LINK}}', url);
    await sendMail({ to: email, subject: 'Verify your email', html });
};

export const sendVerifiedSuccessEmail = async (email, url) => {
    const html = emailVerifiedSuccessTemplate.replace('{{APP_HOME_URL}}', url)
    await sendMail({ to: email, subject: 'Email verified successfully', html })
}

export const sendForgotPasswordEmail = async (email, url) => {
    const html = forgotPasswordTemplate.replace('{{RESET_LINK}}', url)
    await sendMail({ to: email, subject: 'Password reset request', html })
}