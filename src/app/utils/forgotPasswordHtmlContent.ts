type TPayload = {
  name: string;
  resetLink: string;
};

const forgotPasswordHtmlContent = (payload: TPayload) => {
  return `<p>Hello, ${payload.name}</p>
   <p>We received a request to reset the password for your Green Steps account.</p>
   <p>To reset your password, please click the link below. This link is valid for 2 minutes.</p>
   <p><a href="${payload.resetLink}">Reset Password</a></p>
   <p>If you did not request this password reset, please ignore this email.</p> 
   <p>Best regards,<br>
   The Green Steps Team</p>`;
};

export default forgotPasswordHtmlContent;
