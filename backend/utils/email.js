const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `DiplomskiApp <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendVerificationEmail() {
    await this.send(
      'emailVerification',
      'DiplomskiApp - Please verify your email (valid for 24h)',
    );
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'DiplomskiApp - Reset your password (valid for 10min)',
    );
  }

  async sendLoginWithNewDevice() {
    await this.send(
      'newDeviceLogin',
      'DiplomskiApp - Access from new device detected on your account',
    );
  }

  async sendPasswordChanged() {
    await this.send(
      'passwordChange',
      'DiplomskiApp - Your password was successflully changed',
    );
  }

  async sendOTP() {
    await this.send(
      'otpVerification',
      'DiplomskiApp - 2FA verification code (valid for 1min)',
    );
  }
};
