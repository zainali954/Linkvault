export const verifyEmailTemplate = `
<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0; background-color: #f9fafb;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Verify Your Email</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: sans-serif; background-color: #f9fafb; color: #111827;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 2rem 0;">
      <tr>
        <td align="center">
          <table width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
            <tr>
              <td style="padding: 2rem; text-align: center;">
                <h1 style="font-size: 24px; margin-bottom: 0.5rem;">Verify Your Email</h1>
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 1.5rem;">
                  Click the button below to confirm your email and activate your account.
                </p>

                <a href="{{MAGIC_LINK}}" target="_blank"
                  style="display: inline-block; background-color: #7c3aed; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">
                  Verify Email
                </a>

                <p style="color: #6b7280; font-size: 12px; margin-top: 2rem;">
                  If you didn’t request this, you can safely ignore this email.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f3f4f6; text-align: center; padding: 1rem; font-size: 12px; color: #6b7280;">
                This link will expire in 1 Hour. Your data is always safe with us.
              </td>
            </tr>
          </table>

          <p style="font-size: 11px; color: #9ca3af; text-align: center; margin-top: 1rem;">
            © 2025 AuthMeUp. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>

`

export const emailVerifiedSuccessTemplate = `
<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0; background-color: #f9fafb;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Email Verified</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: sans-serif; background-color: #f9fafb; color: #111827;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 2rem 0;">
      <tr>
        <td align="center">
          <table width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
            <tr>
              <td style="padding: 2rem; text-align: center;">
                <h1 style="font-size: 24px; margin-bottom: 0.5rem;">✅ Email Verified!</h1>
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 1.5rem;">
                  Your email has been successfully verified. You can now enjoy full access to your account.
                </p>

                <a href="{{APP_HOME_URL}}" target="_blank"
                  style="display: inline-block; background-color: #7c3aed; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">
                  Go to Dashboard
                </a>

                <p style="color: #6b7280; font-size: 12px; margin-top: 2rem;">
                  If you didn’t perform this action, please contact our support team immediately.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f3f4f6; text-align: center; padding: 1rem; font-size: 12px; color: #6b7280;">
                Welcome aboard — we're glad to have you!
              </td>
            </tr>
          </table>

          <p style="font-size: 11px; color: #9ca3af; text-align: center; margin-top: 1rem;">
            © 2025 AuthMeUp. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`

export const forgotPasswordTemplate = `
<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0; background-color: #f9fafb;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Reset Your Password</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: sans-serif; background-color: #f9fafb; color: #111827;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 2rem 0;">
      <tr>
        <td align="center">
          <table width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
            <tr>
              <td style="padding: 2rem; text-align: center;">
                <h1 style="font-size: 22px; margin-bottom: 0.5rem;">Reset Your Password</h1>
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 1.5rem;">
                  We received a request to reset your password. Click the button below to create a new one.
                </p>

                <a href="{{RESET_LINK}}" target="_blank"
                  style="display: inline-block; background-color: #7c3aed; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">
                  Reset Password
                </a>

                <p style="color: #6b7280; font-size: 12px; margin-top: 1.5rem;">
                  If you didn’t request this, you can safely ignore this email. Your password will remain unchanged.
                </p>

                <p style="color: #9ca3af; font-size: 12px; margin-top: 2rem;">
                  This link will expire in 30 minutes for your security.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f3f4f6; text-align: center; padding: 1rem; font-size: 12px; color: #6b7280;">
                Stay secure — never share your password with anyone.
              </td>
            </tr>
          </table>

          <p style="font-size: 11px; color: #9ca3af; text-align: center; margin-top: 1rem;">
            © 2025 AuthMeUp. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>

`