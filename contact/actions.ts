
"use server";

import * as z from "zod";
import nodemailer from "nodemailer";

// Define the schema again here or import from a shared location
// For simplicity, redefining here. In a larger app, share it.
const formSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  contactMethod: z.enum(["Email", "Phone", "WhatsApp"]),
  message: z.string().min(10),
});

type ContactFormData = z.infer<typeof formSchema>;

export async function submitContactForm(
  data: ContactFormData
): Promise<{ success: boolean; error?: string }> {
  const validation = formSchema.safeParse(data);

  if (!validation.success) {
    return { success: false, error: "Invalid form data." };
  }

  const { fullName, email, phone, contactMethod, message } = validation.data;

  let transporter;
  const configuredMailFrom = process.env.MAIL_FROM; // Original MAIL_FROM from env
  let effectiveMailFrom = configuredMailFrom || email; // Initial default for 'from' address

  const useRealSmtp = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

  if (useRealSmtp) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_PORT === "465", // true for 465, false otherwise
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });
    console.log("Using configured SMTP server for sending emails.");
    // effectiveMailFrom will be process.env.MAIL_FROM if set, otherwise the sender's email.
    // Using the sender's email directly in the 'From' header might be problematic for some SMTP providers.
    // Ensure process.env.MAIL_FROM is set for production if your provider requires a verified sender.
  } else {
    console.log("SMTP_HOST, SMTP_USER, or SMTP_PASS not fully configured. Attempting to use Ethereal for testing.");
    try {
      const testAccount = await nodemailer.createTestAccount();
      console.log("Ethereal test account created successfully.");
      console.log("User: %s", testAccount.user);
      console.log("Pass: %s", testAccount.pass);
      console.log("Host: %s", testAccount.smtp.host);
      console.log("Port: %s", testAccount.smtp.port);
      console.log("Secure: %s", testAccount.smtp.secure);

      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      // If MAIL_FROM was not set in env, use Ethereal user for the 'from' address
      if (!configuredMailFrom) {
        effectiveMailFrom = testAccount.user;
        console.log(`process.env.MAIL_FROM was not set, using Ethereal user as sender: ${testAccount.user}`);
      } else {
        // If process.env.MAIL_FROM was set, respect it even for Ethereal.
        effectiveMailFrom = configuredMailFrom;
         console.log(`Using process.env.MAIL_FROM as sender with Ethereal: ${configuredMailFrom}`);
      }

    } catch (etherealError) {
      console.error("Failed to create Ethereal test account:", etherealError);
      return { success: false, error: "Email service configuration error (Ethereal setup failed)." };
    }
  }

  const mailOptions = {
    from: `"${fullName}" <${effectiveMailFrom}>`,
    to: process.env.CX_EMAIL_TO || "cx@example.com", // This should be your friend's email or hiring manager's email
    replyTo: email,
    subject: `New Wellness Project Application from ${fullName}`,
    text: `
      New Wellness Project Application:

      Full Name: ${fullName}
      Email: ${email}
      Phone: ${phone || "N/A"}
      Preferred Contact Method: ${contactMethod}

      Message/Interest:
      ${message}
    `,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: hsl(var(--primary));">New Wellness Project Application</h2>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Preferred Contact Method:</strong> ${contactMethod}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p><strong>Message/Interest/Qualifications:</strong></p>
        <p style="padding: 10px; border-left: 3px solid hsl(var(--primary)); background-color: #f9f9f9;">
          ${message.replace(/\n/g, "<br>")}
        </p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 0.9em; color: #777;">This email was sent from the Wellness Project application form.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) { // This will be true if the email was sent via an Ethereal account
      console.log("Preview URL (Ethereal): %s", previewUrl);
    }
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    const errorMessage = (typeof error === 'object' && error !== null && 'message' in error)
                         ? String(error.message)
                         : "Failed to send email due to an internal server error.";
    return { success: false, error: errorMessage };
  }
}
