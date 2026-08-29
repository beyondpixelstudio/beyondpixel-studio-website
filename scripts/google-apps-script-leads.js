/**
 * ============================================================================
 * Beyond Pixel Studio — Google Sheets & Telegram Leads Collector
 * ============================================================================
 * 
 * INSTRUCTIONS TO DEPLOY:
 * 1. Open Google Sheets (https://sheets.new) and create a new Spreadsheet.
 *    Name it e.g. "Beyond Pixel Studio Leads".
 * 2. Click "Extensions" (विस्तार) -> "Apps Script" in the top menu.
 * 3. Delete any code in the editor and PASTE THIS ENTIRE FILE.
 * 4. Click "Deploy" (तैनात करें) -> "New deployment" (नया डिप्लॉयमेंट).
 * 5. Select type: "Web app" (वेब ऐप).
 *    - Description: "BPS Leads Collector"
 *    - Execute as: "Me" (मेरा खाता)
 *    - Who has access: "Anyone" (कोई भी)  <-- CRITICAL: Choose "Anyone"
 * 6. Click "Deploy", grant permissions, and COPY the Web App URL.
 * 7. Paste that Web App URL in `src/data/business.ts` under `googleScriptUrl`.
 * ============================================================================
 */

/**
 * CREDENTIALS COME FROM SCRIPT PROPERTIES, NOT FROM THIS FILE.
 *
 * This file lives in the website repository, so anything hardcoded here ends up
 * in git history — where revoking the credential is the only way to undo it.
 *
 * One-time setup in the Apps Script editor:
 *   Project Settings (gear icon) -> Script properties -> Add script property
 *     TELEGRAM_BOT_TOKEN   <token from @BotFather>
 *
 * The chat id is not a secret and stays inline below.
 *
 * Script properties are stored against the project, never in the source, and
 * survive re-pasting this file.
 */
const PROPS = PropertiesService.getScriptProperties();
const TELEGRAM_BOT_TOKEN = PROPS.getProperty('TELEGRAM_BOT_TOKEN') || '';
const TELEGRAM_CHAT_ID = '-1003840712923'; // BPS HR/Marketing Team. Not a secret.
const SHEET_NAME = 'Leads';

function doPost(e) {
  try {
    let data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    const timestamp = data.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const formType = data.formType === 'portfolio_download' ? 'Portfolio 2026 PDF Download' : (data.formType || 'Website Enquiry');
    const name = data.name || 'N/A';
    const phone = data.phone || 'N/A';
    const email = data.email || 'N/A';
    const service = data.purpose || data.service || 'N/A';
    const shootDate = data.date || 'N/A';
    const venue = data.venue || 'N/A';
    const message = data.message || 'N/A';
    const pageUrl = data.pageUrl || 'N/A';

    // 1. Record to Google Sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // Create headers
      const headers = [
        'Timestamp',
        'Form Type',
        'Name',
        'Phone Number',
        'Email Address',
        'Service / Purpose',
        'Shoot Date',
        'Venue / Location',
        'Client Message',
        'Source Page'
      ];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#16121F').setFontColor('#FFFFFF');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      timestamp,
      formType,
      name,
      phone,
      email,
      service,
      shootDate,
      venue,
      message,
      pageUrl
    ]);

    // 2. Send Telegram Notification
    sendTelegramNotification({
      formType,
      name,
      phone,
      email,
      service,
      shootDate,
      venue,
      message,
      pageUrl,
      timestamp
    });

    return ContentService.createTextOutput(
      JSON.stringify({ status: 'success', message: 'Lead saved successfully' })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  /* Health check. Reports whether the pieces are configured and what Telegram
     said about the most recent attempt. Deliberately returns NO secret values —
     only whether a token is present and how long it is. */
  var last = null;
  try { last = JSON.parse(PROPS.getProperty('LAST_TELEGRAM_RESULT') || 'null'); } catch (err) {}

  var sheetOk = false;
  try {
    sheetOk = !!SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  } catch (err) {}

  return ContentService.createTextOutput(JSON.stringify({
    status: 'active',
    message: 'Beyond Pixel Studio Leads Webhook is Live.',
    sheetReady: sheetOk,
    telegramTokenSet: !!TELEGRAM_BOT_TOKEN,
    telegramTokenLength: TELEGRAM_BOT_TOKEN ? TELEGRAM_BOT_TOKEN.length : 0,
    telegramChatId: TELEGRAM_CHAT_ID,
    lastTelegramResult: last
  })).setMimeType(ContentService.MimeType.JSON);
}

