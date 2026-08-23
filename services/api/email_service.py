"""
Envio de emails transaccionales via Resend (recuperacion de contraseña).
"""

from __future__ import annotations

import os

import resend
from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.environ["RESEND_API_KEY"]

FROM_EMAIL = os.environ.get("RESEND_FROM_EMAIL", "onboarding@resend.dev")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3001")


def send_password_reset_email(to_email: str, token: str) -> None:
    reset_link = f"{FRONTEND_URL}/reset-password?token={token}"

    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h1 style="font-size: 20px; color: #0f172a;">Recupera tu contraseña</h1>
      <p style="font-size: 14px; color: #334155; line-height: 1.5;">
        Hemos recibido una solicitud para restablecer tu contraseña en Nexova.
        Si no fuiste tú, puedes ignorar este email.
      </p>
      <p style="text-align: center; margin: 32px 0;">
        <a href="{reset_link}"
           style="background-color: #0891b2; color: #ffffff; text-decoration: none;
                  padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600;
                  display: inline-block;">
          Restablecer contraseña
        </a>
      </p>
      <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
        Este enlace caduca pronto y solo puede usarse una vez. Si el boton no funciona,
        copia y pega este enlace en tu navegador:<br />
        <a href="{reset_link}" style="color: #0891b2;">{reset_link}</a>
      </p>
    </div>
    """

    resend.Emails.send(
        {
            "from": FROM_EMAIL,
            "to": to_email,
            "subject": "Recupera tu contraseña — Nexova",
            "html": html,
        }
    )
