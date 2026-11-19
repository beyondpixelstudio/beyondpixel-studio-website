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
  /** Meta ids - the same event_id goes to the pixel, Conversions API and the CRM. */
  eventId?: string;
  metaEventId?: string;
  fbc?: string;
  fbp?: string;
}

/** GTM (Event_ID_Constant) puts this in front of eventId; metaEventId is what Meta receives. */
const META_EVENT_PREFIX = '3c15e849-8868-444b-a1e2-ec7670abe2b6_';

function readCookie(name: string): string {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : '';
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

  // 0. Meta ids for deduplication + ad attribution (also saved with the lead for the CRM)
  if (typeof window !== 'undefined') {
    try {
      lead.eventId = lead.eventId || 'bps_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
      lead.metaEventId = META_EVENT_PREFIX + lead.eventId;
      lead.fbp = readCookie('_fbp');
      let fbc = readCookie('_fbc');
      if (!fbc) {
        const clid = new URLSearchParams(window.location.search).get('fbclid');
        if (clid) fbc = 'fb.1.' + Date.now() + '.' + clid;
      }
      lead.fbc = fbc;
    } catch {
      // Non-blocking
    }
  }

  // 1. Meta Lead - pushed to the dataLayer, NOT fbq() directly.
  // GTM (GTM-5QHKZKSP) turns generate_lead into a Meta Pixel "Lead" and the
  // Meta-enabled Conversions API sends the same event with the SAME event_id,
  // so browser + server are deduplicated. user_data (email / phone / name)
  // raises Event Match Quality; Meta hashes it before it leaves the browser.
  try {
    if (typeof window !== 'undefined') {
      const w = window as any;
      w.dataLayer = w.dataLayer || [];
      const nameParts = (lead.name || '').trim().split(/\s+/).filter(Boolean);
      const digits = (lead.phone || '').replace(/\D/g, '');
      const phone = digits.length === 10 ? '+91' + digits : digits ? '+' + digits.replace(/^0+/, '') : undefined;
      w.dataLayer.push({
        event: 'generate_lead',
        event_id: lead.eventId,
        /* Three branches, not two. A vendor registering is not a sales lead, and
           labelling it "Website Enquiry" would quietly pollute the Meta lead
           audience with people looking for work rather than buying. */
        lead_source:
          lead.formType === 'portfolio_download'
            ? '2026 Portfolio PDF Download'
            : lead.formType === 'vendor_registration'
              ? 'Vendor Registration'
              : 'Website Enquiry',
        content_category: lead.service || lead.purpose || 'Media Production',
        user_data: {
          email: lead.email ? lead.email.trim().toLowerCase() : undefined,
          phone_number: phone,
          address: {
            first_name: nameParts[0] ? nameParts[0].toLowerCase() : undefined,
            last_name: nameParts.length > 1 ? nameParts.slice(1).join(' ').toLowerCase() : undefined,
            country: 'in',
          },
        },
      });
      // Clear so later events on the page get their own ids / no stale user data.
      w.dataLayer.push({ event_id: undefined, user_data: undefined });
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
