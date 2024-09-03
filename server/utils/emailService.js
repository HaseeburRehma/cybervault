import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

export const sendInvitationEmail = (email, adminName) => {
  const registrationLink = `http://localhost:3000/`; // Replace with your actual registration URL

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Invitation to Join Team',
    html: `<p>Hello,</p>
           <p>${adminName} has invited you to join their team on our platform.</p>
           <p>Please <a href="${registrationLink}">register here</a> to accept the invitation.</p>
           <p>Thank you!</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Invitation email sent:', info.response);
    }
  });
};
