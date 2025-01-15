import nodemailer from "nodemailer";
import config from "../config";
type TPayload = {
  email: string;
  subject?: string;
  htmlData: string;
};
export const sendMail = async (payload: TPayload) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: config.NODE_ENV === "production",
    auth: {
      user: config.MAIL_SENDER_ADDRESS,
      pass: config.EMAIL_PASSWORD,
    },
  });

  const res = await transporter.sendMail({
    from: config.MAIL_SENDER_ADDRESS,
    to: "mhsabbir220@gmail.com", //payload?.email
    subject: payload?.subject,
    html: payload?.htmlData,
  });

  return res;
};
