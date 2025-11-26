import nodemailer from 'nodemailer';
import env from '../config/env';
import logger from '../config/logger';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string
): Promise<void> => {
  const resetUrl = `${env.PASSWORD_RESET_URL}?token=${resetToken}`;

  const mailOptions = {
    from: `"${env.EMAIL_FROM_NAME}" <${env.EMAIL_FROM}>`,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <p><a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
        <p>Or copy and paste this URL into your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
    text: `
      Password Reset Request
      
      You requested to reset your password. Visit the following URL to reset it:
      ${resetUrl}
      
      This link will expire in 1 hour.
      
      If you didn't request this, please ignore this email.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info({ email }, 'Password reset email sent');
  } catch (error) {
    logger.error({ error, email }, 'Failed to send password reset email');
    throw error;
  }
};

export const sendRentalReminderEmail = async (
  email: string,
  customerName: string,
  vehicleTitle: string,
  endDate: Date
): Promise<void> => {
  const mailOptions = {
    from: `"${env.EMAIL_FROM_NAME}" <${env.EMAIL_FROM}>`,
    to: email,
    subject: 'Rental Renewal Reminder',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Rental Renewal Reminder</h2>
        <p>Hello ${customerName},</p>
        <p>Your rental for <strong>${vehicleTitle}</strong> is expiring on ${endDate.toLocaleDateString()}.</p>
        <p>Please renew your rental if you wish to continue using the vehicle.</p>
        <p>Thank you for your business!</p>
      </div>
    `,
    text: `
      Rental Renewal Reminder
      
      Hello ${customerName},
      
      Your rental for ${vehicleTitle} is expiring on ${endDate.toLocaleDateString()}.
      
      Please renew your rental if you wish to continue using the vehicle.
      
      Thank you for your business!
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info({ email }, 'Rental reminder email sent');
  } catch (error) {
    logger.error({ error, email }, 'Failed to send rental reminder email');
    throw error;
  }
};


