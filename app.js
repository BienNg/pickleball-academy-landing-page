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
      id: 3,
      author: 'bien-nguyen',
      initials: 'B',
      timestamp: 20,
      loopEnd: null,
      text: 'Focus on keeping your paddle face angled slightly up for a softer dink.',
      frames: [],
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

// Demo copy per slide (slide 1 = no comment, slides 2–4 = comments 1–3)
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

// ── State ──────────────────────────────────────────────────────────────
let DURATION = MOCK.session.duration;
let currentTime = 0;
let isPlaying = false;
let playInterval = null;
let activeCommentId = null;
let visibleCommentIndex = -1;
let demoSlideIndex = 0; // 0 = no comment, 1–3 = comments 0–2
let commentCarouselAnimating = false;
let activeAnnotationTimeout = null;
let activeFrameId = null;
let activeTechSubTab = 'normal';
let skipIndicatorTimeout = null;
let ytPlayer = null;
let ytReady = false;
let progressRAF = null;

// ── DOM Helpers ────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

// ── Time Helpers ───────────────────────────────────────────────────────
function fmt(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function updateProgressUI() {
  const pct = DURATION > 0 ? (currentTime / DURATION) * 100 : 0;
  $('progressFill').style.width = pct + '%';
  $('progressThumb').style.left = pct + '%';
  $('videoCurrentTime').textContent = fmt(currentTime);
  const durEl = $('videoDuration');
  if (durEl) durEl.textContent = fmt(DURATION);
}

// ── YouTube Player ─────────────────────────────────────────────────────
function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player('ytPlayer', {
    videoId: 'qZRiKBCIdFo',
    playerVars: {
      controls: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
      disablekb: 1,
      fs: 0,
      playsinline: 1,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

function onPlayerReady() {
  ytReady = true;
  DURATION = ytPlayer.getDuration() || MOCK.session.duration;
  updateProgressUI();
}

function onPlayerStateChange(event) {
  const state = event.data;
  if (state === YT.PlayerState.PLAYING) {
    isPlaying = true;
    setPlayIcons(true);
    startProgressSync();
  } else if (state === YT.PlayerState.PAUSED) {
    isPlaying = false;
    setPlayIcons(false);
    stopProgressSync();
    syncTimeFromPlayer();
  } else if (state === YT.PlayerState.ENDED) {
    stopProgressSync();
    ytPlayer.seekTo(0, true);
    currentTime = 0;
    updateProgressUI();
    ytPlayer.playVideo();
  }
}

function startProgressSync() {
  stopProgressSync();
  const loopComment = MOCK.comments.find(
    (c) => c.id === activeCommentId && c.loopEnd !== null
  );
  function tick() {
    if (!ytReady || !isPlaying) return;
    currentTime = ytPlayer.getCurrentTime();

    if (loopComment && currentTime >= loopComment.loopEnd) {
      ytPlayer.seekTo(loopComment.timestamp, true);
      currentTime = loopComment.timestamp;
    }

    updateProgressUI();
    progressRAF = requestAnimationFrame(tick);
  }
  progressRAF = requestAnimationFrame(tick);
}

function stopProgressSync() {
  if (progressRAF) {
    cancelAnimationFrame(progressRAF);
    progressRAF = null;
  }
}

function syncTimeFromPlayer() {
  if (ytReady) {
    currentTime = ytPlayer.getCurrentTime();
    updateProgressUI();
  }
}

// ── Playback ───────────────────────────────────────────────────────────
function togglePlay() {
  if (!ytReady) return;
  if (isPlaying) {
    ytPlayer.pauseVideo();
  } else {
    hideAnnotation();
    ytPlayer.playVideo();
  }
}

function setPlayIcons(playing) {
  $('tcPlayIcon').style.display = playing ? 'none' : 'block';
  $('tcPauseIcon').style.display = playing ? 'block' : 'none';
}

function stopPlayback() {
  if (ytReady && isPlaying) {
    ytPlayer.pauseVideo();
  }
  isPlaying = false;
  stopProgressSync();
  setPlayIcons(false);
}

function adjustTime(delta) {
  if (!ytReady) return;
  currentTime = Math.max(0, Math.min(DURATION, currentTime + delta));
  ytPlayer.seekTo(currentTime, true);
  updateProgressUI();
  showSkipIndicator(delta);
}

function showSkipIndicator(delta) {
  const el = $('skipIndicator');
  if (!el) return;
  let label;
  if (Math.abs(delta) < 0.05) label = delta > 0 ? '+1f' : '−1f';
  else if (Math.abs(delta) === 1) label = delta > 0 ? '+1s' : '−1s';
  else if (Math.abs(delta) === 5) label = delta > 0 ? '+5s' : '−5s';
  else label = delta > 0 ? '+10s' : '−10s';
  el.textContent = label;
  el.classList.add('visible');
  clearTimeout(skipIndicatorTimeout);
  skipIndicatorTimeout = setTimeout(() => el.classList.remove('visible'), 600);
}

function seekToTime(t, showAnn) {
  currentTime = Math.max(0, Math.min(DURATION, t));
  if (ytReady) ytPlayer.seekTo(currentTime, true);
  updateProgressUI();
  if (showAnn) showFrameAnnotation();
}

/** Skip ytPlayer.seekTo when playhead is already at `target` (avoids redundant jump while paused). */
function seekToTimeUnlessAlreadyAt(target) {
  const t = ytReady ? ytPlayer.getCurrentTime() : currentTime;
  if (Math.abs(t - target) > 0.15) {
    seekToTime(target, false);
  } else {
    currentTime = Math.max(0, Math.min(DURATION, target));
    updateProgressUI();
  }
}

function seekFromBar(e) {
  const track = $('progressTrack');
  const rect = track.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const pct = Math.max(0, Math.min(1, x / rect.width));
  currentTime = pct * DURATION;
  if (ytReady) ytPlayer.seekTo(currentTime, true);
  updateProgressUI();
}

// ── Annotation ─────────────────────────────────────────────────────────
function showFrameAnnotation(marker) {
  if (isPlaying) return;
  const ann = $('frameAnnotation');
  if (marker) {
    updateAnnotationCircle($('annotationCircle'), marker);
  }
  ann.classList.add('visible');
  clearTimeout(activeAnnotationTimeout);
  activeAnnotationTimeout = setTimeout(hideAnnotation, 5000);
}

function hideAnnotation() {
  $('frameAnnotation').classList.remove('visible');
}

function updateAnnotationCircle(circleEl, marker) {
  if (!circleEl || !marker) return;
  circleEl.setAttribute('cx', marker.cx);
  circleEl.setAttribute('cy', marker.cy);
  circleEl.setAttribute('r', marker.r);
  const anim = circleEl.querySelector('animateTransform');
  if (anim) {
    anim.setAttribute('from', `0 ${marker.cx} ${marker.cy}`);
    anim.setAttribute('to', `360 ${marker.cx} ${marker.cy}`);
  }
  const inner = circleEl.nextElementSibling;
  if (inner && inner.tagName === 'circle') {
    inner.setAttribute('cx', marker.cx);
    inner.setAttribute('cy', marker.cy);
    inner.setAttribute('r', marker.r - 6);
  }
}

// ── Draggable annotation ───────────────────────────────────────────────
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let dragMarkerStart = { cx: 0, cy: 0 };

function initDraggableAnnotation() {
  const overlay = $('frameAnnotation');
  overlay.addEventListener('mousedown', onAnnotationDragStart);
  overlay.addEventListener('touchstart', onAnnotationDragStart, { passive: false });
  document.addEventListener('mousemove', onAnnotationDragMove);
  document.addEventListener('touchmove', onAnnotationDragMove, { passive: false });
  document.addEventListener('mouseup', onAnnotationDragEnd);
  document.addEventListener('touchend', onAnnotationDragEnd);
}

function onAnnotationDragStart(e) {
  if (!$('frameAnnotation').classList.contains('interactive')) return;
  isDragging = true;
  const pos = e.touches ? e.touches[0] : e;
  dragStartX = pos.clientX;
  dragStartY = pos.clientY;
  const circle = $('annotationCircle');
  dragMarkerStart = {
    cx: parseFloat(circle.getAttribute('cx')),
    cy: parseFloat(circle.getAttribute('cy')),
  };
  e.preventDefault();
}

function onAnnotationDragMove(e) {
  if (!isDragging) return;
  const pos = e.touches ? e.touches[0] : e;
  const wrapper = $('videoWrapper');
  const rect = wrapper.getBoundingClientRect();
  const scaleX = 430 / rect.width;
  const scaleY = 242 / rect.height;
  const dx = (pos.clientX - dragStartX) * scaleX;
  const dy = (pos.clientY - dragStartY) * scaleY;
  const newCx = Math.max(30, Math.min(400, dragMarkerStart.cx + dx));
  const newCy = Math.max(20, Math.min(220, dragMarkerStart.cy + dy));
  const marker = { cx: newCx, cy: newCy, r: parseFloat($('annotationCircle').getAttribute('r')) };
  updateAnnotationCircle($('annotationCircle'), marker);
  clearTimeout(activeAnnotationTimeout);
}

function onAnnotationDragEnd() {
  if (!isDragging) return;
  isDragging = false;
  clearTimeout(activeAnnotationTimeout);
  activeAnnotationTimeout = setTimeout(hideAnnotation, 5000);
}

// ── Comments ───────────────────────────────────────────────────────────
function activateComment(id, ts) {
  const idx = MOCK.comments.findIndex((c) => c.id === id);
  if (idx < 0) return;
  showDemoSlide(idx + 1, { instant: true, withMedia: true });
}

function applyCommentMediaState(comment) {
  if (!comment) return;
  if (isPlaying) stopPlayback();
  seekToTimeUnlessAlreadyAt(comment.timestamp);
  clearTimeout(activeAnnotationTimeout);
  hideAnnotation();
  updateLoopRange(comment);
}

const COMMENT_NAV_CLASS =
  'comment-nav-focused comment-nav-leave-left comment-nav-leave-right comment-nav-prep-from-right comment-nav-prep-from-left';

function stripCommentNavClasses(el) {
  COMMENT_NAV_CLASS.split(' ').forEach((c) => el.classList.remove(c));
}

function syncCommentFocusability() {
  $$('#commentsArea .comment-item').forEach((el) => {
    const focusable =
      el.classList.contains('active') || el.classList.contains('comment-nav-focused');
    el.tabIndex = focusable ? 0 : -1;
    if (focusable) {
      el.removeAttribute('aria-disabled');
    } else {
      el.setAttribute('aria-disabled', 'true');
    }
  });
}

const DEMO_TOTAL_SLIDES = MOCK.comments.length + 1;

function clearCommentListState() {
  visibleCommentIndex = -1;
  activeCommentId = null;
  demoSlideIndex = 0;
  $$('.comment-item').forEach((el) => {
    el.classList.remove('active');
    stripCommentNavClasses(el);
  });
  updateLoopRange(null);
  hideAnnotation();
  updateCommentsNavMeta();
  updateDemoCopy(0);
  syncCommentFocusability();
}

function updateCommentsNavMeta() {
  const meta = $('commentsNavMeta');
  if (!meta) return;
  if (DEMO_TOTAL_SLIDES === 0) {
    meta.textContent = 'No comments';
    return;
  }
  meta.textContent = `${demoSlideIndex + 1} / ${DEMO_TOTAL_SLIDES}`;
}

function updateDemoCopy(index) {
  const copy = DEMO_COPY[index];
  if (!copy) return;
  const titleEl = document.querySelector('.demo-kinetic-copy .demo-kinetic-title');
  const leadEl = document.querySelector('.demo-kinetic-copy .demo-kinetic-lead');
  if (titleEl) titleEl.textContent = copy.title;
  if (leadEl) leadEl.textContent = copy.lead;
}

function applyMediaSelectionInstant(commentIndex) {
  $$('.comment-item').forEach((el) => {
    el.classList.remove('active');
    stripCommentNavClasses(el);
  });
  if (commentIndex < 0 || commentIndex >= MOCK.comments.length) {
    syncCommentFocusability();
    return;
  }
  const el = $('comment-' + MOCK.comments[commentIndex].id);
  if (el) el.classList.add('active');
  syncCommentFocusability();
}

function applyNavFocusInstant(commentIndex) {
  $$('.comment-item').forEach((el) => {
    el.classList.remove('active');
    stripCommentNavClasses(el);
  });
  if (commentIndex < 0 || commentIndex >= MOCK.comments.length) {
    syncCommentFocusability();
    return;
  }
  const el = $('comment-' + MOCK.comments[commentIndex].id);
  if (el) el.classList.add('comment-nav-focused');
  syncCommentFocusability();
}

function showDemoSlide(slideIndex, options = {}) {
  const { instant = true, enterDirection = 1, withMedia = false } = options;
  const total = DEMO_TOTAL_SLIDES;
  if (total === 0) return;

  if (slideIndex < 0 || slideIndex >= total) {
    clearCommentListState();
    return;
  }

  const prevSlide = demoSlideIndex;
  const prevCommentIdx = visibleCommentIndex;
  demoSlideIndex = slideIndex;
  const commentIndex = slideIndex === 0 ? -1 : slideIndex - 1;

  if (slideIndex === 0) {
    activeCommentId = null;
    visibleCommentIndex = -1;
    hideAnnotation();
    updateLoopRange(null);
    $$('.comment-item').forEach((el) => {
      el.classList.remove('active');
      stripCommentNavClasses(el);
    });
    updateCommentsNavMeta();
    updateDemoCopy(0);
    syncCommentFocusability();
    return;
  }

  const comment = MOCK.comments[commentIndex];

  if (withMedia) {
    activeCommentId = comment.id;
    applyCommentMediaState(comment);
    visibleCommentIndex = commentIndex;
    applyMediaSelectionInstant(commentIndex);
    updateCommentsNavMeta();
    updateDemoCopy(slideIndex);
    const el = $('comment-' + comment.id);
    el && el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return;
  }

  activeCommentId = comment.id;
  applyCommentMediaState(comment);
  visibleCommentIndex = commentIndex;

  if (instant || prevSlide < 0 || prevSlide === slideIndex) {
    applyNavFocusInstant(commentIndex);
    updateCommentsNavMeta();
    updateDemoCopy(slideIndex);
    const el = $('comment-' + comment.id);
    el && el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return;
  }

  commentCarouselAnimating = true;
  const oldEl = prevCommentIdx >= 0 ? $('comment-' + MOCK.comments[prevCommentIdx].id) : null;
  const newEl = $('comment-' + comment.id);
  const goingForward = enterDirection > 0;

  if (oldEl) {
    oldEl.classList.remove('comment-nav-focused');
    oldEl.classList.add(goingForward ? 'comment-nav-leave-left' : 'comment-nav-leave-right');
  }
  if (newEl) {
    stripCommentNavClasses(newEl);
    newEl.classList.add(goingForward ? 'comment-nav-prep-from-right' : 'comment-nav-prep-from-left');
  }
  syncCommentFocusability();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (newEl) {
        newEl.classList.remove('comment-nav-prep-from-right', 'comment-nav-prep-from-left');
        newEl.classList.add('comment-nav-focused');
      }
      applyCommentMediaState(comment);
      applyNavFocusInstant(commentIndex);
      updateCommentsNavMeta();
      updateDemoCopy(slideIndex);
      syncCommentFocusability();
      newEl && newEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => {
        if (oldEl) {
          oldEl.classList.remove('comment-nav-leave-left', 'comment-nav-leave-right');
        }
        commentCarouselAnimating = false;
        syncCommentFocusability();
      }, 360);
    });
  });
}

