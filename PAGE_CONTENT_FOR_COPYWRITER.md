# PB Academy landing page — copy deck

Plain-text export of all current on-page copy for editing or reuse. Source: `index.html`, `sections/*.html` (load order in `js/loader.js`), `js/data.js`, and selected UI strings from `js/comments.js`, `js/waitlist.js`, and `sections/modals.html`.

**Section order on the live page:** intro overlay → nav → **main:** hero, demo, why it works, roadmap, the system, compare, target audience, coaching availability, waitlist (includes FAQ) → footer → modals.

---

## Document / browser

- **Page title:** PB Academy | Professional Pickleball Coaching

---

## Intro animation (overlay pill)

- **Pill label:** The Game-Changing Academy

---

## Navigation

- **Brand:** PB Academy
- **Links:** Why It Works · Roadmap · The System · Compare · Ho-Chi-Minh-City (badge: **New** on the HCMC link)
- **Primary button:** Join Waitlist

---

## Hero

- **Pill (duplicate of intro):** The Game-Changing Academy
- **Headline:** Pro-level coaching. *(The word “coaching” uses an inline pickleball image in place of the letter “o” in the UI.)* / Built for real improvement.
- **Subhead:** Get recorded training sessions and personalized feedback, and follow a clear roadmap — so you stop practicing random things and start progressing faster.
- **Primary CTA:** Reserve Your Spot
- **Secondary CTA:** Watch Demo

---

## Demo section

### Editorial column — before demo starts (`#demoStartPrompt`)

- **Eyebrow:** Guided Demo
- **Title:** Tap Start Demo on the phone to begin.
- **Lead:** Experience the same polished flow your students see: instant session playback, coach notes tied to exact moments, and actionable technique guidance.
- **Button:** Start Demo

### Editorial column — default / carousel copy

**Slide titles and leads** (`DEMO_COPY` in `js/data.js` — synced with the carousel):

1. **Title:** Interactive Coaching Demo  
   **Lead:** Explore a real session. Watch how match footage is transformed into precise, time-coded feedback. Use the comment arrows to step through coach notes, or click the timeline to jump straight to a moment.

2. **Title:** Shot Loop Replay  
   **Lead:** Watch the exact moment on repeat—looped seamlessly around the key mistake the coach highlighted. Focus on one detail at a time, with the coach’s voice guiding what to adjust—timing, positioning, and execution—until it clicks.

3. **Title:** Shot Technique Breakdown  
   **Lead:** Get a detailed breakdown of any shot in your session. Coach notes are pinned to exact frames and on-screen markers, so you can see precisely what to look for at each moment. Track head stability, paddle angle, weight transfer, and more with expert feedback.

4. **Title:** Complete Technique Checklist  
   **Lead:** Every shot has key technique cues that must be recognized and executed correctly. We built a comprehensive checklist for each shot, and your coach marks what you are doing well and what still needs work. This gives you a complete, up-to-date overview of your technique at all times.

### Numbered feature list (static beside default carousel copy)

1. Time-coded video feedback  
2. On-screen drawing & annotations  
3. Detailed shot technique breakdown  

### Comment carousel toolbar

- **aria-label:** Step through comments  
- **Button labels:** Previous comment · Next comment *(via `aria-label`)*

### App splash (inside phone mockup)

- **Logo wordmark:** PB / Academy  
- **Tagline:** Interactive Coaching Demo  
- **Button:** Start Demo  

### Video / player UI labels

- Loading: Loading video…  
- Timeline label: Loop  
- Time control buttons: −1f · −10s · −5s · −1s · +1s · +5s · +10s · +1f  
- Play control: Play/Pause (Space) — *aria-label*

### Tabs

- Comments  
- Shot technique  

### Shot technique panel

- **Title:** Forehand Dink  
- **Subtitle:** Shot technique analysis  
- **Sub-tabs (visible in markup):** Topspin · Slice · Footwork & Positioning  

### Technique checklist labels (`MOCK.technique` in `js/data.js`)

*`Normal` exists in data; the visible sub-tab buttons in `sections/demo.html` are Topspin, Slice, and Footwork & Positioning only.*

