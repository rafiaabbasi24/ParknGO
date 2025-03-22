import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transport = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "api",
    pass: process.env.MAILTRAP_TOKEN,
  },
});

export const sendMagicLink = async (email, token) => {
  const magicLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const currentYear = new Date().getFullYear();

  const mailOptions = {
    from: `"EazyParking" <${process.env.MAIL_FROM}>`,
    to: email,
    subject: "🔐 Reset Your EazyParking Password",
    html: `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - EazyParking</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #e5e7eb;
            background-color: #0f0f0f;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #111111;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            border: 1px solid #1f2937;
        }
        
        .header {
            background: black;
            padding: 50px 30px;
            text-align: center;
            color: #ffffff;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%);
            z-index: 1;
        }
        
        .header-content {
            position: relative;
            z-index: 2;
        }
        
        .logo {
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 12px;
        letter-spacing: -1px;
        color: #1f2937; /* default text color if gradient is not used */
      }

      .eazy {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent; /* fallback */
      }

        
        .header-subtitle {
            font-size: 16px;
            opacity: 0.8;
            font-weight: 400;
            color: #cbd5e1;
        }
        
        .content {
            padding: 50px 40px;
            background-color: #111111;
        }
        
        .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 24px;
            letter-spacing: -0.5px;
        }
        
        .message {
            font-size: 16px;
            color: #9ca3af;
            margin-bottom: 32px;
            line-height: 1.7;
        }
        
        .cta-container {
            text-align: center;
            margin: 50px 0;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 18px 36px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            letter-spacing: 0.5px;
        }
        
        
        .security-notice {
            background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
            border: 1px solid #374151;
            border-radius: 12px;
            padding: 24px;
            margin: 40px 0;
            position: relative;
        }
        
        .security-notice::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, #f59e0b 0%, #f97316 100%);
            border-radius: 12px 12px 0 0;
        }
        
        .security-notice-title {
            font-weight: 600;
            color: #fbbf24;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            font-size: 16px;
        }
        
        .security-notice-text {
            font-size: 14px;
            color: #d1d5db;
            line-height: 1.6;
        }
        
        .alternative-link {
            background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
            border-radius: 12px;
            padding: 24px;
            margin: 40px 0;
            border: 1px solid #374151;
        }
        
        .alternative-link-title {
            font-weight: 600;
            color: #e5e7eb;
            margin-bottom: 16px;
            font-size: 14px;
        }
        
        .alternative-link-url {
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
            font-size: 12px;
            color: #6b7280;
            word-break: break-all;
            background-color: #0f0f0f;
            padding: 16px;
            border-radius: 8px;
            border: 1px solid #374151;
            line-height: 1.5;
        }
        
        .footer {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            padding: 40px 30px;
            text-align: center;
            border-top: 1px solid #374151;
        }
        
        .footer-text {
            font-size: 14px;
            color: #9ca3af;
            margin-bottom: 20px;
        }
        
        .footer-links {
            margin-bottom: 24px;
        }
        
        .footer-link {
            color: #60a5fa;
            text-decoration: none;
            margin: 0 20px;
            font-size: 14px;
            font-weight: 500;
            transition: color 0.3s ease;
        }
        
        .footer-link:hover {
            color: #93c5fd;
            text-decoration: underline;
        }
        
        .copyright {
            font-size: 12px;
            color: #6b7280;
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid #374151;
            line-height: 1.5;
        }
        
        .warning-icon {
            display: inline-block;
            margin-right: 10px;
            font-size: 18px;
        }
        
        .brand-accent {
            color: #3b82f6;
            font-weight: 600;
        }
        
        @media only screen and (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
                border-left: none;
                border-right: none;
            }
            
            .header, .content, .footer {
                padding: 40px 24px;
            }
            
            .content {
                padding: 40px 24px;
            }
            
            .cta-button {
                padding: 16px 32px;
                font-size: 15px;
            }
            
            .alternative-link-url {
                font-size: 11px;
                padding: 14px;
            }
            
            .footer-link {
                margin: 0 12px;
                display: inline-block;
                margin-bottom: 8px;
            }
            
            .greeting {
                font-size: 22px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="header-content">
              <div class="logo">
               <span class="eazy">Eazy</span><span style="color: #ffffff;">Parking</span>
              </div>
                <div class="header-subtitle">Secure Password Reset</div>
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <div class="greeting">Password Reset Request</div>
            
            <div class="message">
                We received a request to reset your password for your <span class="brand-accent">EazyParking</span> account. 
                If you made this request, click the button below to create a new password.
            </div>
            
            <!-- CTA Button -->
            <div class="cta-container">
                <a href="${magicLink}" class="cta-button">
                    Reset My Password
                </a>
            </div>
            
            <!-- Security Notice -->
            <div class="security-notice">
                <div class="security-notice-title">
                    <span class="warning-icon">⚠</span>
                    Security Notice
                </div>
                <div class="security-notice-text">
                    This password reset link will expire in <strong>10 minutes</strong> for your security. 
                    If you didn't request this reset, please ignore this email or contact our support team immediately.
                </div>
            </div>
            
            <!-- Alternative Link -->
            <div class="alternative-link">
                <div class="alternative-link-title">
                    Button not working? Copy and paste this link:
                </div>
                <div class="alternative-link-url">
                    ${magicLink}
                </div>
            </div>
            
            <div class="message">
                If you're having trouble accessing your account or didn't request this password reset, 
                please contact our support team immediately for assistance.
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-text">
                This email was sent from EazyParking. Please do not reply to this email.
            </div>
            
            <div class="footer-links">
                <a href="${process.env.FRONTEND_URL}/support" class="footer-link">Support Center</a>
                <a href="${process.env.FRONTEND_URL}/privacy" class="footer-link">Privacy Policy</a>
                <a href="${process.env.FRONTEND_URL}/terms" class="footer-link">Terms of Service</a>
            </div>
            
            <div class="copyright">
                © ${currentYear} EazyParking. All rights reserved.<br>
                Making parking easy, one spot at a time.
            </div>
        </div>
    </div>
</body>
</html>
    `,
    // Plain text version for email clients that don't support HTML
    text: `
    EazyParking - Password Reset Request
    
    Hello!
    
    We received a request to reset your password for your EazyParking account.
    
    To reset your password, please click on the following link:
    ${magicLink}
    
    This link will expire in 10 minutes for your security.
    
    If you didn't request this password reset, please ignore this email or contact our support team.
    
    If you're having trouble with the link, copy and paste it into your browser's address bar.
    
    Best regards,
    The EazyParking Team
    
    © ${currentYear} EazyParking. All rights reserved.
    `,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log("Password reset email sent successfully to:", email);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};
