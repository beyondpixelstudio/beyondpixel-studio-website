---
title: 'Live streaming a convocation: what actually decides whether it works'
description: 'Bandwidth, the PA feed, camera positions and what to do when the venue internet fails — a practical guide for universities and institutions in Odisha.'
seoTitle: 'Live streaming a convocation in Odisha | Beyond Pixel'
published: 2026-08-26
kicker: 'Event production'
hero: '/blog/convocation-camera-plan.svg'
heroAlt: 'Overhead plan of a convocation hall showing four camera positions, their coverage arcs, the audio feed from the PA desk and the encoder position'
tags: ['Live streaming', 'Events', 'Institutions']
featured: true
---

A convocation is the least forgiving thing a camera crew can be asked to cover. It happens
once, it runs to a published schedule, several hundred families are watching remotely, and
the one moment that matters to each of them lasts about four seconds and cannot be
repeated.

Most of what determines whether that goes well is decided in the week before, not on the
day. Here is what actually matters, in roughly the order it will bite you.

## Bandwidth is the thing that fails

More streams fail because of the venue's internet than for every other reason combined.

The working figure for a single 1080p stream is around **50 Mbps of dedicated upload**.
The important word is *dedicated*. Venue WiFi shared with a hall full of guests whose
phones are all uploading to Instagram is not 50 Mbps of anything. 4K, or streaming to
several platforms at once, wants 100 Mbps or more.

Three practical consequences:

**Get a wired line.** WiFi is a shared medium and its throughput collapses as the room
fills. A physical cable from the router to the encoder position removes the single largest
variable in the entire production.

**Test it on a weekday, at the same time of day.** An empty hall at 9am on a Tuesday is not
the same network as a full hall on convocation morning. Test with an actual upload, not a
speed-test app, and test for several minutes rather than several seconds — the interesting
failures are the intermittent ones.

**Carry a backup.** A bonded mobile connection that combines two or three cellular carriers
will not match a good wired line, but it will keep a 1080p stream alive, and it fails
independently of the venue. If the institution cannot guarantee the wired line in writing,
the backup is not optional.

## Audio is where amateur streams give themselves away

Audiences forgive a lot visually. They will not watch a stream they cannot hear.

The instinct is to point a camera at the stage and use its on-board microphone. In a hall
with a public address system, that microphone is recording the PA speakers, the air
conditioning, and the people sitting near the camera — not the person speaking.

**Take a feed directly from the PA desk.** The sound engineer already has a clean mix of
every microphone in the room. A single cable from their output to your recorder is the
difference between a broadcast and a bootleg.

**Then add your own.** A PA feed carries what goes through the PA, and nothing else. It
will miss anything spoken off-mic, and it dies with the desk. A separate microphone near
the lectern, recorded independently, is your insurance.

**Record audio separately, always.** Even when the stream is fine, an independent audio
recording gives the editor something to work with when a cable is knocked or a level is
wrong for two minutes.

## Camera positions, and why four is the usual answer

For a ceremony with the reading of names, coverage tends to settle into four positions:

**The wide.** Locked off, covering the whole stage, running continuously. It is the shot you
cut to when anything goes wrong anywhere else, and it must never be moved or stopped.

**The lectern camera.** A tight shot on whoever is speaking. Convocation addresses are long
and static; this is the shot the stream lives on for much of the ceremony.

**The names camera.** Positioned to catch each graduate as they cross and receive their
degree. This is the shot the families are watching for, and it is the hardest, because the
crossing is fast, the lighting on stage is usually built for the audience rather than the
camera, and there is no second take.

**The roamer.** Audience reactions, the procession, dignitaries arriving, detail. This is
where the highlights film comes from afterwards.

Positions have to be agreed with the institution *and* with security in advance, because on
the day they will be fixed. A camera operator who has to move during a dignitary's address
usually is not allowed to.

## Frame rate and power: two boring things that ruin footage

**Match frame rates across every camera.** 29.97, 30 and 60 are not interchangeable, and
mixing them produces footage that will not cut together cleanly and stutters when it is
conformed. Agree the frame rate before anybody rolls.

**Run on mains, not batteries.** A ceremony scheduled for ninety minutes will run to two
hours. Dummy batteries and AC adapters at every position; disable every camera's automatic
power-off, because a camera that sleeps during a lull will miss the thing that follows it.

## Where the stream goes

A single feed can be sent to several destinations at once — YouTube, Facebook, the
institution's own page — so the choice is not either/or. Two things to decide early:

**Public, unlisted or private?** Convocations usually want unlisted: reachable by anyone
with the link, not surfaced to the wider internet. Institutions occasionally want a private
page with access control, which is a different technical setup and needs deciding before the
day rather than on it.

**Each additional destination adds upload.** This comes straight back to the bandwidth
question, and it is the most common reason a stream that tested fine starts buffering.

## What happens when it fails anyway

Assume it will, at least briefly, and plan for the failure to be survivable.

**Record locally, independently of the stream.** Every camera records to its own card
regardless of what the network is doing. A connection drop then costs you those minutes of
live audience — it never costs you the footage, and the recording you publish afterwards is
complete.

**Automatic failover.** Where a mobile backup is in place, the encoder should switch to it
without a human noticing and deciding. In the moment nobody is watching the bonding
interface; they are watching the stage.

**Have someone whose only job is the stream.** Not the camera operator. Not the person
managing the crew. One person watching the outgoing feed, the audio levels and the
connection, with nothing else to do.

## The week before

A short version of everything above, as a schedule:

- **Site visit, 2–3 days ahead.** Power, network, camera positions, sightlines, where the
  audience will actually be standing rather than where the plan says they will be.
- **Running order from the organiser.** Who speaks, in what order, for roughly how long, and
  at what point the names begin.
- **Names list and pronunciation.** If graduate names are being shown on screen, the list
  has to be final and correct before the day.
- **Confirm the PA feed with the sound engineer**, not with the event coordinator.
- **Confirm the wired line**, in writing, with whoever controls the network.
- **Agree who can stop the stream**, and what the plan is if a dignitary's team asks you to.

## Why this is written this specifically

Bhubaneswar has a genuine concentration of institutions — universities, technical
institutes, medical colleges — that between them run a large number of these ceremonies
every year, alongside conferences, convocations and official functions where the same
constraints apply.

The failure modes are consistent and almost entirely preventable. Nearly all of them come
down to three things: the network was assumed rather than tested, the audio came off a
camera rather than the desk, and there was no independent recording when the connection
went.

None of those are expensive to fix. They just have to be decided before the hall fills up.
