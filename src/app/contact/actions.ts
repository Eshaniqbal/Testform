"use server";

import { sendEmail, emailStyles } from '@/lib/email';

export async function submitContactForm(formData: {
  fullName: string;
  email: string;
  phone?: string;
  contactMethod: string;
  message: string;
}) {
  try {
    // Send confirmation email to the user
    const userEmailResult = await sendEmail({
      to: formData.email,
      subject: 'Thank You for Your Application - We\'ve Received Your Message',
      text: `Dear ${formData.fullName},\n\nThank you for your application. We have received your message and will get back to you soon.\n\nBest regards,\nYour Team`,
      html: `
        <div style="${emailStyles.container}">
          <div style="${emailStyles.header}">
            <h1 style="${emailStyles.title}">Thank You for Your Application!</h1>
          </div>
          
          <div style="${emailStyles.content}">
            <p>Dear ${formData.fullName},</p>
            
            <p>Thank you for reaching out to us. We're excited to have received your application and are looking forward to connecting with you.</p>
            
            <div style="${emailStyles.details}">
              <h3 style="margin-top: 0;">Your Application Details:</h3>
              <div style="${emailStyles.detailItem}">
                <strong>Name:</strong> ${formData.fullName}
              </div>
              <div style="${emailStyles.detailItem}">
                <strong>Email:</strong> ${formData.email}
              </div>
              ${formData.phone ? `
              <div style="${emailStyles.detailItem}">
                <strong>Phone:</strong> ${formData.phone}
              </div>
              ` : ''}
              <div style="${emailStyles.detailItem}">
                <strong>Preferred Contact Method:</strong> ${formData.contactMethod}
              </div>
              <div style="${emailStyles.detailItem}">
                <strong>Your Message:</strong><br>
                ${formData.message}
              </div>
            </div>

            <p>We will review your application and contact you via your preferred method (${formData.contactMethod}) within 2-3 business days.</p>

            <a href="${process.env.WEBSITE_URL || '#'}" style="${emailStyles.button}">
              Visit Our Website
            </a>
          </div>

          <div style="${emailStyles.footer}">
            <p>This is an automated message, please do not reply directly to this email.</p>
            <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    // Send notification email to admin
    const adminEmailResult = await sendEmail({
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER || '',
      subject: '🔔 New Contact Form Submission Received',
      text: `New contact form submission received from ${formData.fullName} (${formData.email})`,
      html: `
        <div style="${emailStyles.container}">
          <div style="${emailStyles.header}">
            <h1 style="${emailStyles.title}">New Contact Form Submission</h1>
          </div>
          
          <div style="${emailStyles.content}">
            <p>A new contact form submission has been received. Please review the details below:</p>
            
            <div style="${emailStyles.details}">
              <div style="${emailStyles.detailItem}">
                <strong>Name:</strong> ${formData.fullName}
              </div>
              <div style="${emailStyles.detailItem}">
                <strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a>
              </div>
              ${formData.phone ? `
              <div style="${emailStyles.detailItem}">
                <strong>Phone:</strong> <a href="tel:${formData.phone}">${formData.phone}</a>
              </div>
              ` : ''}
              <div style="${emailStyles.detailItem}">
                <strong>Preferred Contact Method:</strong> ${formData.contactMethod}
              </div>
              <div style="${emailStyles.detailItem}">
                <strong>Message:</strong><br>
                ${formData.message}
              </div>
            </div>

            <div style="margin-top: 20px;">
              <a href="mailto:${formData.email}" style="${emailStyles.button}">
                Reply to Applicant
              </a>
            </div>
          </div>

          <div style="${emailStyles.footer}">
            <p>This is an automated notification. Please respond to the applicant within 2-3 business days.</p>
          </div>
        </div>
      `,
    });

    if (!userEmailResult.success || !adminEmailResult.success) {
      throw new Error('Failed to send email notifications');
    }

    return { success: true };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, error: 'Failed to submit form. Please try again.' };
  }
}
