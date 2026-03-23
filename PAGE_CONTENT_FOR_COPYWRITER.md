# PB Academy landing page — copy deck

Plain-text export of all current on-page copy for editing or reuse. Source: `index.html`, `sections/*.html`, `js/data.js`, and selected UI strings from `js/comments.js`, `js/waitlist.js`, and `js/modals.html`.

---

## Document / browser

- **Page title:** PB Academy | Professional Pickleball Coaching

---

## Intro animation (overlay pill)

- **Pill label:** The Game-Changing Academy

---

## Navigation

- **Brand:** PB Academy
- **Links:** Why It Works · Compare · Roadmap
- **Primary button:** Join Waitlist

---

## Hero

- **Pill (duplicate of intro):** The Game-Changing Academy
- **Headline:** Pro-level coaching. / Now in your pocket.
- **Subhead:** The first data-driven pickleball academy. We turn your match footage into a personalized growth roadmap using scientifically proven coaching frameworks.
- **Primary CTA:** Reserve Your Spot
- **Secondary CTA:** Watch Demo

---

## Demo section

### Editorial column (updates as the user steps through the demo)

**Slide titles and leads** (`DEMO_COPY` in `js/data.js` — synced with the carousel):

1. **Title:** Interactive Coaching Demo  
   **Lead:** Explore a real session. Watch how match footage is transformed into precise, time-coded feedback. Use the comment arrows to step through coach notes, or click the timeline to jump straight to a moment.

2. **Title:** On-Screen Annotations  
   **Lead:** See the red circle highlight exactly where the coach is pointing—head position, contact point, and follow-through. Step through each note with the arrows to see frame-by-frame feedback.

3. **Title:** Shot Technique Breakdown  
   **Lead:** Get detailed analysis of your forehand dink. Track head stability, paddle angle, and weight transfer with expert feedback. Navigate between coaching moments using the arrows or timeline markers.

4. **Title:** Precision Feedback  
   **Lead:** Focus on the details. Each coaching note links to the exact moment in your footage. Use the arrows to discover how small adjustments improve your game.

### Numbered feature list (static in `sections/demo.html`)

1. Time-coded video feedback  
2. On-screen drawing & annotations  
3. Detailed shot technique breakdown  

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
- **Sub-tabs:** Normal · Topspin · Slice  

### Technique checklist labels (`MOCK.technique` in `js/data.js`)

**Normal**

- Head stability  
- Arm extension  
- Knee bend  
- Paddle angle  
- Follow-through  
- Weight transfer  
- Contact point  

**Topspin**

- Low-to-high swing path  
- Wrist snap at contact  
- Paddle face angle (closed)  
- Follow-through height  

**Slice**

- High-to-low swing path  
- Open paddle face  
- Underspin contact  
- Soft hands at contact  

### Demo comments & annotations (mock session)

*Session metadata (for context; mostly not shown as marketing copy): date Sun, Mar 15, 2026 · shot Forehand Dink · student bach.nn11*

**Comment 1** (author: bien-nguyen, initials B)

- **Body:** Dont go up when hitting the ball  
- **Frame note 1:** Head Starting position before hitting the ball  
- **Frame note 2:** Head Ending position after shot. Your Head should stay at the same level  

**Comment 2** (author: bien-nguyen, initials B)

- **Body:** Keep your left foot on the ground while hitting the ball. You'll be more consistent and balanced for the next shot  

### Comment / frame UI microcopy

- Frame card label: Frame Detail  
- Button: VIEW FRAME  
- Modal default title: Frame Detail  
- Progress marker tooltip pattern: Comment at {time}  
- Carousel meta pattern: `{n} / {total}` (e.g. 1 / 4)  
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

## Compare (Traditional vs PB Academy)

- **Headline:** Traditional coaching vs. / PB Academy.

**Traditional**

- **Cognitive Overload** — Too many tips at once. No structure means the brain cannot prioritize, leading to low retention (< 30%).  
- **No Reinforcement** — No replay, no tracking. Skills decay fast due to the forgetting curve.  
- **Abstract Feedback** — "Do it like this" - vague instructions without visual grounding.

**PB Academy**

- **Structured Focus** — 2-3 focus points per session. Retain up to +200% more information.  
- **Continuous Progression** — Session replays and compounding lessons over time means every session builds on the last.  
- **Pinpoint Precision** — Frame-specific comments and visual drawings. Correct errors 2-3× faster.

---

## Waitlist

- **Headline:** Ready to level up?  
- **Subhead:** Be the first to know when PB Academy launches.

**Form**

- Placeholder: Your Name  
- Placeholder: Phone Number  
- Submit: Join Waitlist  

**Validation / success toasts** (`js/waitlist.js`)

- Please enter your name and phone number.  
- Thanks, {name}! You're on the waitlist. We'll be in touch soon.

---

## Footer

© 2026 PB Academy. All rights reserved.

---

## Notes for editing

- **Typos to fix in product copy:** roadmap Step 01 — “youre” → “your”; demo comment — “Dont” → “Don’t” (if you want standard spelling).  
- **Compare section:** statistic claims (e.g. 200%, < 30%, 2-3×) should be verified or qualified for legal/compliance if used publicly.  
- **Demo carousel:** four `DEMO_COPY` entries map to slides 0–3; if you change slide count in `js/data.js`, keep titles/leads aligned in code.
