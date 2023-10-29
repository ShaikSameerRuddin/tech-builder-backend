import { sendEmail } from "./emailServices";

interface SendThankYouEmailOptions {
  name: string;
  email: string;
}

export const sendThankYouEmail = async ({
  name,
  email,
}: SendThankYouEmailOptions): Promise<void> => {
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color: #333;">Dear ${name},</h2>
      <p style="line-height: 1.6;">
        Thank you for registering on our platform. We are thrilled to have you on board! 
        If you have any questions, comments, or concerns, feel free to reach out to us.
      </p>
      <p style="line-height: 1.6;">Best regards,</p>
      <p style="line-height: 1.6;">The Team</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: "Thank You for Registering",
    html: message,
  });
};
