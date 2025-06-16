"use server";

import { sendEmail, emailStyles } from '@/lib/email';

export async function submitContactForm(formData: {
  fullName: string;
  age: string;
  belt: string;
  gender: string;
  weight: string;
  phone: string;
  address: string;
  email: string;
  schoolClub: string;
}) {
  try {
    // Send confirmation email to the user
    const userEmailResult = await sendEmail({
      to: formData.email,
      subject: 'Registration Confirmation - District Baramulla Taekwondo Championship 2025',
      text: `Dear ${formData.fullName},\n\nThank you for registering for the District Baramulla Taekwondo Championship 2025. We have received your registration and will contact you with more details soon.\n\nBest regards,\nDistrict Baramulla Taekwondo`,
      html: `
        <div style="${emailStyles.container}">
          <div style="${emailStyles.header}">
            <h1 style="${emailStyles.title}">Registration Confirmation</h1>
          </div>
          
          <div style="${emailStyles.content}">
            <p>Dear ${formData.fullName},</p>
            
            <p>Thank you for registering for the District Baramulla Taekwondo Championship 2025. We're excited to have you participate!</p>
            
            <div style="${emailStyles.details}">
              <h3 style="margin-top: 0;">Your Registration Details:</h3>
              <div style="${emailStyles.detailItem}">
                <strong>Name:</strong> ${formData.fullName}
              </div>
              <div style="${emailStyles.detailItem}">
                <strong>Age:</strong> ${formData.age}
              </div>
              <div style="${emailStyles.detailItem}">
                <strong>Belt Rank:</strong> ${formData.belt}
              </div>
              <div style="${emailStyles.detailItem}">
                <strong>Gender:</strong> ${formData.gender}
              </div>
              <div style="${emailStyles.detailItem}">
                <strong>Weight:</strong> ${formData.weight} kg
              </div>
              <div style="${emailStyles.detailItem}">
                <strong>Phone:</strong> ${formData.phone}
              </div>
              <div style="${emailStyles.detailItem}">
                <strong>Email:</strong> ${formData.email}
              </div>
              <div style="${emailStyles.detailItem}">
                <strong>Address:</strong> ${formData.address}
              </div>
              <div style="${emailStyles.detailItem}">
                <strong>School/Club:</strong> ${formData.schoolClub}
              </div>
            </div>

            <p>We will review your registration and contact you with more details about the championship schedule and requirements.</p>

            <a href="${process.env.WEBSITE_URL || '#'}" style="${emailStyles.button}">
              Visit Our Website
            </a>
          </div>

          <div style="${emailStyles.footer}">
            <p>This is an automated message, please do not reply directly to this email.</p>
            <p>© ${new Date().getFullYear()} District Baramulla Taekwondo. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    // Send notification email to admin
    const adminEmailResult = await sendEmail({
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER || '',
      subject: '🔔 New Registration - District Baramulla Taekwondo Championship 2025',
      text: `New registration received from ${formData.fullName} (${formData.email})`,
      html: `
        <div style="${emailStyles.container}">
          <div style="${emailStyles.header}">
            <h1 style="${emailStyles.title}">New Registration Received</h1>
          </div>
          
          <div style="${emailStyles.content}">
            <p>A new registration has been received for the District Baramulla Taekwondo Championship 2025. Please review the details below:</p>
            
            <div style="${emailStyles.details}">
              <div style="${emailStyles.detailItem}">
                <strong>Name:</strong> ${formData.fullName}
              </div>
              <div style="${emailStyles.detailItem}">
                <strong>Age:</strong> ${formData.age}
              </div>
              <div style="${emailStyles.detailItem}">
                <strong>Belt Rank:</strong> ${formData.belt}
              </div>
              <div style="${emailStyles.detailItem}">
                <strong>Gender:</strong> ${formData.gender}
              </div>
              <div style="${emailStyles.detailItem}">
                <strong>Weight:</strong> ${formData.weight} kg
              </div>
              <div style="${emailStyles.detailItem}">
                <strong>Phone:</strong> <a href="tel:${formData.phone}">${formData.phone}</a>
              </div>
              <div style="${emailStyles.detailItem}">
                <strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a>
              </div>
              <div style="${emailStyles.detailItem}">
                <strong>Address:</strong> ${formData.address}
              </div>
              <div style="${emailStyles.detailItem}">
                <strong>School/Club:</strong> ${formData.schoolClub}
              </div>
            </div>

            <div style="margin-top: 20px;">
              <a href="mailto:${formData.email}" style="${emailStyles.button}">
                Contact Participant
              </a>
            </div>
          </div>

          <div style="${emailStyles.footer}">
            <p>This is an automated notification. Please process this registration and contact the participant with further details.</p>
          </div>
        </div>
      `,
    });

    if (!userEmailResult.success || !adminEmailResult.success) {
      throw new Error('Failed to send email notifications');
    }

    return { success: true };
  } catch (error) {
    console.error('Error submitting registration form:', error);
    return { success: false, error: 'Failed to submit registration. Please try again.' };
  }
}
