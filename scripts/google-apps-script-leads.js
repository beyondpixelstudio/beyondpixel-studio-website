/**
 * ============================================================================
 * Beyond Pixel Studio - website enquiries into the leads Google Sheet
 * ============================================================================
 * 
 * INSTRUCTIONS TO DEPLOY:
 * 1. Open Google Sheets (https://sheets.new) and create a new Spreadsheet.
 *    Name it e.g. "Beyond Pixel Studio Leads".
 * 2. Click "Extensions" -> "Apps Script" in the top menu.
 * 3. Delete any code in the editor and PASTE THIS ENTIRE FILE.
 * 4. Click "Deploy" -> "New deployment".
 * 5. Select type: "Web app".
 *    - Description: "BPS Leads Collector"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"  <-- CRITICAL: Choose "Anyone"
 * 6. Click "Deploy", grant permissions, and COPY the Web App URL.
 * 7. Paste that Web App URL in `src/data/business.ts` under `googleScriptUrl`.
 * ============================================================================
 */

/**
 * No Telegram from here. This tab is only the raw record of what the website
 * received. The team is told about a lead once, when it reaches the Master
 * Sheet (an n8n workflow does that), so tests and repeats never ping anyone.
 */
const SHEET_NAME = 'BPS Website Leads';

/* The columns, in order. The last six say where the visit began - a Google
   Ads click, a campaign link, Google Maps or search - so the lead sync can
   label the lead's source. A tab made before they existed gets them added. */
const HEADERS = [
  'Timestamp',
  'Form Type',
  'Name',
  'Phone Number',
  'Email Address',
  'Service / Purpose',
  'Shoot Date',
  'Venue / Location',
  'Client Message',
  'Source Page',
  'Google Click ID',
  'UTM Source',
  'UTM Medium',
  'UTM Campaign',
  'Referrer',
  'Landing Page'
];

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
    const gclid = data.gclid || '';
    const utmSource = data.utmSource || '';
    const utmMedium = data.utmMedium || '';
    const utmCampaign = data.utmCampaign || '';
    const referrer = data.referrer || '';
    const landingPage = data.landingPage || '';

    // 1. Record to Google Sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#16121F').setFontColor('#FFFFFF');
      sheet.setFrozenRows(1);
    } else {
      ensureHeaders(sheet);
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
      pageUrl,
      gclid,
      utmSource,
      utmMedium,
      utmCampaign,
      referrer,
      landingPage
    ].map(asText));

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
  /* Health check: is the web app alive, and can it see its tab? */
  var sheetOk = false;
  try {
    sheetOk = !!SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  } catch (err) {}

  return ContentService.createTextOutput(JSON.stringify({
    status: 'active',
    message: 'Beyond Pixel Studio Leads Webhook is Live.',
    sheet: SHEET_NAME,
    sheetReady: sheetOk
  })).setMimeType(ContentService.MimeType.JSON);
}

/** Adds any heading the tab is missing, at the end, without moving existing ones. */
function ensureHeaders(sheet) {
  var width = Math.max(sheet.getLastColumn(), 1);
  var current = sheet.getRange(1, 1, 1, width).getValues()[0];
  if (current.length >= HEADERS.length && current[HEADERS.length - 1] === HEADERS[HEADERS.length - 1]) return;
  for (var i = current.length; i < HEADERS.length; i++) {
    if (!current[i]) sheet.getRange(1, i + 1).setValue(HEADERS[i]).setFontWeight('bold');
  }
}

/**
 * A cell that starts with = + - or @ is read by Sheets as a formula, so a
 * phone typed as "+91 98765 43210" would land as #ERROR!. A leading apostrophe
 * keeps it as the text the visitor typed.
 */
function asText(v) {
  var s = String(v);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
