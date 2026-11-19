import { business } from '../data/business.ts';

export interface LeadPayload {
  formType: 'portfolio_download' | 'general_enquiry' | 'vendor_registration';
  name: string;
  phone: string;
  email: string;
  service?: string;
  purpose?: string;
  date?: string;
  venue?: string;
  message?: string;
  pageUrl?: string;
  timestamp?: string;
  /** Where the visit began - saved by the script in the site's <head>. */
  gclid?: string;

  /* ---------------------------------------------------------------------
     VENDOR REGISTRATION ONLY.

     Extra keys on the same payload, additive on purpose: the Apps Script
     appends the columns it knows, so until it is taught these names they are
     ignored — and the same details ALSO go out inside `message` as labelled
     lines, which the script already writes. A registration is never lost
     waiting on a script change, and gains real columns the day it happens.

     NOTHING FINANCIAL IS HERE. No PAN, no Aadhaar, no bank details, and no
     GSTIN — only whether one exists. This payload is posted from a public
     page with mode:'no-cors', so the browser cannot even see whether it
     arrived; that is not a channel for identity documents. Those are
     collected after selection, over a channel where both sides can confirm. */
  /** Which of the four vendor kinds. Also sent as `service`, a column the sheet has. */
  vendorType?: string;
  /** Discipline, equipment list, service type or post-production specialities. */
  vendorSkills?: string;
  city?: string;
  /** Where they will travel to work. */
  coverage?: string;
  experience?: string;
  /** Showreel, Drive folder, Instagram or site. */
  portfolioUrl?: string;
  /** What they own and bring to a job. */
  ownEquipment?: string;
  /** A range, in their own words. Never a quoted rate. */
  rate?: string;
  availability?: string;
  /** 'Yes' or 'No' ONLY — never the number. */
  gstRegistered?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  landingPage?: string;
}

/** The ad click, campaign or referrer this browser arrived from, if any. */
function attribution(): Partial<LeadPayload> {
  try {
    const a = JSON.parse(localStorage.getItem('bps_attribution') || 'null');
    if (!a) return {};
    return {
      gclid: a.gclid || a.gbraid || a.wbraid || '',
      utmSource: a.utm_source || '',
      utmMedium: a.utm_medium || '',
      utmCampaign: a.utm_campaign || '',
      referrer: a.referrer || '',
      landingPage: a.landingPage || '',
    };
  } catch {
    return {};
  }
}

/**
 * Dispatches lead data to:
 * 1. Meta Pixel (Lead event + Custom Audience)
 * 2. Google Apps Script Webhook (Google Sheets append)
 * 3. Telegram — NOT from here. The Apps Script sends it server-side; see below.
 * 4. LocalStorage cache
 */
export async function dispatchLead(lead: LeadPayload): Promise<void> {
  lead.timestamp = lead.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  lead.pageUrl = lead.pageUrl || (typeof window !== 'undefined' ? window.location.href : '');
  if (typeof window !== 'undefined') Object.assign(lead, attribution());

  // 1. Meta Pixel Lead Tracking
  try {
    if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
      (window as any).fbq('track', 'Lead', {
        content_name:
          lead.formType === 'portfolio_download'
            ? '2026 Portfolio PDF Download'
            : lead.formType === 'vendor_registration'
              ? 'Vendor Registration'
              : 'Website Enquiry',
        content_category: lead.service || lead.purpose || 'Media Production',
        value: 0,
        currency: 'INR',
      });
    }
  } catch (e) {
    // Non-blocking
  }

  // 2. LocalStorage persistence
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('bps_last_lead', JSON.stringify(lead));
    }
  } catch (e) {}

  // 3. Dispatch to Google Apps Script Webhook
  if (business.googleScriptUrl) {
    try {
      fetch(business.googleScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(lead),
        mode: 'no-cors',
        keepalive: true,
      }).catch(() => {});
    } catch (e) {}
  }

  /* TELEGRAM IS SENT SERVER-SIDE, BY THE APPS SCRIPT.
   *
   * This function used to POST to api.telegram.org directly from the browser,
   * which meant the bot token had to be a constant in this file — and this file
   * is imported from a bundled <script>, so the token was compiled into
   * dist/_astro/lead-dispatcher.*.js and served to every visitor. Anyone could
   * read it from View Source and then send as the bot, read what it receives,
   * or point its webhook somewhere else.
   *
   * The Apps Script above already sends the same alert (sendTelegramNotification),
   * and it runs on Google's servers where a token is safe. So the browser now
   * only talks to the Apps Script endpoint, which is a public URL by design.
   *
   * Do not reintroduce a direct Telegram call here, however convenient it looks
   * as a fallback. There is no way to do it from the browser without publishing
   * the token.
   */
}
