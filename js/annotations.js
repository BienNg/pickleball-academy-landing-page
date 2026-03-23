// ── Frame Annotation ───────────────────────────────────────────────────
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

// ── Draggable Annotation ───────────────────────────────────────────────
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
