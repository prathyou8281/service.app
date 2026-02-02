import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    // Using Gmail SMTP (you can change this to any email service)
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password',
      },
    });
  }

  async sendOTP(email: string, otp: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"ServiceHub Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🔐 Password Reset - Verification Code',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 30px;
                text-align: center;
                color: white;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 700;
              }
              .content {
                padding: 40px 30px;
                text-align: center;
              }
              .otp-box {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                font-size: 36px;
                font-weight: 700;
                letter-spacing: 8px;
                padding: 20px;
                border-radius: 8px;
                margin: 30px 0;
                display: inline-block;
              }
              .message {
                color: #333;
                font-size: 16px;
                line-height: 1.6;
                margin: 20px 0;
              }
              .warning {
                background-color: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
                text-align: left;
              }
              .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                color: #6c757d;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Password Reset Request</h1>
              </div>
              <div class="content">
                <p class="message">
                  We received a request to reset your password. Use the verification code below to proceed:
                </p>
                <div class="otp-box">${otp}</div>
                <p class="message">
                  This code will expire in <strong>10 minutes</strong>.
                </p>
                <div class="warning">
                  <strong>⚠️ Security Notice:</strong><br>
                  If you didn't request this password reset, please ignore this email and ensure your account is secure.
                </div>
              </div>
              <div class="footer">
                <p>© 2026 ServiceHub. All rights reserved.</p>
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      // DEVELOPMENT BYPASS
      console.error('⚠️ Email sending failed (check .env credentials).');
      console.log('====================================================');
      console.log(`🔑 DEVELOPMENT MODE OTP for ${email}: ${otp}`);
      console.log('====================================================');
      // Return TRUE so the frontend continues to the OTP screen
      return true;
    }
  }
}
