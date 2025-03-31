import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const Domain = process.env.DOMAIN;
const AWS_URL = process.env.S3_AWS_URL || "";
export const sendVarificationEmail = async (email: string, token: string) => {
  const ConfirmationLink = `${Domain}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "VISACAR <noreply@visacar.vn>",
    to: email,
    subject: "Verify Your Email - VISACAR",
    html: `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - VISACAR</title>
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
            Welcome to VISACAR! To complete your account setup, please verify your email address by clicking the button below.
        </p>
        
        <a href="${ConfirmationLink}" class="verify-button">Verify Email Address</a>
        
        <div class="footer">
            <p>If you didn't create an account with VISACAR, please ignore this email.</p>
            <p>© ${new Date().getFullYear()} VISACAR. All rights reserved.</p>
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
    from: "VISACAR <noreply@visacar.vn>",
    to: email,
    subject: "Reset Your Password",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VISACAR - Reset Your Password</title>
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
            © 2025 VISACAR. All rights reserved.
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
    from: "VISACAR <noreply@visacar.vn>",
    to: email,
    subject: "Account Verification Complete - VISACAR Visa Portal",
    html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>VISACAR - Account Verification Complete</title>
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
                  <a href="https://www.visacar.vn/auth/login" class="login-button">Login to Portal</a>
                  <p class="portal-info">
                      Portal URL:visacar.vn<br>
                      Please use your registered email address to login.
                  </p>
                  <div class="footer">
                      © 2025 VISACAR All rights reserved.
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
// Add this function to your mail.ts file
export const sendPaymentConfirmationEmail = async (
  companyName: string,
  companyEmail: string,
  invoiceNumber: string,
  amount: number,
  currency: string,
  applicationCount: number
) => {
  await resend.emails.send({
    from: "VISACAR <noreply@visacar.vn>",
    to: companyEmail,
    subject: `Payment Confirmed: Invoice ${invoiceNumber} - VISACAR`,
    html: `<!DOCTYPE html>
      <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Confirmation - VISACAR</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f7f6;
            -webkit-font-smoothing: antialiased;
        }
        .email-container {
            max-width: 650px;
            margin: 0 auto;
            background-color: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 16px;
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #2ecc71, #27ae60);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
                linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
                linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%);
            background-size: 50px 50px;
            opacity: 0.2;
            z-index: 1;
        }
        .header-content {
            position: relative;
            z-index: 2;
        }
        .header h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 10px;
            letter-spacing: -0.5px;
        }
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .details {
            background-color: #f9fffe;
            border: 1px solid #e6f3f0;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
        }
        .details-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #e6f3f0;
        }
        .details-row:last-child {
            border-bottom: none;
        }
        .details-label {
            font-weight: 600;
            color: #2c3e50;
            opacity: 0.7;
        }
        .details-value {
            font-weight: 700;
            color: #27ae60;
            text-align: right;
        }
        .message {
            background: linear-gradient(to right, #e8f6f3, #d1f2e1);
            border-left: 5px solid #2ecc71;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
        }
        .message p {
            color: #2c3e50;
        }
        .footer {
            background-color: #f4f7f6;
            text-align: center;
            padding: 25px;
            font-size: 14px;
            color: #7f8c8d;
        }
        .footer a {
            color: #27ae60;
            text-decoration: none;
            font-weight: 600;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        @media screen and (max-width: 600px) {
            .email-container {
                width: 100%;
                border-radius: 0;
            }
            .content, .header {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="header-content">
                <h1>Payment Confirmed</h1>
                <p>Your visa processing journey begins now</p>
            </div>
        </div>
        
        <div class="content">
            <p>Dear ${companyName},</p>
            
            <p>We're thrilled to confirm that your payment for invoice <strong>${invoiceNumber}</strong> has been successfully processed. Your visa applications are now in our system and our team is carefully reviewing them.</p>
            
            <div class="details">
                <div class="details-row">
                    <span class="details-label">Invoice Number : </span>
                    <span class="details-value">${invoiceNumber}</span>
                </div>
                <div class="details-row">
                    <span class="details-label">Total Amount : </span>
                    <span class="details-value">${amount} ${currency}</span>
                </div>
                <div class="details-row">
                    <span class="details-label">Payment Date</span>
                    <span class="details-value">${new Date().toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}</span>
                </div>
                <div class="details-row">
                    <span class="details-label">Number of Applications : </span>
                    <span class="details-value">${applicationCount}</span>
                </div>
            </div>
            
            <div class="message">
                <p><strong>What's Next:</strong> Our dedicated team is processing your visa applications with precision and care. We'll keep you informed with real-time updates throughout your journey.</p>
            </div>
            
            <p>Have questions? Our support team is always ready to assist you. Don't hesitate to reach out with any concerns.</p>
        </div>
        
        <div class="footer">
            <p>Need help? Contact us at <a href="mailto:support@visacar.vn">support@visacar.vn</a></p>
            <p>© ${new Date().getFullYear()} VISACAR. All rights reserved. | <a href="https://visacar.vn/privacy">Privacy Policy</a></p>
        </div>
    </div>
</body>
</html>`,
  });
};

// ...existing code...
export const sendBillReadyEmail = async (
  companyName: string,
  companyEmail: string,
  billId: string,
  billAmount: number,
  currency: string,
  applicationCount: number
) => {
  const billUrl = `${Domain}/travel-agent/bill/${billId}`;

  await resend.emails.send({
    from: "VISACAR <noreply@visacar.vn>",
    to: companyEmail,
    subject: `Your Bill #${billId.substring(0, 8)} is Ready - VISACAR`,
    html: `<!DOCTYPE html>
   <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Bill is Ready - VISACAR</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
      <style>
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }
          body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #2c3e50;
              background-color: #f0f4f2;
              -webkit-font-smoothing: antialiased;
          }
          .email-container {
              max-width: 650px;
              margin: 30px auto;
              background-color: white;
              border-radius: 16px;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
              overflow: hidden;
          }
          .header {
              background: linear-gradient(135deg, #2ecc71, #27ae60);
              color: white;
              padding: 40px 30px;
              text-align: center;
              position: relative;
          }
          .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-image: 
                  linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
                  linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%);
              background-size: 50px 50px;
              opacity: 0.2;
              z-index: 1;
          }
          .header-content {
              position: relative;
              z-index: 2;
          }
          .header h1 {
              font-size: 32px;
              font-weight: 700;
              margin-bottom: 10px;
              letter-spacing: -0.5px;
          }
          .header p {
              font-size: 16px;
              opacity: 0.9;
          }
          .content {
              padding: 40px 30px;
          }
          .bill-details {
              background-color: #f0f7f4;
              border: 1px solid #d4eddf;
              border-radius: 12px;
              padding: 25px;
              margin: 25px 0;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          }
          .bill-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #d4eddf;
          }
          .bill-row:last-child {
              border-bottom: none;
          }
          .bill-label {
              font-weight: 600;
              color: #2c3e50;
              opacity: 0.7;
          }
          .bill-value {
              font-weight: 700;
              color: #27ae60;
              text-align: right;
          }
          .action-button {
              display: block;
              background: linear-gradient(145deg, #2ecc71, #27ae60);
              color: white !important;
              text-align: center;
              padding: 15px 25px;
              text-decoration: none !important;
              border-radius: 10px;
              font-weight: 600;
              margin: 25px 0;
              transition: transform 0.3s ease, box-shadow 0.3s ease;
              box-shadow: 0 10px 20px rgba(46, 204, 113, 0.2);
          }
          .action-button:hover {
              transform: translateY(-3px);
              box-shadow: 0 15px 25px rgba(46, 204, 113, 0.3);
              color: white !important;
          }
          .footer {
              background-color: #f0f4f2;
              text-align: center;
              padding: 25px;
              font-size: 14px;
              color: #7f8c8d;
          }
          .footer a {
              color: #27ae60;
              text-decoration: none;
              font-weight: 600;
          }
          .footer a:hover {
              text-decoration: underline;
          }
          @media screen and (max-width: 600px) {
              .email-container {
                  margin: 0;
                  border-radius: 0;
              }
              .content, .header {
                  padding: 20px;
              }
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <div class="header">
              <div class="header-content">
                  <h1>Your Bill is Ready</h1>
                  <p>Review and process your visa applications bill</p>
              </div>
          </div>
          
          <div class="content">
              <p>Dear ${companyName},</p>
              
              <p>We're pleased to inform you that your bill has been prepared and is ready for your review. This bill includes ${applicationCount} visa application(s) that have been processed according to your requirements.</p>
              
              <div class="bill-details">
                  <div class="bill-row">
                      <span class="bill-label">Bill ID : </span>
                      <span class="bill-value">#${billId.substring(0, 8)}</span>
                  </div>
                  <div class="bill-row">
                      <span class="bill-label">Total Amoun : </span>
                      <span class="bill-value">${billAmount} ${currency}</span>
                  </div>
                  <div class="bill-row">
                      <span class="bill-label">Applications : </span>
                      <span class="bill-value">${applicationCount}</span>
                  </div>
                  <div class="bill-row">
                      <span class="bill-label">Generated On : </span>
                      <span class="bill-value">${new Date().toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}</span>
                  </div>
              </div>
              
              <p>Please review the bill details and proceed with the payment at your earliest convenience to ensure smooth processing of your applications.</p>
              
              <a href="${billUrl}" class="action-button" style="color: white !important; text-decoration: none !important;">View Bill Details</a>
              
              <p>If you have any questions regarding this bill or need assistance with the payment process, please don't hesitate to contact our support team.</p>
              
              <p>Thank you for choosing VISACAR for your visa processing needs.</p>
          </div>
          
          <div class="footer">
              <p>© ${new Date().getFullYear()} VISACAR. All rights reserved.</p>
              <p>Questions? Contact us at <a href="mailto:support@visacar.vn">support@visacar.vn</a></p>
          </div>
      </div>
  </body>
  </html>`,
  });
};

export const sendVisaLetterReadyEmail = async (
  companyName: string,
  companyEmail: string,
  visaLetterId: string,
  applicationCount: number,
  fileName: string
) => {
  const downloadUrl = `${AWS_URL}visaletter/${visaLetterId}/${fileName}`;

  await resend.emails.send({
    from: "VISACAR <noreply@visacar.vn>",
    to: companyEmail,
    subject: `Your Visa Letters Are Ready - VISACAR`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visa Letters Ready - VISACAR</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #2c3e50;
            background-color: #f0f4f2;
            -webkit-font-smoothing: antialiased;
        }
        .email-container {
            max-width: 650px;
            margin: 30px auto;
            background-color: white;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #2ecc71, #27ae60);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
                linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
                linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%);
            background-size: 50px 50px;
            opacity: 0.2;
            z-index: 1;
        }
        .header-content {
            position: relative;
            z-index: 2;
        }
        .header h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 10px;
            letter-spacing: -0.5px;
        }
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .letter-details {
            background-color: #f0f7f4;
            border: 1px solid #d4eddf;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .letter-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #d4eddf;
        }
        .letter-row:last-child {
            border-bottom: none;
        }
        .letter-label {
            font-weight: 600;
            color: #2c3e50;
            opacity: 0.7;
        }
        .letter-value {
            font-weight: 700;
            color: #27ae60;
            text-align: right;
        }
        .highlight-box {
            background-color: #e8f6f3;
            border-left: 5px solid #2ecc71;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
        }
        .highlight-box p {
            color: #2c3e50;
            margin: 0;
        }
        .action-button {
            display: block;
            background: linear-gradient(145deg, #2ecc71, #27ae60);
            color: white !important;
            text-align: center;
            padding: 15px 25px;
            text-decoration: none !important;
            border-radius: 10px;
            font-weight: 600;
            margin: 25px 0;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            box-shadow: 0 10px 20px rgba(46, 204, 113, 0.2);
        }
        .action-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 25px rgba(46, 204, 113, 0.3);
            color: white !important;
        }
        .footer {
            background-color: #f0f4f2;
            text-align: center;
            padding: 25px;
            font-size: 14px;
            color: #7f8c8d;
        }
        .footer a {
            color: #27ae60;
            text-decoration: none;
            font-weight: 600;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        @media screen and (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }
            .content, .header {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="header-content">
                <h1>Visa Letters Ready</h1>
                <p>Your visa documents have been prepared and are ready for download</p>
            </div>
        </div>
        
        <div class="content">
            <p>Dear ${companyName},</p>
            
            <p>We're pleased to inform you that your visa letters have been processed and are now ready for download. These documents contain important visa information for ${applicationCount} application(s).</p>
            
            <div class="letter-details">
                <div class="letter-row">
                    <span class="letter-label">Document : </span>
                    <span class="letter-value"> Official Visa Letter</span>
                </div>
                <div class="letter-row">
                    <span class="letter-label">Applications : </span>
                    <span class="letter-value"> ${applicationCount}</span>
                </div>
                <div class="letter-row">
                    <span class="letter-label">Generated On :</span>
                    <span class="letter-value"> ${new Date().toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}</span>
                </div>
                <div class="letter-row">
                    <span class="letter-label">Status : </span>
                    <span class="letter-value"> Ready for Download</span>
                </div>
            </div>
            
            <div class="highlight-box">
                <p><strong>Important:</strong> These documents are essential for your travelers and must be presented to immigration authorities upon arrival.</p>
            </div>
            
            <p>Please click the button below to access and download your visa letters:</p>
            
            <a href="${downloadUrl}" class="action-button" style="color: white !important; text-decoration: none !important;">Download Visa Letters</a>
            
            <p>If you have any questions or need assistance regarding these documents, please don't hesitate to contact our support team.</p>
            
            <p>Thank you for choosing VISACAR for your visa processing needs.</p>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} VISACAR. All rights reserved.</p>
            <p>Questions? Contact us at <a href="mailto:support@visacar.vn">support@visacar.vn</a></p>
        </div>
    </div>
</body>
</html>`,
  });
};

// Add this function to your mail.ts file
export const sendNewAgentInterestEmail = async (
  name: string,
  email: string,
  mobile: string
) => {
  await resend.emails.send({
    from: "VISACAR <noreply@visacar.vn>",
    // Change this to your admin/sales email
    to: "sales@visacar.vn",
    subject: "New Travel Agent Inquiry - VISACAR Partner Program",
    html: `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Travel Agent Inquiry - VISACAR</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
      <style>
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }
          body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #2c3e50;
              background-color: #f0f4f2;
              -webkit-font-smoothing: antialiased;
          }
          .email-container {
              max-width: 650px;
              margin: 30px auto;
              background-color: white;
              border-radius: 16px;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
              overflow: hidden;
          }
          .header {
              background: linear-gradient(135deg, #2ecc71, #27ae60);
              color: white;
              padding: 40px 30px;
              text-align: center;
              position: relative;
          }
          .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-image: 
                  linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
                  linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%);
              background-size: 50px 50px;
              opacity: 0.2;
              z-index: 1;
          }
          .header-content {
              position: relative;
              z-index: 2;
          }
          .header h1 {
              font-size: 32px;
              font-weight: 700;
              margin-bottom: 10px;
              letter-spacing: -0.5px;
          }
          .header p {
              font-size: 16px;
              opacity: 0.9;
          }
          .content {
              padding: 40px 30px;
          }
          .agent-details {
              background-color: #f0f7f4;
              border: 1px solid #d4eddf;
              border-radius: 12px;
              padding: 25px;
              margin: 25px 0;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          }
          .agent-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #d4eddf;
          }
          .agent-row:last-child {
              border-bottom: none;
          }
          .agent-label {
              font-weight: 600;
              color: #2c3e50;
              opacity: 0.7;
          }
          .agent-value {
              font-weight: 500;
              color: #27ae60;
              text-align: right;
          }
          .highlight-box {
              background-color: #e8f6f3;
              border-left: 5px solid #2ecc71;
              padding: 20px;
              border-radius: 8px;
              margin: 25px 0;
          }
          .highlight-box p {
              color: #2c3e50;
              margin: 0;
          }
          .action-button {
              display: block;
              background: linear-gradient(145deg, #2ecc71, #27ae60);
              color: white !important;
              text-align: center;
              padding: 15px 25px;
              text-decoration: none !important;
              border-radius: 10px;
              font-weight: 600;
              margin: 25px 0;
              transition: transform 0.3s ease, box-shadow 0.3s ease;
              box-shadow: 0 10px 20px rgba(46, 204, 113, 0.2);
          }
          .action-button:hover {
              transform: translateY(-3px);
              box-shadow: 0 15px 25px rgba(46, 204, 113, 0.3);
              color: white !important;
          }
          .urgency-tag {
              display: inline-block;
              background-color: #ff7675;
              color: white;
              font-size: 12px;
              font-weight: 600;
              padding: 5px 10px;
              border-radius: 20px;
              margin-bottom: 15px;
          }
          .footer {
              background-color: #f0f4f2;
              text-align: center;
              padding: 25px;
              font-size: 14px;
              color: #7f8c8d;
          }
          .footer a {
              color: #27ae60;
              text-decoration: none;
              font-weight: 600;
          }
          .footer a:hover {
              text-decoration: underline;
          }
          @media screen and (max-width: 600px) {
              .email-container {
                  margin: 0;
                  border-radius: 0;
              }
              .content, .header {
                  padding: 20px;
              }
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <div class="header">
              <div class="header-content">
                  <h1>New Travel Agent Inquiry</h1>
                  <p>A potential partner is interested in VISACAR services</p>
              </div>
          </div>
          
          <div class="content">
              <div class="urgency-tag">New Lead</div>
              
              <p>A new travel agent has expressed interest in partnering with VISACAR. Please find their contact details below:</p>
              
              <div class="agent-details">
                  <div class="agent-row">
                      <span class="agent-label">Name:</span>
                      <span class="agent-value">${name}</span>
                  </div>
                  <div class="agent-row">
                      <span class="agent-label">Email:</span>
                      <span class="agent-value">${email}</span>
                  </div>
                  <div class="agent-row">
                      <span class="agent-label">Mobile:</span>
                      <span class="agent-value">${mobile}</span>
                  </div>
                  <div class="agent-row">
                      <span class="agent-label">Submission Date:</span>
                      <span class="agent-value">${new Date().toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}</span>
                  </div>
              </div>
              
              <div class="highlight-box">
                  <p><strong>Recommendation:</strong> Contact this travel agent within 24 hours to discuss partnership opportunities and provide information about our services.</p>
              </div>
              
              <p>Click the button below to directly respond to this inquiry:</p>
              
              <a href="mailto:${email}?subject=VISACAR%20Partnership%20Information&body=Dear%20${name}%2C%0A%0AThank%20you%20for%20your%20interest%20in%20partnering%20with%20VISACAR.%20We%20appreciate%20your%20inquiry%20and%20would%20like%20to%20provide%20you%20with%20more%20information%20about%20our%20services.%0A%0A" class="action-button" style="color: white !important; text-decoration: none !important;">Reply to ${name}</a>
              
              <p>Alternatively, you can call them directly at: <strong>${mobile}</strong></p>
          </div>
          
          <div class="footer">
              <p>© ${new Date().getFullYear()} VISACAR. All rights reserved.</p>
              <p>This is an automated message from your website contact system.</p>
          </div>
      </div>
  </body>
  </html>`,
  });
};
