export const buildVerificationEmail = (
  name: string,
  link: string
): { subject: string; html: string; text: string } => {
  const subject = "Verify your email";
  const text = `Hi ${name},\n\nVerify your email by clicking: ${link}\n\nIf you did not create an account, you can ignore this email.`;
  const html = `<p>Hi ${name},</p><p>Verify your email by clicking <a href="${link}">this link</a>.</p><p>If you did not create an account, you can ignore this email.</p>`;

  return { subject, html, text };
};

export const buildPasswordResetEmail = (
  name: string,
  link: string
): { subject: string; html: string; text: string } => {
  const subject = "Reset your password";
  const text = `Hi ${name},\n\nReset your password using this link: ${link}\n\nIf you did not request this, you can ignore this email.`;
  const html = `<p>Hi ${name},</p><p>Reset your password using <a href="${link}">this link</a>.</p><p>If you did not request this, you can ignore this email.</p>`;

  return { subject, html, text };
};
