// ============================================================
// SISTEMA DE RESERVAS UCT - WEBHOOK GOOGLE APPS SCRIPT
// ============================================================
// Instrucciones de Instalación:
// 1. Ve a https://script.google.com/ e inicia sesión con tu cuenta UCT.
// 2. Haz clic en "Nuevo Proyecto".
// 3. Borra el código por defecto y pega TODO este archivo.
// 4. Configura tus datos bancarios y correo del administrador en la constante CONFIG.
// 5. Clic en "Implementar" (arriba a la derecha) -> "Nueva Implementación".
// 6. Configuración:
//    - Tipo: Aplicación Web
//    - Ejecutar como: "Yo (tu correo)"
//    - Quién tiene acceso: "Cualquier persona" (IMPORTANTE)
// 7. Clic en Implementar (Autoriza si te pide permisos de Gmail).
// 8. Copia la URL de la Aplicación web que te entrega y ponla en Booking.tsx (variable API_URL).
// ============================================================

const CONFIG = {
    EMAIL: {
        brandName: "Centro Recreacional UCT",
        brandColor: "#0f766e",           // Color principal (Teal)
        brandColorLight: "#14b8a6",      // Color secundario claro
        applicantSubjectPrefix: "Solicitud de Reserva Recibida",
        adminTargetEmail: "reservascuracautin@uct.cl" // <-- CORREO DEL ADMINISTRADOR
    },
    TRANSFER_DATA: {
        bank: "Banco Santander",
        accountType: "Cuenta Corriente",
        accountNumber: "0000000000",
        holderName: "Universidad Católica de Temuco",
        holderRut: "70.000.000-0",
        holderEmail: "tesoreria@uct.cl",
        amountCLP: 0, // Fallback (El front end envía el totalPrice)
        note: "Reserva Curacautín"
    }
};

/**
 * Función principal que intercepta el HTTP POST (fetch) desde React.
 */
