import nodemailer from "nodemailer";

const config = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "kazihasin12@gmail.com",
    pass: "uomjpmbzvquhljvz",
  },
};

let transporter = nodemailer.createTransport(config);

const sendResetLink = async (user) => {
  const resetCode = user.updateResetToken();
  await user.save();

  const mailOptions = {
    from: "mernauth@gmail.com",
    to: user.email,
    subject: "Password Reset Link",
    html: `
        <html>
        <head>
          <style>
            /* Add your CSS styles here */
            body {
              font-family: Arial, sans-serif;
            }
            .container {
              background-color: #f0f0f0;
              padding: 20px;
            }
            .container p{
              font-size: 18px;
            }
            .reset-link {
              background-color: #007bff;
              color: #fff;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <p>Hello! ${user.username}</p>
            <p>You have requested to reset your password.</p>
            <p>Click the button below to reset your password:</p>
            <a class="reset-link" href='${process.env.FRONT_END_URL}/reset-password/${resetCode}'>Reset Password</a>
          </div>
        </body>
        </html>
      `,
  };

  try {
    await transporter.sendMail(mailOptions);

    return { success: true, message: "Reset link sent successfully" };
  } catch (error) {
    return { success: false, message: "failed link sent" };
  }
};

export default sendResetLink;
