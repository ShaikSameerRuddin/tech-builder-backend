export const nodemailerConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: process.env.EMAIL_SERVICE_USER,
      pass: process.env.EMAIL_SERVICE_PASS,
    },
  };
  