function stepCommentCarousel(delta) {
  if (DEMO_TOTAL_SLIDES === 0 || commentCarouselAnimating) return;

  const next = (demoSlideIndex + delta + DEMO_TOTAL_SLIDES) % DEMO_TOTAL_SLIDES;
  if (next === demoSlideIndex) return;

  const enterDirection = delta > 0 ? 1 : -1;
  showDemoSlide(next, { instant: false, enterDirection, withMedia: next > 0 });
}

function refreshCommentListAfterRender() {
  $$('.comment-item').forEach((el) => {
    el.classList.remove('active');
    stripCommentNavClasses(el);
  });
  if (activeCommentId != null) {
    const idx = MOCK.comments.findIndex((c) => c.id === activeCommentId);
    if (idx >= 0) {
      visibleCommentIndex = idx;
      demoSlideIndex = idx + 1;
      const el = $('comment-' + activeCommentId);
      if (el) el.classList.add('active');
    }
  } else if (visibleCommentIndex >= 0 && visibleCommentIndex < MOCK.comments.length) {
    demoSlideIndex = visibleCommentIndex + 1;
    const c = MOCK.comments[visibleCommentIndex];
    const el = $('comment-' + c.id);
    if (el) el.classList.add('comment-nav-focused');
  } else {
    demoSlideIndex = 0;
  }
  updateCommentsNavMeta();
  updateDemoCopy(demoSlideIndex);
  syncCommentFocusability();
}

