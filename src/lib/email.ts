import nodemailer from 'nodemailer';

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Add these settings to improve deliverability
  pool: true, // use pooled connections
  maxConnections: 1,
  maxMessages: 3,
  rateDelta: 1000, // how long to wait between messages
  rateLimit: 3, // max number of messages per rateDelta
});

// Email template styles
const emailStyles = {
  container: `
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  `,
  header: `
    text-align: center;
    padding: 20px 0;
    border-bottom: 2px solid #f0f0f0;
    margin-bottom: 20px;
  `,
  title: `
    color: #2d3748;
    font-size: 24px;
    font-weight: 600;
    margin: 0;
  `,
  content: `
    color: #4a5568;
    line-height: 1.6;
    font-size: 16px;
  `,
  details: `
    background-color: #f8fafc;
    padding: 20px;
    border-radius: 6px;
    margin: 20px 0;
  `,
  detailItem: `
    margin: 10px 0;
    padding: 8px 0;
    border-bottom: 1px solid #e2e8f0;
  `,
  footer: `
    text-align: center;
    padding-top: 20px;
    border-top: 2px solid #f0f0f0;
    color: #718096;
    font-size: 14px;
  `,
  button: `
    display: inline-block;
    padding: 12px 24px;
    background-color: #4299e1;
    color: white;
    text-decoration: none;
    border-radius: 6px;
    margin: 20px 0;
  `,
};

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  try {
    const mailOptions = {
      from: {
        name: 'Wellness', // Replace with your company name
        address: process.env.EMAIL_USER || '',
      },
      to,
      subject,
      text,
      html,
      // Add headers to improve deliverability
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'X-Mailer': 'Your Company Mailer',
      },
      // Add message ID for better tracking
      messageId: `<${Date.now()}.${Math.random().toString(36).substring(2)}@${process.env.EMAIL_DOMAIN || 'yourdomain.com'}>`,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

// Export styles for use in other files
export { emailStyles }; 