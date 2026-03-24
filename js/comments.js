// ── Comment Activation ─────────────────────────────────────────────────
function activateComment(id, ts) {
  const idx = MOCK.comments.findIndex((c) => c.id === id);
  if (idx < 0) return;
  const commentOrdinal = idx + 1; // 1-based position in the rendered list
  const oneBasedSlide =
    COMMENT_CLICK_SLIDE_OVERRIDES[commentOrdinal] ?? (commentOrdinal + 1);
  const boundedOneBasedSlide = Math.max(
    1,
    Math.min(DEMO_TOTAL_SLIDES, oneBasedSlide)
  );
  showDemoSlide(boundedOneBasedSlide - 1, { instant: true, withMedia: true });
}

function handleFrameDetailClick(event, commentId, ts, frameId) {
  event.stopPropagation();
  const commentEl = $('comment-' + commentId);
  const isParentSelected =
    !!commentEl &&
    (commentEl.classList.contains('active') ||
      commentEl.classList.contains('comment-nav-focused'));

  if (!isParentSelected) {
    activateComment(commentId, ts);
    return;
  }

  viewFrame(frameId);
}

function applyCommentMediaState(comment) {
  if (!comment) return;
  if (isPlaying) stopPlayback();
  seekToTimeUnlessAlreadyAt(comment.timestamp);
  clearTimeout(activeAnnotationTimeout);
  hideAnnotation();
  updateLoopRange(comment);
}

// ── Comment Nav Carousel ───────────────────────────────────────────────
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

function clearCommentListState() {
  visibleCommentIndex = -1;
  activeCommentId = null;
  demoSlideIndex = 0;
  switchTab('comments');
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

  const primaryArrow = document.querySelector('.demo-mockup-arrow--primary');
  if (primaryArrow) {
    const showMockupArrow = demoSlideIndex === 1 || demoSlideIndex === 2;
    primaryArrow.classList.toggle('visible', showMockupArrow);
    primaryArrow.classList.toggle('demo-mockup-arrow--aim-comment1', demoSlideIndex === 2);
  }

  const frameDetailArrow = document.querySelector('.demo-mockup-arrow--frame-detail');
  if (frameDetailArrow) {
    frameDetailArrow.classList.toggle('visible', demoSlideIndex === 2);
  }
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

// ── Demo Slide Carousel ────────────────────────────────────────────────
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
  const commentIndex = slideIndex === 0 || slideIndex === SHOT_TECHNIQUE_SLIDE_INDEX ? -1 : slideIndex - 1;

  if (slideIndex === 0) {
    activeCommentId = null;
    visibleCommentIndex = -1;
    switchTab('comments');
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

  if (slideIndex === SHOT_TECHNIQUE_SLIDE_INDEX) {
    activeCommentId = null;
    visibleCommentIndex = -1;
    switchTab('shot');
    hideAnnotation();
    updateLoopRange(null);
    $$('.comment-item').forEach((el) => {
      el.classList.remove('active');
      stripCommentNavClasses(el);
    });
    updateCommentsNavMeta();
    updateDemoCopy(slideIndex);
    syncCommentFocusability();
    return;
  }

  switchTab('comments');
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

// ── Loop Range Bar ─────────────────────────────────────────────────────
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

// ── Render Comments ────────────────────────────────────────────────────
function renderComments() {
  const container = $('commentsArea');
  if (!container) return;

  const itemsHtml = MOCK.comments
    .map((c) => {
      const tsLabel = c.loopEnd !== null
        ? `${fmt(c.timestamp)}-${fmt(c.loopEnd)}`
        : fmt(c.timestamp);

      const framesHtml = c.frames
        .map(
          (f) => `
        <div class="frame-card" data-frame-id="${f.id}"
          onclick="handleFrameDetailClick(event, ${c.id}, ${c.timestamp}, '${f.id}')">
          <div class="frame-card-header">
            <span class="frame-label-text">Frame Detail</span>
            <button class="view-frame-btn"
              onclick="handleFrameDetailClick(event, ${c.id}, ${c.timestamp}, '${f.id}')">
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

// ── Progress Markers ───────────────────────────────────────────────────
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
