// ── Mock Data ──────────────────────────────────────────────────────────
const MOCK = {
  session: {
    date: 'Sun, Mar 15, 2026',
    shot: 'Forehand Dink',
    student: 'bach.nn11',
    duration: 202,
  },
  comments: [
    {
      id: 2,
      author: 'bien-nguyen',
      initials: 'B',
      timestamp: 13,
      loopEnd: 15,
      text: "Keep your left foot on the ground while hitting the ball. You'll be more consistent and balanced for the next shot",
      frames: [],
    },
    {
      id: 1,
      author: 'bien-nguyen',
      initials: 'B',
      timestamp: 10,
      loopEnd: null,
      text: 'Dont go up when hitting the ball',
      frames: [
        {
          id: 'fd-1a',
          ts: 10,
          note: 'Head Starting position before hitting the ball',
          marker: { cx: 295, cy: 130, r: 28 },
        },
        {
          id: 'fd-1b',
          ts: 10,
          note: 'Head Ending position after shot. Your Head should stay at the same level',
          marker: { cx: 295, cy: 138, r: 26 },
        },
      ],
    },
  ],
  technique: {
    subCategories: [
      { id: 'normal', label: 'Normal' },
      { id: 'topspin', label: 'Topspin' },
      { id: 'slice', label: 'Slice' },
    ],
    items: {
      normal: [
        { label: 'Head stability', checked: false },
        { label: 'Arm extension', checked: false },
        { label: 'Knee bend', checked: false },
        { label: 'Paddle angle', checked: true },
        { label: 'Follow-through', checked: true },
        { label: 'Weight transfer', checked: false },
        { label: 'Contact point', checked: true },
      ],
      topspin: [
        { label: 'Low-to-high swing path', checked: false },
        { label: 'Wrist snap at contact', checked: false },
        { label: 'Paddle face angle (closed)', checked: true },
        { label: 'Follow-through height', checked: false },
      ],
      slice: [
        { label: 'High-to-low swing path', checked: true },
        { label: 'Open paddle face', checked: true },
        { label: 'Underspin contact', checked: false },
        { label: 'Soft hands at contact', checked: false },
      ],
    },
  },
};

// Demo copy per slide (slide 0 = intro, slides 1–2 = comments, last = shot technique)
const DEMO_COPY = [
  {
    title: 'Interactive Coaching Demo',
    lead: 'Explore a real session. Watch how match footage is transformed into precise, time-coded feedback. Use the comment arrows to step through coach notes, or click the timeline to jump straight to a moment.',
  },
  {
    title: 'On-Screen Annotations',
    lead: 'See the red circle highlight exactly where the coach is pointing—head position, contact point, and follow-through. Step through each note with the arrows to see frame-by-frame feedback.',
  },
  {
    title: 'Shot Technique Breakdown',
    lead: 'Get detailed analysis of your forehand dink. Track head stability, paddle angle, and weight transfer with expert feedback. Navigate between coaching moments using the arrows or timeline markers.',
  },
  {
    title: 'Precision Feedback',
    lead: 'Focus on the details. Each coaching note links to the exact moment in your footage. Use the arrows to discover how small adjustments improve your game.',
  },
];

// Derived constants (depend on MOCK)
const DEMO_TOTAL_SLIDES = MOCK.comments.length + 2; // +1 intro, +1 shot technique
const SHOT_TECHNIQUE_SLIDE_INDEX = MOCK.comments.length + 1;
