# BYOURSIDEE

A continuous first-person journey about care, understanding, and thoughtful software. Built with React, React Three Fiber, Three.js, and GSAP.

## Run

```sh
npm install
npm run dev
```

```sh
npm run build
npm run preview
```

## Brand and experience

The latest direction uses warm ivory, sage and forest green, with muted brass accents. The supplied hand, leaf, and circuit emblem is used in the header and browser icon. The full emblem scales proportionally beside a live-text BYOURSIDEE wordmark. “Technology with people at heart” sits below the wordmark.

Three sculptures share a single architectural environment:

- **Why:** two figures supporting a shared sphere, expressing care and mutual support.
- **How:** a sculptural processor with connected circuits and a code motif, expressing care translated into software.
- **What:** a bridge joining people, expressing the possibilities thoughtful technology creates.

The journey starts automatically and ends at What. Selecting Why, How, or What stops automatic progression and moves to that destination. There are no journey playback, replay, motion, or numbered controls. The system reduced-motion preference is respected automatically, providing stable chapter views. WebGL failure or context loss switches to lightweight chapter illustrations.

## Tune the experience

- `src/data/brandContent.js`: story and destination labels.
- `src/data/cameraWaypoints.js`: continuous camera and gaze paths.
- `src/data/journeyConfig.js`: arrival times, travel times, and reading holds.
- `src/systems/JourneyController.js`: progression and manual selection.
- `src/components/Experience/`: gallery, sculptures, lighting, and camera.
- `src/style.css`: brand, interface, and responsive layouts.

Repeated architectural elements use instancing. Geometry is generated locally, the 3D bundle loads separately from the interface, pixel ratio is capped, and mobile devices skip shadow maps. Inter loads from Google Fonts with a local sans-serif fallback.

## Validation

Production compilation and journey controller checks pass (arrival, autoplay, manual holds, reduced motion, and final stop). Camera projection checks place each sculpture inside desktop, portrait, and landscape viewports. The 3D bundle triggers Vite’s size advisory (approximately 238 kB compressed). This workspace blocks local server ports and browser subprocesses, so browser rendering, console output, mobile appearance, and actual device performance still require a browser review.
