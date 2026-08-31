---
title: 'Live streams fail at the venue, not in the edit: what to check before the day'
description: 'Almost every failed live stream is a network failure, not a production one. The upload figures that matter, and the test to run a week before the day.'
seoTitle: 'Why live streams fail: venue internet | Beyond Pixel'
published: 2026-08-31
kicker: 'Live production'
hero: '/work/para-athletics-broadcast-gallery.webp'
heroAlt: 'Broadcast gallery with multi-camera switching desk and monitors during para athletics coverage in Bhubaneswar'
tags: ['Live streaming', 'Events', 'Bhubaneswar']
featured: true
---

When a live stream goes wrong in front of two thousand people, the cameras were almost never
the problem. The picture froze, the audio kept going, the platform dropped the connection and
the chat filled with the word *buffering*. That is a network failure, and it is the single
most common way a well-produced event ends up looking amateur.

The good news is that it is the most *predictable* failure in live production. Nearly all of
it is decidable a week in advance, from a laptop, before anyone books a camera.

## The number that matters is upload, and nobody quotes it

Every venue will tell you they have "high-speed internet". They are quoting download speed,
because that is the number on the bill and the number that matters for everything else they
do.

Streaming is the opposite direction. What you need is sustained **upload**, and the working
figures are these:

- **1080p at 30fps** wants roughly **4–6 Mbps** of encoder bitrate on H.264.
- Add headroom, because a stream that exactly fills the pipe fails the moment anything else
  uses it. Plan for **at least 8 Mbps upload** available to the encoder for a single 1080p
  feed.
- A second feed, a backup destination, or 4K multiplies that.

So "we have 100 Mbps" is not an answer until someone says how much of it goes *up*, and
whether it is shared with four hundred delegates on their phones.

## Why venue Wi-Fi is the usual culprit

Wi-Fi is a shared, contended, radio medium in a room that is about to fill with people, and
people absorb radio. A connection that tested beautifully in an empty hall at 9am can be
unusable at 11am with the hall full, for reasons that have nothing to do with the venue's
line at all.

Wired Ethernet to the encoder is the fix, and it is worth being unreasonable about it. A
cable run across a hall, taped down, is a small indignity next to a stream that drops during
the chief guest's address.

<figure>
  <img src="/work/bgu-convocation.webp" alt="Multi-camera live streaming setup covering a convocation ceremony at BGU, Bhubaneswar" width="1600" height="900" loading="lazy" decoding="async" />
  <figcaption>A convocation stream has one take. Everything that can be tested in advance, is.</figcaption>
</figure>

## The test to run, and when to run it

A speed test tells you what the line did for eight seconds. A stream needs it to hold for
three hours.

**Run a 10–15 minute sustained upload test at the venue, from the exact point the encoder
will sit, at a time of day when the building is busy.** Watch for the floor, not the peak —
the lowest sustained figure over that window is your real budget. If it dips below your
bitrate even once, it will dip during the event.

Do this a week out, not on the morning. A week gives the venue's IT time to open a port,
provision a wired drop, or admit that neither is possible — which is itself useful
information, in time to do something about it.

## What actually blocks streams, besides bandwidth

Three things, in roughly this order of frequency:

1. **Blocked outbound ports.** Corporate and campus networks frequently block RTMP. It looks
   exactly like a bandwidth problem and is not. Test the actual streaming protocol to the
   actual destination, not a browser speed test.
2. **Captive portals.** Guest Wi-Fi that needs a click-through login will drop the encoder
   silently when the session expires mid-event.
3. **A single shared uplink.** The line is fine; four hundred delegates are also on it.

## The backup, and why it has to be a different carrier

For anything that cannot be repeated — a convocation, an inauguration, a ministerial address
— a second path is not a luxury. Bonded cellular aggregates several mobile connections into
one stream, and it will carry a broadcast when the venue line dies.

One detail decides whether that backup is real: **the SIMs must be on different carriers.**
Bond four connections on one network and a single congested tower — at exactly the moment
two thousand people arrive and start using their phones on that same tower — takes all four
down together. Carrier diversity is the whole point of bonding.

## Audio is the other half, and it fails differently

Video freezing is obvious and forgivable. Bad audio makes a stream unwatchable while looking
completely fine.

Take audio from the venue's mixing desk, not from a camera at the back of the hall. A camera
mic thirty metres from a lectern records the room — the air conditioning, the coughing, the
chairs — with the speaker somewhere underneath it. A feed from the desk gives you the same
signal the PA is carrying, which is the one the audience in the room is actually hearing.

Then have someone listen to the outgoing stream on headphones for the entire event. Not the
desk output — the stream, as a viewer receives it. It is the only way to catch a problem that
exists only downstream of the encoder.

## The checklist, short enough to actually use

A week before:

- Sustained upload floor at the encoder position, measured over 15 minutes, at a busy hour.
- Wired drop confirmed, with the port tested to the real streaming destination.
- Named venue IT contact who will be reachable on the day.
- Backup path confirmed, on a different carrier to nothing else in the room.

On the day:

- Encoder on wired, cellular backup live and idling.
- Audio taken from the desk, confirmed by ear on the outgoing stream.
- One person whose only job is watching the stream as a viewer sees it.
- A recording running locally, independent of the stream, so the event survives a total
  network loss.

That last line is the one that has saved the most events. If the stream dies, a local
recording means you still have the ceremony — and an upload an hour later is a
disappointment, not a disaster.

## The honest limit

We test the line in advance and carry a backup where a venue cannot guarantee bandwidth, and
that combination has kept our streams up. What nobody can guarantee is a third party's
internet connection. Anyone who promises otherwise is promising something they do not
control.

What we can promise is that the failure modes above are checked before your date, and that
if a venue's network cannot carry your event, you will hear it from us early enough to fix it.