**Normal**

- Head stability  
- Arm extension  
- Knee bend  
- Paddle angle  
- Follow-through  
- Weight transfer  
- Contact point  

**Topspin**

- Lead leg behind the ball (don't reach sideways)  
- Balanced stance with knees bent  
- Paddle in front of body. Minimal backswing  
- Eyes on ball  
- Head stable (don't rise up during shot)  
- Paddle tip drops below the ball. Butt cap facing upward -> confirms paddle head is low  
- Paddle face slightly open  
- Contact Ball in front of body  
- Brush up the back of the ball for topspin  
- Swing low -> high  
- Motion mainly from the shoulder, not wrist  
- Think smooth lift, not roll or flick  
- Optional cue: small C-shape with elbow to accelerate upward  
- Don't reach for the ball. Hit the ball while it is falling down  

**Slice**

- Continental grip  
- Lead leg behind the ball (don't reach)  
- Paddle in front of body  
- Balanced stance with bent knees  
- Eyes on the ball  
- Head stable (don't rise during contact). Imagine a roof above your head (don't pop up)  
- Paddle face open (tilted upward)  
- Wrist set and stable  
- Paddle angle stays the same throughout the shot  
- Contact in front of body  
- Smooth controlled swing (no hacking or chopping)  
- Swing driven by shoulders and hips, not wrist  
- Think Nike swoosh shape swing path  

**Footwork & Positioning**

- Ready position (body position, wide stance)  
- Split step before contact (with right timing)  
- Move early  
- Small adjustment steps  
- Stay balanced  
- Recover quickly  
- Stay low at kitchen  
- Move with partner  
- Court positioning  
- Controlled transition forward (low)  

### Demo comments & annotations (mock session)

*Session metadata (context; not primary marketing copy): date Sun, Mar 15, 2026 · shot Forehand Dink · student bach.nn11*

*Render order follows `MOCK.comments` in `js/data.js` (array order).*

**Comment 1** (author: bien-nguyen, initials B)

- **Body:** Keep your left foot on the ground while hitting the ball. You'll be more consistent and balanced for the next shot.

**Comment 2** (author: bien-nguyen, initials B)

- **Body:** Dont go up when hitting the ball to reduce popups.  
- **Frame note 1:** Head Starting position before hitting the ball.  
- **Frame note 2:** Jump between the first frame and this frame and notice how much you Head moves up. Your Head should stay at the same level.

### Comment / frame UI microcopy

- Frame card label: Frame Detail  
- Button: VIEW FRAME  
- Modal default title: Frame Detail  
- Success modal title (waitlist): You’re on the list  
- Success modal dismiss: Done  
- Progress marker tooltip pattern: Comment at {time}  
- Carousel meta pattern: `{n} / {total}` (e.g. 1 / 2 with two comments)  
- Empty state: No comments  

---

## Why it works

- **Section headline:** Designed for rapid growth.  
- **Section subhead:** Why video-based coaching is scientifically proven to accelerate learning and retention.

**Card 1 — Immediate, Visual Feedback**  
See errors that are hard to feel in real time. We provide objective feedback, not just coach opinion.

**Card 2 — Faster Learning**  
Review movements frame-by-frame like professional athletes do.  
*Stat line:* 200% faster

**Card 3 — Tactical IQ**  
Improve decision-making by making patterns and opportunities visible.

**Card 4 — Self-Awareness & Reflection**  
Develop metacognition—understanding your own performance—a skill strongly linked to long-term improvement.

---

## Roadmap (“The path to mastery”)

- **Headline:** The path to mastery.  
- **Subhead:** Your journey from baseline to peak performance, documented in real-time metrics.

**Step 01 — Capture**  
We capture youre current level for every skill - Dinks, Drives, Drops, Serves, etc. In the app we analyze your performance for every skill to define your true baseline.

**Step 02 — Decode**  
Every skill is broken down into clear insights, with a focused roadmap for improvement.

**Step 03 — Build**  
We train your priority skills through structured, recorded sessions.

**Step 04 — Advance**  
You review your progress and move forward with a refined game.

---

## The System (`#system`)

- **Overline:** A Complete System  
- **Headline:** Built for rapid improvement.  
- **Subhead:** Everything you need to understand your mistakes and fix them—all in one place.

**Carousel card 1 — Structured Coaching**  
*Illustration labels:* Max Players · 3 · Focused Training  
**Title:** Structured Coaching  
**Body:** Train in small groups with a clear focus each session. No randomness—every session targets specific improvements.

**Carousel card 2 — Recorded Sessions**  
*Illustration labels:* Video Analysis  
**Title:** Recorded Sessions  
**Body:** Every session is recorded so you can review exactly what happened. See your mistakes. Understand them. Fix them.

**Carousel card 3 — Time-Coded Feedback**  
*Illustration sample quotes:* “Drop your paddle head earlier here.” · “Great spacing on this rally.”  
**Title:** Time-Coded Feedback  
**Body:** Get precise coaching tied to exact moments in your footage. No vague advice—just clear, actionable corrections.

**Carousel card 4 — Improvement Roadmap**  
*Illustration sample items:* Third Shot Drop — Mastered · Dink Patience — Next Goal  
**Title:** Improvement Roadmap  
**Body:** Know exactly what to work on next. Your roadmap evolves as you improve—so you’re never guessing.

**Carousel card 5 — Progress Tracking**  
*Illustration label:* Shot Consistency *(hover chip example: ↑24%)*  
**Title:** Progress Tracking  
**Body:** Track how your game develops across sessions. See patterns, improvements, and what still needs work.

**Carousel card 6 — App Access Included**  
*Illustration label:* Included  
**Title:** App Access Included  
**Body:** Everything in one place: Session recordings, coach feedback, your roadmap, and future video lessons.

**Mobile hint:** Swipe to explore *(with swipe icon)*

**Carousel dots:** Six slides — control `aria-label`s “Go to slide 1” … “Go to slide 6”

---

## Compare (Traditional vs PB Academy)

- **Headline:** Traditional coaching vs. / PB Academy.

**Traditional**

- **Cognitive Overload** — Too many tips at once. No structure means the brain cannot prioritize, leading to low retention (< 30%).  
- **No Reinforcement** — No replay, no tracking. Skills decay fast due to the forgetting curve.  
- **Abstract Feedback** — "Do it like this" - vague instructions without visual grounding.

**PB Academy**

- **Structured Focus** — 2-3 focus points per session. Retain **up to +200% more** information. *(Emphasis styled in UI.)*  
- **Continuous Progression** — Session replays and compounding lessons over time means every session builds on the last.  
- **Pinpoint Precision** — Frame-specific comments and visual drawings. Correct errors **2-3× faster**. *(Emphasis styled in UI.)*

---

## Target audience (`#target-audience`)

- **Overline:** Who it's for  
- **Headline:** Not for everyone. / And that’s the point.  
- **Subhead:** We optimize for players who actually want to improve.

**Column — Not for you if…**

- You just want to casually hit balls without focusing on improvement  
- You prefer random tips instead of a structured system  
- You don’t want to review your own gameplay on video  
- You’re not interested in feedback or correction  
- You expect instant results without consistent effort  

**Footer line:** This approach will feel too structured.

**Column — This is for you if…**

- You want a clear, step-by-step path to improvement  
- You like understanding why something works  
- You’re willing to review your sessions and learn from them  
- You want honest, precise feedback—not vague advice  
- You’re serious about getting better, not just playing more  

**Footer line:** This is where real progress happens.

---

## Coaching Availability

- **Overline (pill):** Coaching Availability  
- **Headline:** Now available in / Ho Chi Minh City 🇻🇳 *(two lines in layout)*  
- **Subhead / body (single block):** Join structured, small-group coaching designed for rapid improvement. Train alongside players at your level while receiving focused, personalized feedback.

**Stat card — group size**

- **Number:** 3  
- **Label:** Players  
- **Sub:** per group  

**Stat card — frequency**

- **Number:** 1–2  
- **Label:** Sessions  
- **Sub:** per week  

**Bottom band**

- **Title:** 4-Week structured program  
- **Supporting copy:** Follow a proven curriculum designed for noticeable progress. Every session is planned, targeted, and focused.  
- **CTA (with notifications icon):** Limited spots available  

---

## Waitlist

- **Headline:** Ready to level up?  
- **Subhead:** Be the first to know when PB Academy launches.

**Form**

- Placeholder: Your Name  
- Phone: international format input (`intl-tel-input`; no fixed placeholder string in markup — default country Vietnam)  
- **Playing experience** (select, required):  
  - Placeholder option: How long have you been playing?  
  - Beginner  
  - Over 6 months  
  - Over a year  
  - Over 2 years  
- Submit: Join Waitlist  

**Validation / success** (`js/waitlist.js`, `sections/modals.html`)

- Toast: Please enter a valid phone number.  
- Toast: Please fill in your name, phone number, and playing experience.  
- Toast (submit error): Something went wrong. Please try again in a moment.  
- Success modal message: Thanks, {name}. We'll contact you soon with updates.

---

## FAQ (`#faq`, in `sections/waitlist.html`)

- **Section title:** Frequently Asked Questions

**1. How is PB Academy different from normal coaching?**  
Traditional coaching is often unstructured—lots of tips, little clarity, and no way to track progress.  
**PB Academy is built around a clear system:**  
- Every session is recorded  
- You get time-coded feedback  
- You follow a structured roadmap  
This means you always know what to improve and how to improve it.

**2. What happens in a coaching session?**  
Each session is designed for focused improvement:  
- You train in a small group (3 players)  
- The coach focuses on 2–3 key improvements  
- Your session is recorded with coaching feedback  
After the session, you can review everything inside the app.

**3. Do I get access to my session recordings?**  
**Yes.**  
Every session is recorded and uploaded to the app, where you can:  
- Rewatch key moments  
- Review coach feedback  
- Track your progress over time  
This is a core part of how you improve faster.

**4. How does the improvement roadmap work?**  
We don’t guess what you should work on.  
- Your first session establishes your baseline  
- Each skill is analyzed  
- You get a clear roadmap with priorities  
**You always know:**  
- What to train next  
- What matters most  
- How you’re progressing  

**5. Who is this for?**  
PB Academy is designed for:  
- Beginners who want to learn the right way  
- Intermediate players stuck at the same level  
- Advanced players who want structured improvement  
If you’re serious about improving—not just playing—this is for you.

**6. How are the sessions structured?**  
- 3 players per group  
- 1–2 sessions per week  
- 4-week structured program  
**This format ensures:**  
- Enough repetitions  
- Personalized feedback  
- Consistent progression  

**7. Do you offer private coaching?**  
Currently, we focus on small-group sessions because they provide:  
- Better learning dynamics  
- More realistic game situations  
- Higher coaching efficiency  
Private sessions may be added later.

**8. Where are the sessions located?**  
We currently offer coaching in Ho Chi Minh City, Vietnam.  
Exact court details are shared after booking confirmation.

**9. How do I join?**  
You can join by reserving your spot through the waitlist.  
**Once spots open:**  
- You’ll be contacted  
- You’ll get session availability  
- You can start your first program  

**10. Is the app included?**  
**Yes.**  
The app is included for all coaching students and gives you:  
- Session recordings  
- Coaching feedback  
- Progress tracking  
- Video lessons (coming soon)  

**Closing block**

- **Headline:** Still have questions?  
- **Subhead:** Join the waitlist and we’ll personally walk you through everything.  
- **Button:** Join the Waitlist  

---

## Footer

© 2026 PB Academy. All rights reserved.

---

## Notes for editing

- **Typos to fix in product copy:** roadmap Step 01 — “youre” → “your”; demo comment — “Dont” → “Don’t”; frame note — “you Head” → “your head” (if standardizing).  
- **Compare section:** statistic claims (e.g. 200%, < 30%, +200%, 2-3×) should be verified or qualified for legal/compliance if used publicly.  
- **Demo carousel:** four `DEMO_COPY` entries map to slides 0–3; `DEMO_TOTAL_SLIDES` in `js/data.js` should stay aligned with slide count and comment list length (`MOCK.comments.length + 2`).