function updateLoopRange(comment) {
  const bar = $('loopRangeBar');
  const icon = $('loopIcon');
  if (!bar || !icon) return;
  if (comment && comment.loopEnd !== null) {
    const startPct = (comment.timestamp / DURATION) * 100;
    const endPct = (comment.loopEnd / DURATION) * 100;
    bar.style.left = startPct + '%';
    bar.style.width = (endPct - startPct) + '%';
    bar.style.display = 'block';
    icon.style.display = 'flex';
  } else {
    bar.style.display = 'none';
    icon.style.display = 'none';
  }
}

// ── View Frame ─────────────────────────────────────────────────────────
function viewFrame(frameId) {
  const frame = findFrame(frameId);
  if (!frame) return;
  if (isPlaying) stopPlayback();
  seekToTimeUnlessAlreadyAt(frame.ts);
  showFrameAnnotation(frame.marker);

  activeFrameId = frameId;
  $$('.frame-card').forEach((el) => el.classList.remove('active-frame'));
  const card = document.querySelector(`[data-frame-id="${frameId}"]`);
  if (card) card.classList.add('active-frame');
}

function findFrame(frameId) {
  for (const c of MOCK.comments) {
    for (const f of c.frames) {
      if (f.id === frameId) return f;
    }
  }
  return null;
}

