import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendGenericEmail(
  email: string,
  subject: string,
  options: {
    heading: string;
    subheading?: string;
    bodyText: string;
    buttonText?: string;
    buttonUrl?: string;
    buttonColor?: "#00B24B" | "#3b82f6"; // green or blue-500
    additionalLink?: { text: string; url: string };
    footerText?: string;
    expiryText?: string;
  }
) {
  const {
    heading,
    subheading,
    bodyText,
    buttonText,
    buttonUrl,
    buttonColor = "#00B24B",
    additionalLink,
    footerText,
    expiryText,
  } = options;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333; margin-bottom: 10px;">${heading}</h1>
          ${
            subheading
              ? `<p style="color: #666; font-size: 16px;">${subheading}</p>`
              : ""
          }
        </div>
        
        <div style="background: #f8f9fa; border-radius: 8px; padding: 30px; margin: 20px 0; text-align: center;">
          <p style="color: #333; margin-bottom: 20px; font-size: 16px;">${bodyText}</p>
          ${
            buttonText && buttonUrl
              ? `
          <a href="${buttonUrl}" 
             style="display: inline-block; background-color: ${buttonColor}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
            ${buttonText}
          </a>
          `
              : ""
          }
        </div>
        
        ${
          additionalLink
            ? `
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
            ${additionalLink.text}
          </p>
          <p style="color: #007bff; font-size: 14px; word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 4px;">
            ${additionalLink.url}
          </p>
        </div>
        `
            : ""
        }
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
          ${
            expiryText
              ? `<p style="color: #999; font-size: 12px; margin-bottom: 5px;">${expiryText}</p>`
              : ""
          }
          ${
            footerText
              ? `<p style="color: #999; font-size: 12px;">${footerText}</p>`
              : ""
          }
        </div>
      </div>
    `,
  });
}