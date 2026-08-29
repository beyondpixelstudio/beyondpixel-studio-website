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

    let text = `🎬 *NEW LEAD — BEYOND PIXEL STUDIO*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `📋 *Type:* ${escapeMarkdown(lead.formType)}\n`;
    text += `👤 *Name:* ${escapeMarkdown(lead.name)}\n`;
    text += `📞 *Phone:* \`${escapeMarkdown(lead.phone)}\`\n`;
    text += `📧 *Email:* ${escapeMarkdown(lead.email)}\n`;
    text += `🎯 *Service:* ${escapeMarkdown(lead.service)}\n`;
    
    if (lead.shootDate && lead.shootDate !== 'N/A') {
      text += `📅 *Date of Shoot:* ${escapeMarkdown(lead.shootDate)}\n`;
    }
    if (lead.venue && lead.venue !== 'N/A') {
      text += `📍 *Venue:* ${escapeMarkdown(lead.venue)}\n`;
    }
    if (lead.message && lead.message !== 'N/A') {
      text += `💬 *Message:* _${escapeMarkdown(lead.message)}_\n`;
    }
    
    text += `🔗 *Page:* ${escapeMarkdown(lead.pageUrl)}\n`;
    text += `⏰ *Time:* ${escapeMarkdown(lead.timestamp)}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━`;

    const payload = {
      chat_id: TELEGRAM_CHAT_ID,
      text: text,
      parse_mode: 'Markdown',
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
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    /* Record the outcome. muteHttpExceptions means a rejected message does NOT
       throw — Telegram returns 400 with a description and the script carries on
       as if nothing happened. That is how a wrong chat id and an illegal
       tel: button both produced total silence rather than an error. Storing the
       last result makes the next failure diagnosable from doGet instead of
       guessable. */
    const code = res.getResponseCode();
    const body = res.getContentText().slice(0, 300);
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

function escapeMarkdown(text) {
  if (!text) return '';
  return String(text).replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}
