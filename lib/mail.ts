import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const Domain = process.env.DOMAIN;
export const sendVarificationEmail = async (email: string, token: string) => {
  const ConfirmationLink = `${Domain}/auth/new-verification?token=${token}`;
  console.log(ConfirmationLink);
  console.log(ConfirmationLink);

  await resend.emails.send({
    from: "Victoria Tours <noreply@bukxe.net>",
    to: email,
    subject: "Verify Your Email - Victoria Visa",
    html: `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - Victoria Visa</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        .logo img {
            max-width: 150px;
        }
        h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 20px;
        }
        .verification-text {
            text-align: center;
            margin-bottom: 30px;
            color: #7f8c8d;
        }
        .verify-button {
            display: block;
            width: 200px;
            margin: 0 auto;
            background-color: #3498db;
            color: white;
            text-align: center;
            padding: 12px 20px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #95a5a6;
        }
        @media screen and (max-width: 600px) {
            body {
                padding: 10px;
            }
            .container {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Verify Your Email</h1>
        
        <p class="verification-text">
            Welcome to Victoria Visa! To complete your account setup, please verify your email address by clicking the button below.
        </p>
        
        <a href="${ConfirmationLink}" class="verify-button">Verify Email Address</a>
        
        <div class="footer">
            <p>If you didn't create an account with Victoria Visa, please ignore this email.</p>
            <p>© ${new Date().getFullYear()} Victoria Visa. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
           
        `,
  });
};

export const PasswordResetEmail = async (email: string, token: string) => {
  const ConfirmationLink = `${Domain}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "Victoria Tours <noreply@victoriatour.com>",
    to: email,
    subject: "Reset Your Password",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Victoria Visa - Reset Your Password</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            background-color: #f4f7f6;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            color: #333;
        }
        .email-container {
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 40px;
            max-width: 500px;
            width: 100%;
            text-align: center;
        }
        .logo {
            margin-bottom: 30px;
        }
        .logo img {
            max-width: 150px;
        }
        h1 {
            color: #2c3e50;
            margin-bottom: 20px;
            font-weight: 600;
        }
        p {
            color: #555;
            margin-bottom: 30px;
        }
        .verify-button {
            display: inline-block;
            background-color: #3498db;
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            transition: background-color 0.3s ease;
        }
        .verify-button:hover {
            background-color: #2980b9;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="logo">
        </div>
        <h1>Reset Your Password</h1>
        <p>Click the button below to verify your email and reset your password. If you did not request a password reset, please ignore this email.</p>
        <a href="${ConfirmationLink}" class="verify-button">Verify Email</a>
        <div class="footer">
            © 2024 Victoria Visa. All rights reserved.
            <br>
            If you're having trouble, copy and paste this link: ${ConfirmationLink}
        </div>
    </div>
</body>
</html>`,
  });
};

export const sendTravelAgentApprovalEmail = async (
  name: string,
  email: string
) => {
  await resend.emails.send({
    from: "Victoria Tours <noreply@victoriatour.com>",
    to: email,
    subject: "Account Verification Complete - Victoria Tours Visa Portal",
    html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Victoria Tours - Account Verification Complete</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
          <style>
              body {
                  font-family: 'Inter', sans-serif;
                  line-height: 1.6;
                  background-color: #f4f7f6;
                  margin: 0;
                  padding: 20px;
                  color: #333;
              }
              .wrapper {
                  width: 100%;
                  display: table;
                  height: 100%;
                  margin: 0 auto;
              }
              .email-container {
                  background-color: white;
                  border-radius: 12px;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                  padding: 40px;
                  max-width: 500px;
                  width: 100%;
                  text-align: center;
                  margin: 0 auto;
                  box-sizing: border-box;
              }
              .logo {
                  margin-bottom: 30px;
                  text-align: center;
              }
              .logo img {
                  max-width: 150px;
                  margin: 0 auto;
              }
              h1 {
                  color: #2c3e50;
                  margin-bottom: 20px;
                  font-weight: 600;
                  text-align: center;
              }
              p {
                  color: #555;
                  margin-bottom: 30px;
                  text-align: center;
              }
              .login-button {
                  display: inline-block;
                  background-color: #27ae60;
                  color: white;
                  text-decoration: none;
                  padding: 12px 24px;
                  border-radius: 8px;
                  font-weight: 600;
                  transition: background-color 0.3s ease;
                  margin: 0 auto;
              }
              .login-button:hover {
                  background-color: #219a52;
              }
              .footer {
                  margin-top: 30px;
                  font-size: 12px;
                  color: #888;
                  text-align: center;
              }
              .details-box {
                  background-color: #f8f9fa;
                  border-radius: 8px;
                  padding: 20px;
                  margin: 20px auto;
                  text-align: center;
              }
              .details-box p {
                  margin: 10px 0;
              }
              .portal-info {
                  margin-top: 20px;
                  font-size: 14px;
                  text-align: center;
              }
          </style>
      </head>
      <body>
          <div class="wrapper">
              <div class="email-container">
                  <div class="logo">
                      <!-- Add your logo here -->
                  </div>
                  <h1>Account Verification Complete</h1>
                  <p>Dear ${name},</p>
                  <div class="details-box">
                      <p>We are pleased to inform you that your account details have been successfully verified. You can now access our visa processing system.</p>
                      <p>To get started, please visit our portal using your registered credentials:</p>
                      <p style="margin-bottom: 10px;">Your login email: <strong>${email}</strong></p>
                  </div>
                  <a href="https://visa.victoriatour.com/auth/login" class="login-button">Login to Portal</a>
                  <p class="portal-info">
                      Portal URL:visa.victoriatour.com<br>
                      Please use your registered email address to login.
                  </p>
                  <div class="footer">
                      © 2024 Victoria Tours. All rights reserved.
                      <br>
                      This is an automated message, please do not reply to this email.
                      <br>
                      If you need assistance, please contact our support team.
                  </div>
              </div>
          </div>
      </body>
      </html>`
      .replace("${name}", name)
      .replace("${email}", email),
  });
};
