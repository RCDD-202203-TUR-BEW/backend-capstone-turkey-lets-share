/* eslint-disable consistent-return */
/* eslint-disable no-console */
const nodemailer = require('nodemailer');
require('dotenv').config();

const sendWelcomeEmail = async (firstName, lastName, username, email) => {
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

  const output = `
    <p>Hello ${firstName},<br>
    You have been successfully registered. Welcome to Let's Share!</p>
    <p>Your username is ${username}. You can change it anytime from 
    <a href="https://lets-share-capstone.herokuapp.com/api/user/profile/update">your profile</a>.
    Make sure you're logged in to access the page.</p>
    <p>You can <a href="https://lets-share-capstone.herokuapp.com/api/auth/login">click here</a> to login.</p>
    <p>Kind regards,<br>
    Let's Share team</p>
    <br></br>
    <p style="color:#a0a0a0; font-size:10px; text-align:center;">Let's Share, 2022. All rights reserved.</p>
  `;

  const mailOptions = {
    from: `"Let's Share" <${process.env.GMAIL}>`,
    to: `"${firstName} ${lastName}" <${email}>`,
    subject: "Welcome to Let's Share!",
    text: "Welcome to Let's Share!",
    html: output,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });
};

const sendProductRequestEmail = async (
  ownerUsername,
  ownerEmail,
  productTitle,
  productId,
  requesterUsername,
  requesterEmail,
  requesterId,
  requesterPhoneNumber
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
  if (requesterPhoneNumber) {
    output = `
      <p>Hello ${ownerUsername},<br>
      <a href="https://lets-share-capstone.herokuapp.com/api/user/${requesterId}">${requesterUsername}</a> has requested your <a href="https://lets-share-capstone.herokuapp.com/api/product/${productId}">${productTitle}</a>.<br>
      You can contact ${requesterUsername} on ${requesterEmail} or ${requesterPhoneNumber}.</p>
      <p>You can <a href="https://lets-share-capstone.herokuapp.com/api/product/${productId}/requesters">click here</a> to see all requesters.
      Make sure you're logged in to access the page.</p>
      <p>Kind regards,<br>
      Let's Share team</p>
      <br></br>
      <p style="color:#a0a0a0; font-size:10px; text-align:center;">Let's Share, 2022. All rights reserved.</p>
    `;
  } else {
    output = `
      <p>Hello ${ownerUsername},<br>
      <a href="https://lets-share-capstone.herokuapp.com/api/user/${requesterId}">${requesterUsername}</a> has requested your <a href="https://lets-share-capstone.herokuapp.com/api/product/${productId}">${productTitle}</a>.<br>
      You can contact ${requesterUsername} on ${requesterEmail}.</p>
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
    to: `"${ownerUsername}" <${ownerEmail}>`,
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

const sendProductApprovalEmail = async (
  requesterUsername,
  requesterEmail,
  productTitle,
  productId,
  ownerUsername,
  ownerEmail,
  ownerId,
  ownerPhoneNumber
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
  if (ownerPhoneNumber) {
    output = `
      <p>Hello ${requesterUsername},<br>
      <a href="https://lets-share-capstone.herokuapp.com/api/user/${ownerId}">${ownerUsername}</a> has accepted your request for <a href="https://lets-share-capstone.herokuapp.com/api/product/${productId}">${productTitle}</a>.<br>
      You can contact ${ownerUsername} on ${ownerEmail} or ${ownerPhoneNumber}.</p>
      <p>Kind regards,<br>
      Let's Share team</p>
      <br></br>
      <p style="color:#a0a0a0; font-size:10px; text-align:center;">Let's Share, 2022. All rights reserved.</p>
    `;
  } else {
    output = `
      <p>Hello ${requesterUsername},<br>
      <a href="https://lets-share-capstone.herokuapp.com/api/user/${ownerId}">${ownerUsername}</a> has accepted your request for <a href="https://lets-share-capstone.herokuapp.com/api/product/${productId}">${productTitle}</a>.<br>
      You can contact ${ownerUsername} on ${ownerEmail}.</p>
      <p>Kind regards,<br>
      Let's Share team</p>
      <br></br>
      <p style="color:#a0a0a0; font-size:10px; text-align:center;">Let's Share, 2022. All rights reserved.</p>
    `;
  }

  const mailOptions = {
    from: `"Let's Share" <${process.env.GMAIL}>`,
    to: `"${requesterUsername}" <${requesterEmail}>`,
    subject: 'Your request has been accepted',
    text: 'Your request has been accepted.',
    html: output,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });
};

module.exports = {
  sendWelcomeEmail,
  sendProductRequestEmail,
  sendProductApprovalEmail,
};