function closeViewFrameModal() {
  $('viewFrameModal').classList.remove('open');
  activeFrameId = null;
  $$('.frame-card').forEach((el) => el.classList.remove('active-frame'));
}

// ── Tabs ───────────────────────────────────────────────────────────────
function switchTab(tab) {
  const isComments = tab === 'comments';
  $('tab-comments').classList.toggle('active', isComments);
  $('tab-shot').classList.toggle('active', !isComments);
  $('commentsArea').style.display = isComments ? 'block' : 'none';
  $('shotTechniquePanel').classList.toggle('visible', !isComments);
}

// ── Shot Technique ─────────────────────────────────────────────────────
function switchSubTab(tabId) {
  activeTechSubTab = tabId;
  $$('.sub-tab').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.subtab === tabId);
  });
  renderTechniqueItems();
}

function toggleTechniqueCheck(subId, label) {
  const items = MOCK.technique.items[subId];
  const item = items.find((i) => i.label === label);
  if (item) {
    item.checked = !item.checked;
    renderTechniqueItems();
    showToast(item.checked ? `✓ ${label}` : `Unchecked: ${label}`);
  }
}

function renderTechniqueItems() {
  const container = $('techniqueList');
  if (!container) return;
  const items = MOCK.technique.items[activeTechSubTab] || [];
  const sorted = [...items].sort((a, b) => a.checked - b.checked);

  container.innerHTML = sorted
    .map((item) => {
      const isChecked = item.checked;
      const dotClass = isChecked ? 'good' : 'needs-work';
      const statusClass = isChecked ? 'good' : 'needs-work';
      const statusText = isChecked ? 'Good' : 'Needs work';
      const checkClass = isChecked ? 'checked' : 'unchecked';
      const checkIcon = isChecked
        ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>'
        : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';

      return `
        <div class="technique-item">
          <div class="technique-item-left">
            <div class="technique-dot ${dotClass}"></div>
            <span class="technique-label">${item.label}</span>
          </div>
          <div class="technique-item-right">
            <span class="technique-status ${statusClass}">${statusText}</span>
            <button class="technique-checkbox ${checkClass}"
              onclick="toggleTechniqueCheck('${activeTechSubTab}', '${item.label.replace(/'/g, "\\'")}')"
            >${checkIcon}</button>
          </div>
        </div>
      `;
    })
    .join('');
}

