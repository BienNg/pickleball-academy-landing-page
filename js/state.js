// ── DOM Helpers ────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

// ── Mutable App State ──────────────────────────────────────────────────
let DURATION = MOCK.session.duration;
let currentTime = 0;
let isPlaying = false;
let demoStarted = false;
let activeCommentId = null;
let visibleCommentIndex = -1;
let demoSlideIndex = 0;
let commentCarouselAnimating = false;
let activeAnnotationTimeout = null;
let activeFrameId = null;
let activeTechSubTab = 'normal';
let skipIndicatorTimeout = null;
let ytPlayer = null;
let ytReady = false;
let progressRAF = null;
let ytRetryCount = 0;
const YT_MAX_RETRIES = 2;
