// ── Section Loader ─────────────────────────────────────────────────────
// Fetches each HTML section in order and injects them into the page.
// After injection, initializes the app and resolves the YouTube API race condition.

const SECTION_FILES = [
  'sections/intro-overlay.html',
  'sections/nav.html',
  'sections/hero.html',
  'sections/demo.html',
  'sections/why-it-works.html',
  'sections/roadmap.html',
  'sections/system.html',
  'sections/compare.html',
  'sections/target-audience.html',
  'sections/coaching.html',
  'sections/waitlist.html',
  'sections/footer.html',
  'sections/modals.html',
];

async function fetchSection(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return await res.text();
  } catch (err) {
    console.error(`[loader] Failed to load section: ${path}`, err);
    return `<!-- Section failed to load: ${path} -->`;
  }
}

async function loadSections() {
  const htmlParts = await Promise.all(SECTION_FILES.map(fetchSection));

  // Sections 0–1 (intro-overlay, nav) go directly into body root.
  // Sections 2–7 (hero → waitlist) go inside <main>.
  // Sections 8–9 (footer, modals) go after <main>.
  const root = document.getElementById('app-root');
  const mainSectionCount = 9; // hero, demo, why-it-works, roadmap, system, compare, target-audience, coaching, waitlist
  const mainStartIdx = 2;

  root.innerHTML =
    htmlParts.slice(0, mainStartIdx).join('\n') +
    '<main>' +
    htmlParts.slice(mainStartIdx, mainStartIdx + mainSectionCount).join('\n') +
    '</main>' +
    htmlParts.slice(mainStartIdx + mainSectionCount).join('\n');

  // Sections are now in the DOM — signal other modules
  window._sectionsLoaded = true;

  // Initialize the app
  appInit();

  // If the YouTube IFrame API finished loading before sections were ready, create the player now
  if (window._ytApiReadyFlag) {
    createYouTubePlayer();
  }
}

document.addEventListener('DOMContentLoaded', loadSections);
