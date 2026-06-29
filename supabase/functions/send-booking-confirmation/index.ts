import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!

const KAPPER_NAMES: Record<string, string> = {
  joop: 'Joop',
  mat: 'Mat',
  sari: 'Sari',
}

const DAYS_NL = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag']
const MONTHS_NL = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december']

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return `${DAYS_NL[d.getDay()]} ${d.getDate()} ${MONTHS_NL[d.getMonth()]} ${d.getFullYear()}`
}

function formatTime(timeStr: string): string {
  return timeStr.slice(0, 5)
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const { fullName, email, serviceName, kapperId, appointmentDate, startTime } = await req.json()

    const kapperName = KAPPER_NAMES[kapperId] ?? kapperId
    const dateFormatted = formatDate(appointmentDate)
    const timeFormatted = formatTime(startTime)

    const html = `
<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#1a1a1a;padding:32px 40px;">
            <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Kapper Joop</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#C49A6C;text-transform:uppercase;letter-spacing:1px;">Afspraakbevestiging</p>
            <h1 style="margin:0 0 24px;font-size:26px;font-weight:700;color:#1a1a1a;line-height:1.2;">Jouw afspraak is bevestigd!</h1>
            <p style="margin:0 0 32px;font-size:15px;color:#555;line-height:1.6;">Hoi ${fullName}, je afspraak bij Kapper Joop staat vast. Tot dan!</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border-radius:6px;padding:24px;margin-bottom:32px;">
              <tr>
                <td style="padding:8px 0;">
                  <p style="margin:0;font-size:12px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:0.8px;">Dienst</p>
                  <p style="margin:4px 0 0;font-size:16px;font-weight:600;color:#1a1a1a;">${serviceName}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0;border-top:1px solid #ebebeb;">
                  <p style="margin:0;font-size:12px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:0.8px;">Kapper</p>
                  <p style="margin:4px 0 0;font-size:16px;font-weight:600;color:#1a1a1a;">${kapperName}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0;border-top:1px solid #ebebeb;">
                  <p style="margin:0;font-size:12px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:0.8px;">Datum</p>
                  <p style="margin:4px 0 0;font-size:16px;font-weight:600;color:#1a1a1a;">${dateFormatted}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0;border-top:1px solid #ebebeb;">
                  <p style="margin:0;font-size:12px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:0.8px;">Tijd</p>
                  <p style="margin:4px 0 0;font-size:16px;font-weight:600;color:#1a1a1a;">${timeFormatted}</p>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:13px;color:#999;line-height:1.6;">Vragen? Neem contact op via de website.</p>
          </td>
        </tr>
        <tr>
          <td style="background:#f9f9f9;padding:20px 40px;border-top:1px solid #ebebeb;">
            <p style="margin:0;font-size:12px;color:#aaa;">© ${new Date().getFullYear()} Kapper Joop · Dit is een automatisch bericht</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Kapper Joop <onboarding@resend.dev>',
        to: [email],
        subject: `Bevestiging afspraak – ${dateFormatted} om ${timeFormatted}`,
        html,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return new Response(JSON.stringify({ error: err }), { status: 500 })
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 })
  }
})