function doPost(e) {
    try {
        // 1. Parsear los datos entrantes (JSON desde React)
        let req;
        if (e.postData && e.postData.contents) {
            req = JSON.parse(e.postData.contents);
        } else {
            req = e.parameter;
        }

        // 2. Construir los correos
        const applicantEmail = buildApplicantEmail_(req);
        const adminEmail = buildAdminEmail_(req);

        // 3. Enviar correo automático al Solicitante
        if (req.formAccountEmail) {
            MailApp.sendEmail({
                to: req.formAccountEmail,
                subject: applicantEmail.subject,
                htmlBody: applicantEmail.htmlBody,
                name: CONFIG.EMAIL.brandName
            });
        }

        // 4. Enviar correo automático de Alerta al Administrador
        if (CONFIG.EMAIL.adminTargetEmail) {
            MailApp.sendEmail({
                to: CONFIG.EMAIL.adminTargetEmail,
                subject: adminEmail.subject,
                htmlBody: adminEmail.htmlBody,
                name: "Sistema de Reservas UCT"
            });
        }

        // Retorna éxito
        return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Correos procesados" }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        // Retorna error detallado
        return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// ============================================================
// EMAIL – Templates
// ============================================================

/**
 * Construye el correo HTML para el solicitante.
 * @param {Object} req
 * @returns {{ subject: string, htmlBody: string }}
 */
function buildApplicantEmail_(req) {
    const subject = `${CONFIG.EMAIL.applicantSubjectPrefix} – ${req.arrivalDate || 'Fecha por confirmar'}`;
    const brand = CONFIG.EMAIL.brandColor;
    const brandLight = CONFIG.EMAIL.brandColorLight;
    const brandName = CONFIG.EMAIL.brandName;

    const htmlBody = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Solicitud de Reserva</title>
</head>
<body style="margin:0;padding:0;background-color:#eef2f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#eef2f7;padding:32px 0;">
    <tr><td align="center">

      <!-- CARD -->
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">

        <!-- HEADER -->
        <tr>
          <td style="background:${brand};padding:36px 48px;text-align:center;">
            <p style="margin:0 0 6px 0;color:rgba(255,255,255,0.7);font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Sistema de Reservas</p>
            <h1 style="margin:0;color:#ffffff;font-size:30px;font-weight:700;letter-spacing:-0.5px;">${escapeHtml_(brandName)}</h1>
          </td>
        </tr>

        <!-- SALUDO -->
        <tr>
          <td style="padding:40px 48px 24px 48px;">
            <h2 style="margin:0 0 12px 0;color:#1e3a5f;font-size:22px;font-weight:700;">
              ¡Hola, ${escapeHtml_(req.fullName || 'Usuario')}!
            </h2>
            <p style="margin:0;color:#4b5563;font-size:15px;line-height:1.7;">
              Hemos recibido tu solicitud de reserva correctamente. Nuestro equipo la está revisando y te contactaremos a la brevedad para confirmar disponibilidad y enviarte los datos de pago.
            </p>
          </td>
        </tr>

        <!-- PROGRESS STEPS -->
        <tr>
          <td style="padding:0 48px 32px 48px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f7ff;border-radius:10px;padding:24px;">
              <tr>
                <td align="center">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <!-- Paso 1: Activo -->
                      <td align="center" style="width:100px;">
                        <table cellpadding="0" cellspacing="0" align="center">
                          <tr><td align="center">
                            <div style="width:52px;height:52px;border-radius:50%;background:${brandLight};margin:0 auto;line-height:52px;text-align:center;">
                              <span style="color:#fff;font-size:22px;font-weight:700;line-height:52px;">✓</span>
                            </div>
                          </td></tr>
                          <tr><td align="center" style="padding-top:8px;">
                            <span style="font-size:11px;color:${brandLight};font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Recibida</span>
                          </td></tr>
                        </table>
                      </td>
                      <!-- Línea -->
                      <td style="width:70px;height:2px;background:linear-gradient(to right,${brandLight},#d1d5db);vertical-align:middle;"></td>
                      <!-- Paso 2 -->
                      <td align="center" style="width:100px;">
                        <table cellpadding="0" cellspacing="0" align="center">
                          <tr><td align="center">
                            <div style="width:52px;height:52px;border-radius:50%;background:#e5e7eb;margin:0 auto;line-height:52px;text-align:center;">
                              <span style="font-size:22px;line-height:52px;">⏳</span>
                            </div>
                          </td></tr>
                          <tr><td align="center" style="padding-top:8px;">
                            <span style="font-size:11px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">En Revisión</span>
                          </td></tr>
                        </table>
                      </td>
                      <!-- Línea -->
                      <td style="width:70px;height:2px;background:#d1d5db;vertical-align:middle;"></td>
                      <!-- Paso 3 -->
                      <td align="center" style="width:100px;">
                        <table cellpadding="0" cellspacing="0" align="center">
                          <tr><td align="center">
                            <div style="width:52px;height:52px;border-radius:50%;background:#e5e7eb;margin:0 auto;line-height:52px;text-align:center;">
                              <span style="font-size:22px;line-height:52px;">🎉</span>
                            </div>
                          </td></tr>
                          <tr><td align="center" style="padding-top:8px;">
                            <span style="font-size:11px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Confirmada</span>
                          </td></tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- TARJETAS: RESERVA + RETORNO -->
        <tr>
          <td style="padding:0 48px 28px 48px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="48%" style="vertical-align:top;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:${brand};border-radius:10px;">
                    <tr>
                      <td style="padding:22px 20px;text-align:center;">
                        <p style="margin:0 0 4px 0;color:rgba(255,255,255,0.65);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">Espacio de Reserva</p>
                        <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;line-height:1.3;">${escapeHtml_(req.reserva || '—')}</p>
                      </td>
                    </tr>
                  </table>
                </td>
                <td width="4%"></td>
                <td width="48%" style="vertical-align:top;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:${brandLight};border-radius:10px;">
                    <tr>
                      <td style="padding:22px 20px;text-align:center;">
                        <p style="margin:0 0 4px 0;color:rgba(255,255,255,0.65);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">Fecha de Salida</p>
                        <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;line-height:1.3;">${escapeHtml_(req.returnDate || '—')}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- DETALLES DE LA SOLICITUD -->
        <tr>
          <td style="padding:0 48px 36px 48px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
              <tr>
                <td style="background:#f8fafc;padding:14px 20px;border-bottom:1px solid #e5e7eb;">
                  <span style="color:#1e3a5f;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Resumen de tu Solicitud</span>
                </td>
              </tr>
              ${buildDetailRow_('📅', 'Fecha de llegada', req.arrivalDate)}
              ${buildDetailRow_('👥', 'Cantidad de personas', req.partySize ? req.partySize + ' personas' : '')}
              ${buildDetailRow_('🪪', 'RUT', req.rut)}
              ${buildDetailRow_('📞', 'Teléfono', req.phoneRaw)}
              ${buildDetailRow_('✉️', 'Correo', req.formAccountEmail)}
              ${buildDetailRow_('🕐', 'Fecha de solicitud', req.timestamp)}
            </table>
          </td>
        </tr>

        <!-- AVISO PAGO -->
        <tr>
          <td style="padding:0 48px 36px 48px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fcd34d;border-radius:10px;">
              <tr>
                <td style="padding:18px 20px;">
                  <p style="margin:0;color:#92400e;font-size:14px;line-height:1.6;">
                    <strong>⚠️ Próximo paso:</strong> Una vez confirmada la disponibilidad, recibirás los datos de transferencia bancaria para completar tu reserva. El cupo se asigna por orden de pago.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e5e7eb;padding:28px 48px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0 0 4px 0;color:#1e3a5f;font-size:14px;font-weight:600;">Equipo ${escapeHtml_(brandName)}</p>
                  <p style="margin:0;color:#9ca3af;font-size:12px;">Universidad Católica de Temuco</p>
                </td>
                <td align="right">
                  <p style="margin:0;color:#d1d5db;font-size:11px;">Sistema automatizado de reservas</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;

    return { subject, htmlBody };
}

/**
 * Construye el correo HTML interno para el administrador.
 * @param {Object} req
 * @returns {{ subject: string, htmlBody: string }}
 */
function buildAdminEmail_(req) {
    const subject = `🔔 Nueva reserva – ${req.reserva || 'sin espacio'} | ${req.arrivalDate || 'sin fecha'} | ${req.fullName || ''}`.trim();
    const brand = CONFIG.EMAIL.brandColor;
    const brandName = CONFIG.EMAIL.brandName;

    const waText = buildWhatsAppPreFilledMessage_(req);
    const waLink = buildWhatsAppLink_(req.phoneNormalized, waText);

    const htmlBody = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nueva Solicitud de Reserva</title>
</head>
<body style="margin:0;padding:0;background-color:#eef2f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f7;padding:32px 0;">
    <tr><td align="center">

      <!-- CARD -->
      <table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">

        <!-- HEADER ADMIN -->
        <tr>
          <td style="background:#111827;padding:28px 48px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0 0 2px 0;color:rgba(255,255,255,0.5);font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Panel Administrativo</p>
                  <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">🔔 Nueva Solicitud de Reserva</h1>
                </td>
                <td align="right">
                  <span style="display:inline-block;background:#10b981;color:#fff;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;letter-spacing:0.5px;">NUEVA</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- TARJETAS DESTACADAS: RESERVA + RETORNO -->
        <tr>
          <td style="padding:28px 48px 0 48px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="31%" style="vertical-align:top;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1e3a5f,#2563eb);border-radius:10px;">
                    <tr><td style="padding:20px;text-align:center;">
                      <p style="margin:0 0 4px 0;color:rgba(255,255,255,0.6);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">Espacio</p>
                      <p style="margin:0;color:#fff;font-size:17px;font-weight:700;">${escapeHtml_(req.reserva || '—')}</p>
                    </td></tr>
                  </table>
                </td>
                <td width="3%"></td>
                <td width="31%" style="vertical-align:top;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0f766e,#10b981);border-radius:10px;">
                    <tr><td style="padding:20px;text-align:center;">
                      <p style="margin:0 0 4px 0;color:rgba(255,255,255,0.6);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">Llegada</p>
                      <p style="margin:0;color:#fff;font-size:17px;font-weight:700;">${escapeHtml_(req.arrivalDate || '—')}</p>
                    </td></tr>
                  </table>
                </td>
                <td width="3%"></td>
                <td width="31%" style="vertical-align:top;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#7c3aed,#a855f7);border-radius:10px;">
                    <tr><td style="padding:20px;text-align:center;">
                      <p style="margin:0 0 4px 0;color:rgba(255,255,255,0.6);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">Salida</p>
                      <p style="margin:0;color:#fff;font-size:17px;font-weight:700;">${escapeHtml_(req.returnDate || '—')}</p>
                    </td></tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- DATOS DEL CLIENTE -->
        <tr>
          <td style="padding:28px 48px 0 48px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
              <tr>
                <td colspan="2" style="background:#f8fafc;padding:14px 20px;border-bottom:1px solid #e5e7eb;">
                  <span style="color:#1e3a5f;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">👤 Datos del Solicitante</span>
                </td>
              </tr>
              ${buildAdminRow_('Nombre completo', req.fullName)}
              ${buildAdminRow_('RUT', req.rut)}
              ${buildAdminRow_('Correo formulario', req.formAccountEmail)}
              ${buildAdminRow_('Correo personal', req.personalEmail)}
              ${buildAdminRow_('Teléfono', req.phoneRaw)}
              ${buildAdminRow_('Cantidad personas', req.partySize ? req.partySize + ' personas' : '')}
              ${buildAdminRow_('Aceptó T&C', req.termsAccepted)}
              ${buildAdminRow_('Marca temporal', req.timestamp)}
            </table>
          </td>
        </tr>

        <!-- BOTÓN WHATSAPP -->
        <tr>
          <td style="padding:28px 48px 0 48px;text-align:center;">
            <a href="${waLink}"
               style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:8px;font-size:16px;font-weight:700;letter-spacing:0.3px;box-shadow:0 4px 12px rgba(37,211,102,0.35);">
              💬 Contactar por WhatsApp
            </a>
            <p style="margin:10px 0 0 0;color:#9ca3af;font-size:12px;">El mensaje incluye automáticamente los datos de transferencia bancaria</p>
          </td>
        </tr>

        <!-- DATOS DE TRANSFERENCIA (referencia rápida) -->
        <tr>
          <td style="padding:24px 48px 0 48px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f7ff;border:1px solid #bfdbfe;border-radius:10px;">
              <tr>
                <td style="padding:18px 20px;">
                  <p style="margin:0 0 10px 0;color:#1e3a5f;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">🏦 Datos de Transferencia</p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${buildTransferRow_('Banco', CONFIG.TRANSFER_DATA.bank)}
                    ${buildTransferRow_('Tipo cuenta', CONFIG.TRANSFER_DATA.accountType)}
                    ${buildTransferRow_('N° cuenta', CONFIG.TRANSFER_DATA.accountNumber)}
                    ${buildTransferRow_('Titular', CONFIG.TRANSFER_DATA.holderName)}
                    ${buildTransferRow_('RUT titular', CONFIG.TRANSFER_DATA.holderRut)}
                    ${buildTransferRow_('Monto', '$' + formatCLP_(req.totalPrice || CONFIG.TRANSFER_DATA.amountCLP) + ' CLP')}
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e5e7eb;padding:24px 48px;margin-top:28px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0;color:#6b7280;font-size:12px;">Sistema automatizado de reservas · ${escapeHtml_(brandName)}</p>
                </td>
                <td align="right">
                  <p style="margin:0;color:#d1d5db;font-size:11px;">${new Date().toLocaleString('es-CL')}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;

    return { subject, htmlBody };
}

// ============================================================
// HELPERS
// ============================================================

/**
 * Fila de detalle para el correo del solicitante (ícono + label + valor).
 */
function buildDetailRow_(icon, label, value) {
    const display = escapeHtml_(value || '—');
    return `
  <tr style="border-top:1px solid #f3f4f6;">
    <td style="padding:12px 20px;color:#6b7280;font-size:14px;width:50%;">
      <span style="margin-right:6px;">${icon}</span><strong>${escapeHtml_(label)}</strong>
    </td>
    <td style="padding:12px 20px;color:#1e3a5f;font-size:14px;font-weight:600;text-align:right;">${display}</td>
  </tr>`;
}

/**
 * Fila de datos para el correo del admin.
 */
function buildAdminRow_(label, value) {
    const display = escapeHtml_(value || '—');
    return `
  <tr style="border-top:1px solid #f3f4f6;">
    <td style="padding:11px 20px;color:#6b7280;font-size:13px;width:42%;"><strong>${escapeHtml_(label)}</strong></td>
    <td style="padding:11px 20px;color:#111827;font-size:13px;">${display}</td>
  </tr>`;
}

/**
 * Fila compacta para la sección de datos de transferencia.
 */
function buildTransferRow_(label, value) {
    return `
  <tr>
    <td style="padding:3px 0;color:#4b5563;font-size:13px;width:40%;"><strong>${escapeHtml_(label)}:</strong></td>
    <td style="padding:3px 0;color:#1e3a5f;font-size:13px;font-weight:600;">${escapeHtml_(value || '—')}</td>
  </tr>`;
}

/**
 * Genera el mensaje de WhatsApp pre-rellenado con datos de transferencia.
 */
function buildWhatsAppPreFilledMessage_(req) {
    const t = CONFIG.TRANSFER_DATA;

    return `Hola ${req.fullName || ''}, recibimos tu solicitud de reserva en ${CONFIG.EMAIL.brandName}.

📋 *Detalle de tu reserva:*
• Espacio: ${req.reserva || '—'}
• Fecha de llegada: ${req.arrivalDate || '—'}
• Fecha de salida: ${req.returnDate || '—'}
• Personas: ${req.partySize || '—'}

Para confirmar tu reserva, realiza la transferencia con los siguientes datos:
━━━━━━━━━━━━━━━━━━━━
🏦 Banco: ${t.bank}
📂 Tipo: ${t.accountType}
🔢 N° cuenta: ${t.accountNumber}
👤 Titular: ${t.holderName}
🪪 RUT: ${t.holderRut}
✉️ Email: ${t.holderEmail}
💰 Monto: $${formatCLP_(req.totalPrice || t.amountCLP)} CLP
📝 Glosa: ${t.note}
━━━━━━━━━━━━━━━━━━━━

⚠️ El cupo se asigna por orden de pago. Una vez realizada la transferencia, envíanos el comprobante por este medio.

Gracias 🙏`.trim();
}

/**
 * Genera el link de WhatsApp con mensaje pre-rellenado.
 */
function buildWhatsAppLink_(phoneForWaMe, message) {
    if (!phoneForWaMe) return '#';
    return `https://wa.me/${phoneForWaMe}?text=${encodeURIComponent(message || '')}`;
}

function formatCLP_(num) {
    return num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "0";
}

function escapeHtml_(text) {
    if (!text) return "";
    return text
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
