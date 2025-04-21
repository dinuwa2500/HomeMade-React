import { Resend } from 'resend';

const verificationEmail = (username, otp) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
    
    body {
      margin: 0;
      padding: 0;
      font-family: 'Poppins', Arial, sans-serif;
      background-color: #f8fafc;
      color: #334155;
      line-height: 1.6;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .card {
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
      margin: 40px 0;
    }
    
    .header {
      background: linear-gradient(135deg, #3b82f6, #6366f1);
      padding: 30px;
      text-align: center;
      color: white;
    }
    
    .content {
      padding: 32px;
    }
    
    .logo {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 16px;
    }
    
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #3b82f6, #6366f1);
      color: white;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 8px;
      font-weight: 600;
      margin: 24px 0;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
    }
    
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.3);
    }
    
    .otp-code {
      font-size: 32px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #3b82f6;
      margin: 20px 0;
      text-align: center;
    }
    
    .footer {
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
    }
    
    .highlight {
      font-weight: 600;
      color: #1e293b;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo">Craftopia</div>
        <h1>Verify Your Email Address</h1>
      </div>
      
      <div class="content">
        <p>Hello <span class="highlight">${username}</span>,</p>
        <p>Thank you for signing up! To complete your registration, please verify your email address by clicking the button below:</p>
        
        <div style="text-align: center;">
          <a href="${otp}" class="button">Verify Email Address</a>
        </div>
        
        <p>Or copy and paste this verification code in our application:</p>
        <div class="otp-code">${otp}</div>
        
        <p>This verification link will expire in 24 hours. If you didn't create an account with us, please ignore this email.</p>
      </div>
      
      <div class="footer">
        <p>© ${new Date().getFullYear()} Craftopia. All rights reserved.</p>
        <p>1234 App Street, Tech City, TC 10001</p>
      </div>
    </div>
  </div>
</body>
</html>`;
};

export default verificationEmail;
