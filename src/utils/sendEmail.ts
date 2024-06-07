// utils/sendEmail.ts
import formData from 'form-data';
import Mailgun from 'mailgun.js';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  try {
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY || '',
    });

    // Configure the email options
    const mailOptions: EmailOptions = {
      to,
      subject,
      text,
      html,
    };

    // Send the email
    const response = await mg.messages.create(process.env.MAILGUN_DOMAIN || '', {
      from: process.env.MAILGUN_FROM_EMAIL || '',
      to: mailOptions.to,
      subject: mailOptions.subject,
      text: mailOptions.text,
      html: mailOptions.html,
    });

    console.log('Email sent:', response.id);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default sendEmail;