// ── Comment Text Parsing (shot pills) ──────────────────────────────────
function parseCommentText(text) {
  return text.replace(
    /\[\[shot:([^\]]+)\]\]/g,
    '<span class="shot-pill">$1</span>'
  );
}

// ── Render Comments ────────────────────────────────────────────────────
function renderComments() {
  const container = $('commentsArea');
  if (!container) return;

  const itemsHtml = MOCK.comments
    .map((c) => {
      const tsLabel = c.loopEnd !== null
        ? `${fmt(c.timestamp)} <span class="ts-arrow">→</span> ${fmt(c.loopEnd)}`
        : fmt(c.timestamp);

      const framesHtml = c.frames
        .map(
          (f) => `
        <div class="frame-card" data-frame-id="${f.id}"
          onclick="event.stopPropagation(); viewFrame('${f.id}')">
          <div class="frame-card-header">
            <span class="frame-label-text">Frame Detail</span>
            <button class="view-frame-btn"
              onclick="event.stopPropagation(); viewFrame('${f.id}')">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="#8FB9A8"><polygon points="5,3 19,12 5,21"/></svg>
              VIEW FRAME
            </button>
            <div class="ctx-menu-wrapper" onclick="event.stopPropagation()">
              <button type="button" class="frame-card-more" aria-label="More" aria-disabled="true" tabindex="-1">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#8E8E93">
                  <circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="frame-card-text">${f.note}</div>
        </div>
      `
        )
        .join('');

      return `
      <div class="comment-item" id="comment-${c.id}"
        onclick="activateComment(${c.id}, ${c.timestamp})" role="button" tabindex="0">
        <div class="comment-header-row">
          <div class="comment-avatar">${c.initials}</div>
          <span class="comment-author">${c.author}</span>
          <div class="comment-actions-group" onclick="event.stopPropagation()">
            <button class="timestamp-btn" onclick="activateComment(${c.id}, ${c.timestamp})">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="#8FB9A8"><polygon points="5,3 19,12 5,21"/></svg>
              ${tsLabel}
            </button>
            <div class="ctx-menu-wrapper">
              <button type="button" class="more-btn" aria-label="More" aria-disabled="true" tabindex="-1">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#8E8E93">
                  <circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div class="comment-body">${parseCommentText(c.text)}</div>
        ${framesHtml}
      </div>
    `;
    })
    .join('');

  container.innerHTML = itemsHtml;
  refreshCommentListAfterRender();
}

