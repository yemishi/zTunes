import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },

  auth: {
    user: process.env.TRANSPORTER_EMAIL,
    pass: process.env.TRANSPORTER_PASS,
  },
});

const mailOptions = (email: string, html: string) => {
  return {
    from: process.env.TRANSPORTER_EMAIL,
    to: email,
    subject: "Confirm Register",
    html: html,
  };
};

const url = (id: string, endPoint: string, duration?: string) => {
  const generateToken = jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: duration || "1h",
  });
  const confirmationLink = `${process.env.URL}/${endPoint}?token=${generateToken}`;
  return confirmationLink;
};

const resetPassHtml = (username: string, url: string) => `<html>
<body style="background-color: #f1f1f1; font-family: Arial, sans-serif; margin: 0; padding: 0; height: 100%; display: flex; justify-content: center; align-items: center;">
  <div style="max-width: 400px;;text-align: center; background-color: #242323; color: #ebebeb; padding: 30px; border-radius: 5px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);">
    <h1 style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;font-size: 37px; margin: 0;">Reset your password?</h1>
    <h2>Hello ${username}, do you want to reset your password?</h2>
    <p style="line-height: 1.3;font-size: 16px;color: #a4c5d0;">Someone (hopefully you) requested to reset your zTune account password. Click the button below to do so. If you did not request this password reset, simply ignore this email and continue.</p>
    <a href="${url}" style="text-decoration: none;">
      <button style="margin-top: 60px;background-color: #ba8200; color: white; border: none; padding: 15px 30px; border-radius: 5px; font-size: 16px; cursor: pointer;">Reset my password</button>
    </a>
  </div>
</body>
</html>`;

const resetPassEmail = (email: string, username: string, userId: string) => {
  transport.sendMail(
    mailOptions(
      email,
      resetPassHtml(username, url(userId, "password-reset", "30m"))
    ),
    (error) => {
      if (error) {
        return console.error(error, "failed at send email");
      } else return console.log("email sent");
    }
  );
};

export { resetPassEmail };
