import { sendGenericEmail } from "./db/template";

export const emailConfig = {
  // Recipient email
  email: "user@example.com",

  // Email subject
  subject: "Welcome to Our Platform",

  // Email options
  options: {
    heading: "Welcome to Our Platform!",
    subheading: "We're glad to have you here",
    bodyText: "Click the button below to get started with your account.",
    buttonText: "Get Started",
    buttonUrl: "https://example.com/dashboard",
    buttonColor: "#00B24B" as const, // or "#3b82f6"
    additionalLink: {
      text: "Or copy and paste this link into your browser:",
      url: "https://example.com/dashboard",
    },
    expiryText: "This link will expire in 24 hours",
    footerText: "If you have any questions, contact our support team.",
  },
};

// Function to send email using the config
export async function sendConfiguredEmail() {
  await sendGenericEmail(
    emailConfig.email,
    emailConfig.subject,
    emailConfig.options
  );
}