// ── Render Progress Markers ────────────────────────────────────────────
function renderProgressMarkers() {
  const track = $('progressTrack');
  if (!track) return;
  MOCK.comments.forEach((c) => {
    const pct = (c.timestamp / DURATION) * 100;
    const marker = document.createElement('div');
    marker.className = 'progress-marker' + (c.loopEnd !== null ? ' double' : '');
    marker.style.left = pct + '%';
    marker.title = `Comment at ${fmt(c.timestamp)}`;
    marker.onclick = (e) => {
      e.stopPropagation();
      activateComment(c.id, c.timestamp);
    };
    track.appendChild(marker);
  });
}

// ── Toast ──────────────────────────────────────────────────────────────
let toastTimeout = null;
function showToast(message) {
  const toast = $('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2200);
}

// ── Keyboard ───────────────────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  const tag = document.activeElement.tagName;
  if (['INPUT', 'TEXTAREA'].includes(tag)) return;

  if (e.key === 'Escape') {
    closeViewFrameModal();
  }
  if (e.key === ' ' && tag !== 'BUTTON') {
    e.preventDefault();
    togglePlay();
  }
  if (e.key === 'ArrowLeft') adjustTime(-1 / 30);
  if (e.key === 'ArrowRight') adjustTime(1 / 30);
  if (e.key === 'q' || e.key === 'Q') adjustTime(-1);
  if (e.key === 'w' || e.key === 'W') adjustTime(1);
  if (e.key === 'a' || e.key === 'A') adjustTime(-5);
  if (e.key === 's' || e.key === 'S') adjustTime(5);
  if (e.key === 'y' || e.key === 'Y') adjustTime(-10);
  if (e.key === 'x' || e.key === 'X') adjustTime(10);
});

// ── Smooth page scroll (wheel / trackpad) ─────────────────────────────
function initSmoothPageScroll() {
  if (typeof Lenis === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lenis = new Lenis({ autoRaf: true, smoothWheel: true, lerp: 0.12 });

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') {
        e.preventDefault();
        lenis.scrollTo(0);
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target);
      }
    });
  });
}

// ── Waitlist Form ──────────────────────────────────────────────────────
function initWaitlistForm() {
  const form = document.getElementById('waitlistForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = form.querySelector('#waitlistName');
    const phoneInput = form.querySelector('#waitlistPhone');
    nameInput?.classList.remove('error');
    phoneInput?.classList.remove('error');
    const name = (nameInput?.value || '').trim();
    const phone = (phoneInput?.value || '').trim();
    let valid = true;
    if (!name) {
      nameInput?.classList.add('error');
      valid = false;
    }
    if (!phone) {
      phoneInput?.classList.add('error');
      valid = false;
    }
    if (!valid) {
      showToast('Please enter your name and phone number.');
      return;
    }
    // TODO: Send to backend (e.g. Formspree, Netlify Forms, or your API)
    showToast(`Thanks, ${name}! You're on the waitlist. We'll be in touch soon.`);
    form.reset();
  });
}

// ── Init ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSmoothPageScroll();
  initWaitlistForm();
  renderComments();
  renderProgressMarkers();
  renderTechniqueItems();
  updateProgressUI();
  initDraggableAnnotation();
  // Start with slide 1 (no comment selected) — "1 / 4"
  updateCommentsNavMeta();
  updateDemoCopy(0);
});
