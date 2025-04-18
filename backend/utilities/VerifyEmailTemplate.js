const { Resend } = require('resend');

const verificationEmail = (username, otp) => {
  return `<!DOCTYPE html>
<html lang="en" style="margin:0; padding:0; font-family: Arial, sans-serif;">
  <head>
    <meta charset="UTF-8" />
    <title>Verify Your Email</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f4f4f4" style="padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 40px;">
            <tr>
              <td align="center" style="padding-bottom: 20px;">
                <h1 style="color: #333333;">Welcome to Our Platform!</h1>
              </td>
            </tr>
            <tr>
              <td style="color: #555555; font-size: 16px; padding-bottom: 30px;">
                <p>Hi <strong>{{name}}</strong>,</p>
                <p>Thank you for registering. Please click the button below to verify your email address.</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom: 30px;">
                <a href="{{verificationLink}}" style="background-color: #4CAF50; color: white; padding: 14px 28px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
                  Verify Email
                </a>
              </td>
            </tr>
            <tr>
              <td style="color: #888888; font-size: 14px;">
                <p>If you didn’t request this, you can safely ignore this email.</p>
                <p>Thanks,<br/>The Team</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};

export default verificationEmail;
