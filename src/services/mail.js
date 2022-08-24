/* eslint-disable consistent-return */
/* eslint-disable no-console */
const nodemailer = require('nodemailer');
require('dotenv').config();

const sendProductRequestEmail = async (
  fromUsername,
  fromEmail,
  fromId,
  toUsername,
  toEmail,
  productTitle,
  productId,
  fromPhoneNumber
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL,
      pass: process.env.GMAIL_PASSWORD,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    },
  });

  let output;
  if (fromPhoneNumber) {
    output = `
      <p>Hello ${toUsername},<br>
      <a href="https://lets-share-capstone.herokuapp.com/api/user/${fromId}">${fromUsername}</a> has requested your <a href="https://lets-share-capstone.herokuapp.com/api/product/${productId}">${productTitle}</a>.<br>
      You can contact ${fromUsername} on ${fromEmail} or ${fromPhoneNumber}.</p>
      <p>You can <a href="https://lets-share-capstone.herokuapp.com/api/product/${productId}/requesters">click here</a> to see all requesters.
      Make sure you're logged in to access the page.</p>
      <p>Kind regards,<br>
      Let's Share team</p>
      <br></br>
      <p style="color:#a0a0a0; font-size:10px; text-align:center;">Let's Share, 2022. All rights reserved.</p>
    `;
  } else {
    output = `
      <p>Hello ${toUsername},<br>
      <a href="https://lets-share-capstone.herokuapp.com/api/user/${fromId}">${fromUsername}</a> has requested your <a href="https://lets-share-capstone.herokuapp.com/api/product/${productId}">${productTitle}</a>.<br>
      You can contact ${fromUsername} on ${fromEmail}.</p>
      <p>You can <a href="https://lets-share-capstone.herokuapp.com/api/product/${productId}/requesters">click here</a> to see all requesters.
      Make sure you're logged in to access the page.</p>
      <p>Kind regards,<br>
      Let's Share team</p>
      <br></br>
      <p style="color:#a0a0a0; font-size:10px; text-align:center;">Let's Share, 2022. All rights reserved.</p>
    `;
  }

  const mailOptions = {
    from: `"Let's Share" <${process.env.GMAIL}>`,
    to: `"${toUsername}" <${toEmail}>`,
    subject: 'Someone has requested your item',
    text: 'Someone has requested your item.',
    html: output,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });
};

module.exports = { sendProductRequestEmail };
