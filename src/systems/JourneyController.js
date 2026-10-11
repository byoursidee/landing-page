import gsap from 'gsap'
import { stops, timing } from '../data/journeyConfig'

export class JourneyController {
  position = { value: 0 }
  timeline = null
  listeners = new Set()
  snapshot = { chapter: 0, playing: false, traveling: false, complete: false, reduced: false }
  subscribe = (listener) => { this.listeners.add(listener); return () => this.listeners.delete(listener) }
  getSnapshot = () => this.snapshot
  update(values) {
    this.snapshot = { ...this.snapshot, ...values }
    this.listeners.forEach(listener => listener())
  }
  stop() { this.timeline?.kill(); this.timeline = null }
  setReduced(reduced) {
    this.stop()
    if (reduced || this.snapshot.reduced) this.position.value = stops[this.snapshot.chapter]
    this.update({ reduced, playing: false, traveling: false, complete: false })
  }
  select(chapter) {
    this.stop()
    const distance = Math.abs(stops[chapter] - this.position.value)
    this.update({ chapter, playing: false, traveling: !this.snapshot.reduced && distance > 0.001, complete: false })
    if (this.snapshot.reduced || distance < 0.001) {
      this.position.value = stops[chapter]
      this.update({ traveling: false })
      return
    }
    this.timeline = gsap.timeline().to(this.position, {
      value: stops[chapter], duration: Math.max(2, distance * 22), ease: 'sine.inOut',
      onComplete: () => this.update({ traveling: false }),
    })
  }
  start() {
    if (this.snapshot.reduced) { this.select(0); return }
    this.stop()
    this.update({ chapter: 0, playing: true, traveling: true, complete: false })
    const timeline = gsap.timeline()
    this.timeline = timeline
    const initialDistance = Math.abs(this.position.value - stops[0])
    timeline.to(this.position, { value: stops[0], duration: Math.max(timing.arrival, initialDistance * 22), ease: 'sine.inOut' })
    for (let chapter = 0; chapter < 3; chapter++) {
      if (chapter > 0) {
        timeline.call(() => this.update({ chapter, traveling: true }))
        timeline.to(this.position, { value: stops[chapter], duration: timing.travel[chapter - 1], ease: 'sine.inOut' })
      }
      timeline.call(() => this.update({ chapter, traveling: false }))
      timeline.to({}, { duration: timing.hold[chapter] })
    }
    timeline.call(() => this.update({ playing: false, complete: true }))
  }
  dispose() { this.stop(); this.listeners.clear() }
}
