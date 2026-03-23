// ── YouTube Player ─────────────────────────────────────────────────────

/** YouTube volume is 0–100; 50 = half of max output. */
const DEMO_VIDEO_VOLUME = 50;

function applyDemoVideoVolume() {
  if (ytReady && ytPlayer && typeof ytPlayer.setVolume === 'function') {
    ytPlayer.setVolume(DEMO_VIDEO_VOLUME);
  }
}

function ytPlayerVars() {
  const origin =
    typeof location !== 'undefined' &&
    location.origin &&
    location.origin !== 'null'
      ? location.origin
      : null;
  return {
    autoplay: 1,
    mute: 1,
    controls: 0,
    modestbranding: 1,
    rel: 0,
    showinfo: 0,
    iv_load_policy: 3,
    disablekb: 1,
    fs: 0,
    playsinline: 1,
    ...(origin ? { origin } : {}),
  };
}

function showVideoLoading() {
  const el = $('videoLoadingOverlay');
  if (!el) return;
  el.classList.add('visible');
  el.setAttribute('aria-busy', 'true');
}

function hideVideoLoading() {
  const el = $('videoLoadingOverlay');
  if (!el) return;
  el.classList.remove('visible');
  el.setAttribute('aria-busy', 'false');
}

function destroyYtPlayer() {
  ytReady = false;
  const p = ytPlayer;
  ytPlayer = null;
  if (p && typeof p.destroy === 'function') {
    try { p.destroy(); } catch (_) { /* ignore */ }
  }
}

function onPlayerError() {
  if (ytRetryCount >= YT_MAX_RETRIES) {
    hideVideoLoading();
    return;
  }
  ytRetryCount++;
  showVideoLoading();
  destroyYtPlayer();
  setTimeout(() => {
    if (typeof YT === 'undefined' || !YT.Player) return;
    if (!$('ytPlayer')) return;
    createYouTubePlayer();
  }, 600);
}

function createYouTubePlayer() {
  if (ytPlayer) return;
  showVideoLoading();
  ytPlayer = new YT.Player('ytPlayer', {
    videoId: 'qZRiKBCIdFo',
    playerVars: ytPlayerVars(),
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
      onError: onPlayerError,
    },
  });
}

// Called by YouTube IFrame API when it's ready.
// Coordinates with loader.js in case sections haven't been injected yet.
function onYouTubeIframeAPIReady() {
  if (window._sectionsLoaded) {
    createYouTubePlayer();
  } else {
    window._ytApiReadyFlag = true;
  }
}
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

function onPlayerReady() {
  ytRetryCount = 0;
  ytReady = true;
  hideVideoLoading();
  applyDemoVideoVolume();
  DURATION = ytPlayer.getDuration() || MOCK.session.duration;
  updateProgressUI();
}

function onPlayerStateChange(event) {
  const state = event.data;
  if (state === YT.PlayerState.PLAYING) {
    if (!demoStarted) {
      ytPlayer.pauseVideo();
      ytPlayer.seekTo(0);
      return;
    }
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
