# Genesis Eduworld website — handoff

## Sitemap
Home · About · Programs and Skills · Placement Assistance · Impact and Achievements · Leadership and Team · Contact
(Primary nav: About, Programs, Placement Assistance, Impact, Team, Contact + "Send an enquiry" button. Logo links Home.)

## Page outline
- **Home**: headline + intro, Call / WhatsApp / Enquiry, "Who are you here as?" (4 routes), 6 of 12 focus areas, 4 impact figures with context, placement intro, service area, final CTA.
- **About**: story (2020, pandemic, online→offline), approach (3 cards), hoped-for outcomes (Skilled, Confident, Responsible, Employable, Future-Ready), links.
- **Programs**: 12 focus areas in 4 groups, each with call / WhatsApp / enquiry (pre-selects program in form).
- **Placement**: what it covers, named areas, how seekers enquire (3 ways), employer/partner route.
- **Impact**: 6 stat blocks, short timeline, "how to read these figures".
- **Team**: Dr. Lokesh Gupta (placeholder portrait), 4 trainers.
- **Contact**: phone, email, address, service area, what to include, enquiry form.

## Image plan
| Image | Status |
|---|---|
| Logo (assets/logo.png) | Original emblem extracted from PDF, unaltered. Wordmark "Genesis EDUWORLD" is live text beside it. |
| Team portraits (Bindu, Sunny, Jyoti, Sonia) | From PDF; cropped only. Replace with fresh headshots (see flags). |
| hero-students.jpg, workshop.jpg, seminar.jpg | TEMPORARY. Single clean pictures from the PDF; replace with real Genesis Eduworld photography. |
| Dr. Gupta portrait | MISSING: initials placeholder. |
| Other PDF pictures | Not used (collages / slide-embedded). |

## Before launch: confirm
1. WhatsApp number (buttons hidden until set in js/config.js).
2. Form delivery endpoint (js/config.js `formEndpoint`).
3. Dates/definitions for 6,000+, 55+ organizations, "hundreds" placed, "5–6 years".
4. Names of "nearby cities".
5. Placement partners: none named in PDF, so none shown.
6. Per-program audience, duration, fees, certifications: none in PDF, none shown.
7. Dr. Gupta photo and "Dr." title; trainers' surnames and fresh photos (Sonia's shows third-party branding; Jyoti's is full-length); certification names (NABET TTT, SQA).
8. "Proposed programme / Government collaboration" wording on About.
9. Map: link searches the written address only; confirm exact location before embedding a map.
10. Tagline "From inefficiency towards efficiency" and the "Pioneer Institute & Placement Agency" descriptor (not used).
Set `REVIEW_FLAGS:false` in js/config.js to hide all yellow notes and "Temporary image" tags.

## Notes
Fonts load from Google Fonts (Newsreader + Plus Jakarta Sans) with system fallbacks. Static HTML/CSS/JS, no build step.
