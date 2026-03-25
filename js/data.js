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
      loopEnd: 27,
      text: "Keep your left foot on the ground while hitting the ball. You'll be more consistent and balanced for the next shot.",
      frames: [],
    },
    {
      id: 1,
      author: 'bien-nguyen',
      initials: 'B',
      timestamp: 48,
      loopEnd: 50,
      text: 'Dont go up when hitting the ball to reduce popups.',
      frames: [
        {
          id: 'fd-1a',
          ts: 48 + (12 / 30),
          note: 'Head Starting position before hitting the ball.',
          marker: { cx: 110, cy: 70, r: 16 },
        },
        {
          id: 'fd-1b',
          ts: 49,
          note: 'Jump between the first frame and this frame and notice how much you Head moves up. Your Head should stay at the same level.',
          marker: { cx: 150, cy: 45, r: 16 },
        },
      ],
    },
  ],
  technique: {
    subCategories: [
      { id: 'normal', label: 'Normal' },
      { id: 'topspin', label: 'Topspin' },
      { id: 'slice', label: 'Slice' },
      { id: 'agility', label: 'Footwork & Positioning' },
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
        { label: "Lead leg behind the ball (don't reach sideways)", checked: true },
        { label: 'Balanced stance with knees bent', checked: false },
        { label: 'Paddle in front of body. Minimal backswing', checked: true },
        { label: 'Eyes on ball', checked: true },
        { label: "Head stable (don't rise up during shot)", checked: false },
        { label: 'Paddle tip drops below the ball. Butt cap facing upward -> confirms paddle head is low', checked: true },
        { label: 'Paddle face slightly open', checked: true },
        { label: 'Contact Ball in front of body', checked: true },
        { label: 'Brush up the back of the ball for topspin', checked: true },
        { label: 'Swing low -> high', checked: true },
        { label: 'Motion mainly from the shoulder, not wrist', checked: true },
        { label: 'Think smooth lift, not roll or flick', checked: true },
        { label: 'Optional cue: small C-shape with elbow to accelerate upward', checked: true },
        { label: "Don't reach for the ball. Hit the ball while it is falling down", checked: false },
      ],
      slice: [
        { label: 'Continental grip', checked: false },
        { label: "Lead leg behind the ball (don't reach)", checked: false },
        { label: 'Paddle in front of body', checked: false },
        { label: 'Balanced stance with bent knees', checked: false },
        { label: 'Eyes on the ball', checked: false },
        { label: "Head stable (don't rise during contact). Imagine a roof above your head (don't pop up)", checked: false },
        { label: 'Paddle face open (tilted upward)', checked: false },
        { label: 'Wrist set and stable', checked: false },
        { label: 'Paddle angle stays the same throughout the shot', checked: false },
        { label: 'Contact in front of body', checked: false },
        { label: 'Smooth controlled swing (no hacking or chopping)', checked: false },
        { label: 'Swing driven by shoulders and hips, not wrist', checked: false },
        { label: 'Think Nike swoosh shape swing path', checked: false },
      ],
      agility: [
        { label: 'Ready position (body position, wide stance)', checked: false },
        { label: 'Split step before contact (with right timing)', checked: false },
        { label: 'Move early', checked: false },
        { label: 'Small adjustment steps', checked: false },
        { label: 'Stay balanced', checked: false },
        { label: 'Recover quickly', checked: false },
        { label: 'Stay low at kitchen', checked: false },
        { label: 'Move with partner', checked: false },
        { label: 'Court positioning', checked: false },
        { label: 'Controlled transition forward (low)', checked: false },
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
    title: 'Shot Loop Replay',
    lead: 'Watch the exact moment on repeat—looped seamlessly around the key mistake the coach highlighted. Focus on one detail at a time, with the coach’s voice guiding what to adjust—timing, positioning, and execution—until it clicks.',
  },
  {
    title: 'Shot Technique Breakdown',
    lead: 'Get a detailed breakdown of any shot in your session. Coach notes are pinned to exact frames and on-screen markers, so you can see precisely what to look for at each moment. Track head stability, paddle angle, weight transfer, and more with expert feedback.',
  },
  {
    title: 'Complete Technique Checklist',
    lead: 'Every shot has key technique cues that must be recognized and executed correctly. We built a comprehensive checklist for each shot, and your coach marks what you are doing well and what still needs work. This gives you a complete, up-to-date overview of your technique at all times.',
  },
];

// Optional 1-based comment-position -> 1-based slide-number overrides for click navigation.
// Default behavior (when no override exists): comment N opens slide N+1.
const COMMENT_CLICK_SLIDE_OVERRIDES = {
  1: 2, // first comment -> slide 2
  3: 3, // third comment -> slide 3
};

// Derived constants (depend on MOCK)
const DEMO_TOTAL_SLIDES = MOCK.comments.length + 2; // +1 intro, +1 shot technique
const SHOT_TECHNIQUE_SLIDE_INDEX = MOCK.comments.length + 1;
