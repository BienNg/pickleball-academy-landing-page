// ── Playback Controls ──────────────────────────────────────────────────
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