function sendTelegramNotification(lead) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    Logger.log('Telegram skipped: set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Script properties.');
    return;
  }
  try {
    const cleanDigits = (lead.phone || '').replace(/\D/g, '');
    const waLink = cleanDigits ? `https://wa.me/${cleanDigits.startsWith('91') ? cleanDigits : '91' + cleanDigits}` : '';

    let text = `🎬 <b>NEW LEAD — BEYOND PIXEL STUDIO</b>\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `📋 <b>Type:</b> ${escapeHtml(lead.formType)}\n`;
    text += `👤 <b>Name:</b> ${escapeHtml(lead.name)}\n`;
    text += `📞 <b>Phone:</b> <code>${escapeHtml(lead.phone)}</code>\n`;
    text += `📧 <b>Email:</b> ${escapeHtml(lead.email)}\n`;
    text += `🎯 <b>Service:</b> ${escapeHtml(lead.service)}\n`;
    
    if (lead.shootDate && lead.shootDate !== 'N/A') {
      text += `📅 <b>Date of Shoot:</b> ${escapeHtml(lead.shootDate)}\n`;
    }
    if (lead.venue && lead.venue !== 'N/A') {
      text += `📍 <b>Venue:</b> ${escapeHtml(lead.venue)}\n`;
    }
    if (lead.message && lead.message !== 'N/A') {
      text += `💬 <b>Message:</b> <i>${escapeHtml(lead.message)}</i>\n`;
    }
    
    text += `🔗 <b>Page:</b> ${escapeHtml(lead.pageUrl)}\n`;
    text += `⏰ <b>Time:</b> ${escapeHtml(lead.timestamp)}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━`;

    const payload = {
      chat_id: TELEGRAM_CHAT_ID,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    };

    if (waLink) {
      payload.reply_markup = JSON.stringify({
        inline_keyboard: [
          [
            { text: '💬 Chat on WhatsApp', url: waLink },
            /* No "Call" button here, and it is not an oversight.
            Telegram rejects tel: in an inline keyboard — it only accepts http,
            https and tg schemes, and a tel: URL comes back as
            "Bad Request: inline keyboard button URL is invalid: Wrong port
            number specified in the URL", which fails the WHOLE message, not
            just the button. Verified against the live API.
            The number is already in the body wrapped in <code>, and Telegram
            makes <code> tap-to-copy, so dialling is still one tap. */
          ]
        ]
      });
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const res = UrlFetchApp.fetch(url, {
      method: 'post',
      /* charset AND a byte payload, both deliberately.
         UrlFetchApp handed the JSON string over without declaring an encoding,
         so Telegram decoded the UTF-8 emoji as single-byte characters and the
         alerts arrived reading "üé¨ NEW LEAD" instead of "🎬 NEW LEAD".
         newBlob().getBytes() produces UTF-8 bytes, and the charset in the
         content type tells the far end how to read them. */
      contentType: 'application/json; charset=utf-8',
      payload: Utilities.newBlob(JSON.stringify(payload), 'application/json').getBytes(),
      muteHttpExceptions: true
    });

    /* Record the outcome. muteHttpExceptions means a rejected message does NOT
       throw — Telegram returns 400 with a description and the script carries on
       as if nothing happened. That is how a wrong chat id and an illegal
       tel: button both produced total silence rather than an error. Storing the
       last result makes the next failure diagnosable from doGet instead of
       guessable. */
    const code = res.getResponseCode();
    /* Trimmed, but not mid-escape: slicing a JSON string at a fixed length can
       cut a \uXXXX sequence in half, and the stored value then fails to parse
       for whoever reads it back. Drop any dangling partial escape. */
    const body = res.getContentText().slice(0, 300).replace(/\\u[0-9a-fA-F]{0,3}$/, '');
    PROPS.setProperty('LAST_TELEGRAM_RESULT', JSON.stringify({
      at: new Date().toISOString(), code: code, ok: code === 200, body: body
    }));
    if (code !== 200) Logger.log('Telegram rejected the message: ' + body);
  } catch (err) {
    PROPS.setProperty('LAST_TELEGRAM_RESULT', JSON.stringify({
      at: new Date().toISOString(), code: 0, ok: false, body: String(err)
    }));
    Logger.log('Telegram sending error: ' + err.toString());
  }
}

/**
 * HTML escaping for Telegram's parse_mode: 'HTML'.
 *
 * THREE characters, not eighteen. The previous version escaped the MarkdownV2
 * set (_ * [ ] ( ) ~ ` > # + - = | { } . !) and then sent the message with
 * parse_mode 'Markdown' — legacy Markdown, which does not recognise those
 * escapes. The backslashes were therefore printed literally, which is why leads
 * arrived reading "\+917608924893" and "admin@beyondpixel\.online".
 *
 * HTML mode is used instead because lead data is arbitrary user input: names,
 * emails, URLs and free-text messages routinely contain dots, hyphens, plus
 * signs and underscores. Under HTML only &, < and > are special, so a client
 * typing "multi-camera" cannot break the formatting or the send.
 */
function escapeHtml(text) {
  if (!text && text !== 0) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

