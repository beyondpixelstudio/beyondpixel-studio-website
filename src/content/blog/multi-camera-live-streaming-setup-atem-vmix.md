---
title: 'ATEM or vMix? What a multi-camera live streaming setup actually involves'
description: 'Hardware switcher or software? How a multi-camera live stream is built, what each piece does, and the questions that decide which setup your event needs.'
seoTitle: 'ATEM vs vMix: multi-camera live streaming explained'
published: 2026-09-11
kicker: 'Live production'
hero: '/work/cricket-coverage.webp'
heroAlt: 'An operator in headphones at the vision switcher during live cricket coverage, the match on the monitor in front of him'
tags: ['Live streaming', 'Multi-camera', 'Equipment']
service: 'live-event-streaming-bhubaneswar'
featured: true
---

"We'll stream it" can mean two completely different things. It can mean a phone on a tripod
at the back of the hall, sending one fixed view to YouTube. Or it can mean a switched
production: several cameras, an operator choosing between them live, the speaker's slides cut
in when they matter, names on screen, and a clean recording running underneath it all.

Both are a live stream. Only the second is a **multi-camera** stream, and the difference is
what an audience notices within the first minute — whether they are watching an event or
watching a camera watch an event.

This is how that second kind is built, and what the two names you will hear most often,
ATEM and vMix, actually refer to.

## What a multi-camera setup is made of

Every switched stream, whatever the brand of kit, has the same chain.

<figure>
  <img src="/blog/multi-camera-signal-flow.svg" alt="Signal flow of a multi-camera live stream: three cameras and a presenter laptop feeding a vision switcher, audio from the venue desk joining it, and the programme going to an encoder for the stream and to a separate recorder" width="1200" height="675" loading="lazy" decoding="async" />
  <figcaption>The same chain whatever the brand: sources into a switcher, audio from the desk, one programme out to the stream and, separately, to a recorder.</figcaption>
</figure>

1. **Cameras.** Usually a locked wide, a tight on the lectern or stage, and at least one that
   can move — to the audience, a panel, a performer.
2. **Other sources.** The presenter's laptop, taken as a direct feed so slides stay sharp;
   pre-made videos; a remote speaker on a call.
3. **The vision switcher.** Where an operator cuts between sources live. This is the heart of
   the setup, and it is the part ATEM and vMix are names for.
4. **Graphics.** Name straps, titles and logos keyed over the picture.
5. **Audio.** Taken from the venue's sound desk — the same signal the room is hearing —
   rather than from a camera microphone thirty metres from the stage.
6. **Encoder and destinations.** The finished programme compressed and sent to YouTube,
   Facebook, a private player, or several at once.
7. **A recorder.** A full-quality copy saved locally, independent of the internet, so the
   event survives even if the stream does not.

## ATEM: the hardware switcher

ATEM is Blackmagic Design's range of hardware vision switchers. Physically, it is a control
surface with a row of buttons per source: press one and that camera goes live.

What that buys you is **dedication**. A hardware switcher does one job, boots in seconds, and
does not care what else is running on a laptop. Latency through it is negligible, and the
physical buttons are fast and hard to press by accident. Smaller models take HDMI cameras;
larger ones take SDI, the locking broadcast connector that survives long cable runs across a
convention hall. Some models can also stream and record on their own.

The limits show up with complexity: layered graphics, instant replays and remote guests are
harder on a hardware switcher alone.

## vMix: the software production suite

vMix is software that turns a Windows PC into a production switcher. Cameras come in through
capture cards or over the network; everything else — titles, replays, picture-in-picture,
remote guests joining over the internet, streaming to several platforms — lives in the same
program.

What that buys you is **range**. One operator can run a layout with the slides full-frame and
the speaker in a corner box, bring a remote panellist in, and fire a replay. The trade is that
it is only as dependable as the computer underneath it, and vMix is licensed in editions that
differ in how many sources and what resolution they allow — so the edition has to match the
job.

## In practice, often both

The two are not really rivals. A common professional arrangement uses a hardware switcher to
cut the cameras — fast, physical, reliable — and feeds its output into vMix for graphics,
slide layouts and streaming. Each does the part it is best at.

**A hardware-led setup suits** a fixed stage, a ceremony run to a strict order, and an event
where reliability outranks graphics.

**A software-led setup suits** conferences heavy with slides, panels with remote speakers,
multiple destinations, and anything needing replays or complex layouts.

## How many cameras does an event need?

- **Two** is the minimum for a switched stream: a wide and a tight. It lets the operator cut
  away when the tight shot is being reframed.
- **Three** is the working standard for most conferences: wide, lectern, and one roaming
  for the audience and panel.
- **Four or more** for convocations, performances and multi-speaker panels, where the
  moments happen in more than one place at once.

More cameras need more operators or a remote-controlled head. Three cameras and one
overloaded operator is worse than two cameras run well.

## Questions to ask whoever quotes you

- **Is someone cutting live**, or is one camera simply being streamed?
- **Where does the audio come from?** The desk, or a camera microphone?
- **Is there a local recording** separate from the stream?
- **What happens if the computer or the internet fails?** There should be a backup path and
  an answer given without hesitation.
- **How are the slides taken?** A direct feed, or a camera pointed at the projector screen?

## Where we fit

We run a [multi camera live streaming setup in Bhubaneswar](/live-event-streaming-bhubaneswar/#multi-camera-setup)
on ATEM and vMix, sized to the event — hardware switching for ceremonies, software layouts
where slides and remote speakers need them, and a recording running throughout. For degree
ceremonies specifically, our guide to [live streaming a convocation](/blog/live-streaming-a-convocation-odisha/)
walks through the camera plan in detail.
