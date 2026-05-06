import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST,
  port:   Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export async function sendVerificationEmail(email, name, token) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`
  await transporter.sendMail({
    from:    `"متجرنا 🛒" <${process.env.EMAIL_FROM}>`,
    to:      email,
    subject: 'تأكيد البريد الإلكتروني',
    html: `
      <div dir="rtl" style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;background:#f9fafb;border-radius:12px;">
        <h2 style="color:#1d4ed8;margin-top:0">مرحباً ${name}! 👋</h2>
        <p style="color:#374151">شكراً لتسجيلك في متجرنا. اضغط الزر أدناه لتأكيد بريدك الإلكتروني:</p>
        <a href="${url}"
           style="display:inline-block;background:#2563eb;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0;">
          تأكيد البريد الإلكتروني ✅
        </a>
        <p style="color:#6b7280;font-size:13px">الرابط صالح لمدة 24 ساعة.</p>
        <p style="color:#9ca3af;font-size:12px">إذا لم تقم بإنشاء هذا الحساب، تجاهل هذا الإيميل.</p>
      </div>`
  })
}

export async function sendNewsletterEmail(emails, subject, content) {
  await transporter.sendMail({
    from:    `"متجرنا 🛒" <${process.env.EMAIL_FROM}>`,
    bcc:     emails.join(','),
    subject,
    html: `<div dir="rtl" style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;">${content}</div>`
  })
}
