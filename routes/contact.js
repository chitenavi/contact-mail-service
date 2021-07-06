const express = require('express');
const contactRouter = express.Router();
const transporter = require('../utils/nodemailerConfig');
const {
  contactFormValidationRules,
  validate,
} = require('../middlewares/validators');

contactRouter.post(
  '/',
  contactFormValidationRules(),
  validate,
  (req, res, next) => {
    // Create template for email notification
    const output = `
  <h2>You have a new contact request from ${req.body.source}</h2>
  <img class="email" src="cid:email" alt="email-image">
  <h3>Contact details</h3>
  <ul>
  <li>Name: ${req.body.name}</li>
  <li>Email: ${req.body.email}</li>
  <li>Message: ${req.body.message}</li>
  </ul>`;

    // Compose email
    const mail = {
      from: process.env.GMAIL_USER,
      to: process.env.MAIL_NOTIFICATIONS,
      subject: `New message from ${req.body.source}-contact-form`,
      html: output,
      attachments: [
        {
          filename: 'email.jpg',
          path: __dirname + '/../public/images/email.jpg',
          cid: 'email', //same cid value as in the html img src
        },
      ],
    };

    // res.status(200).json({ status: 'success' });
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(err);
        res.json({
          status: 'fail',
        });
      } else {
        console.log('Email sent!');
        res.status(200).json({
          status: 'success',
        });
      }
    });
  },
);

module.exports = contactRouter;
