import { lazy, Suspense, useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import BrandIdentity from './components/UI/BrandIdentity'
import StaticWorld from './components/UI/StaticWorld'
import { chapters } from './data/brandContent'
import { JourneyController } from './systems/JourneyController'

const World = lazy(() => import('./components/Experience/World'))
function useMedia(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    update(); media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])
  return matches
}
function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2')
    if (!context) return false
    context.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch { return false }
}
export default function App() {
  const [journey] = useState(() => new JourneyController())
  const state = useSyncExternalStore(journey.subscribe, journey.getSnapshot)
  const prefersReduced = useMedia('(prefers-reduced-motion: reduce)')
  const compact = useMedia('(max-width: 760px), (pointer: coarse)')
  const portrait = useMedia('(max-aspect-ratio: 0.85)')
  const reduced = prefersReduced
  const [available, setAvailable] = useState(hasWebGL)
  const [ready, setReady] = useState(false)
  const pointer = useRef({ x: 0, y: 0 })
  const onReady = useCallback(() => setReady(true), [])
  const onFailure = useCallback(() => { setAvailable(false); setReady(true) }, [])
  const chapter = chapters[state.chapter]
  useEffect(() => { if (!available) setReady(true) }, [available])
  useEffect(() => {
    if (!ready) return
    journey.setReduced(reduced || !available)
    if (!reduced && available) journey.start()
    return () => journey.stop()
  }, [journey, reduced, ready, available])
  useEffect(() => () => journey.dispose(), [journey])
  const select = index => journey.select(index)
  const keyNavigation = event => {
    if (event.target.closest('button') || event.altKey || event.metaKey || event.ctrlKey) return
    if (event.key === 'ArrowRight') { event.preventDefault(); select(Math.min(2, state.chapter + 1)) }
    if (event.key === 'ArrowLeft') { event.preventDefault(); select(Math.max(0, state.chapter - 1)) }
  }
  return <main className={`experience chapter-${state.chapter}${state.traveling && state.playing ? ' is-traveling' : ''}${ready ? ' is-ready' : ''}${reduced ? ' reduced-motion' : ''}`}
    onKeyDown={keyNavigation} onPointerMove={event => {
      if (event.pointerType !== 'mouse') return
      pointer.current = { x: event.clientX / window.innerWidth * 2 - 1, y: 1 - event.clientY / window.innerHeight * 2 }
    }} onPointerLeave={() => { pointer.current = { x: 0, y: 0 } }}>
    <div className="world" aria-hidden="true">
      {available ? <Suspense fallback={<StaticWorld chapter={state.chapter} portrait={portrait} />}><World journey={journey} pointer={pointer} onReady={onReady} onFailure={onFailure} compact={compact} /></Suspense> : <StaticWorld chapter={state.chapter} portrait={portrait} />}
    </div>
    <div className="scene-shade" aria-hidden="true" />
    <header className="topbar"><BrandIdentity /><span className="brand-purpose">Standing beside people.</span></header>
    <section className="story" aria-label={`${chapter.label}: ${chapter.place}`}>
      <div className="chapter-label">{chapter.label}</div>
      <div className="story-content" key={chapter.id}>
        <h1>{chapter.title.split('\n').map((line, i) => <span key={i}>{line}</span>)}</h1>
        <p>{chapter.body}</p>
        <div className="story-note"><span />{chapter.note}</div>
      </div>
    </section>
    <footer className="journey-bar">
      <span className="journey-invitation">Discover what brings us together.</span>
      <nav className="chapter-nav" aria-label="Journey destinations">{chapters.map((item, index) => <button key={item.id} aria-current={index === state.chapter ? 'step' : undefined} aria-label={`${item.label}: ${item.place}`} onClick={() => select(index)}><span>{item.label}</span><span className="nav-track" /></button>)}</nav>
      <span className="journey-caption">{chapter.place}</span>
    </footer>
    <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{ready ? `${chapter.label}. ${chapter.title.replace('\n', ' ')} ${state.traveling ? 'Traveling to destination.' : ''}` : 'Loading the experience.'}</span>
  </main>
}
