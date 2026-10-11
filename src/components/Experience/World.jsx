import { Component, useEffect, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Architecture from './Architecture'
import Destinations from './Destinations'
import CameraDirector from './CameraDirector'

class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onFailure() }
  render() { return this.state.failed ? null : this.props.children }
}
function Lifecycle({ onReady, onFailure }) {
  const gl = useThree(state => state.gl)
  useEffect(() => {
    const canvas = gl.domElement
    const lost = event => { event.preventDefault(); onFailure() }
    canvas.addEventListener('webglcontextlost', lost)
    onReady()
    return () => canvas.removeEventListener('webglcontextlost', lost)
  }, [gl, onReady, onFailure])
  return null
}
function GalleryLight({ z, compact }) {
  const target = useMemo(() => {
    const object = new THREE.Object3D()
    object.position.set(4, 0, z)
    return object
  }, [z])
  return <>
    <primitive object={target} />
    <spotLight position={[1, 12, z + 3]} target={target} intensity={420} angle={0.7} penumbra={0.7} distance={32} decay={2} castShadow={!compact} shadow-mapSize={1024} shadow-bias={-0.0004} />
    <pointLight position={[10, 5, z - 3]} intensity={85} distance={22} color="#d2dfb7" />
  </>
}
function Lighting({ compact }) {
  return <>
    <ambientLight intensity={0.7} />
    <hemisphereLight args={['#fff0d4', '#7e9470', 1.6]} />
    <directionalLight position={[-6, 14, 12]} intensity={2.6} color="#ffecd0" />
    {[0, -38, -79].map(z => <GalleryLight key={z} z={z} compact={compact} />)}
  </>
}
export default function World({ journey, pointer, onReady, onFailure, compact }) {
  return <SceneBoundary onFailure={onFailure}>
    <Canvas camera={{ position: [-1, 2.3, 19], fov: 54, near: 0.1, far: 180 }} shadows={!compact} dpr={compact ? [1, 1.25] : [1, 1.65]} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping }}>
      <color attach="background" args={['#eeeade']} />
      <fog attach="fog" args={['#eeeade', 24, 100]} />
      <Lighting compact={compact} />
      <Architecture />
      <Destinations />
      <CameraDirector journey={journey} pointer={pointer} />
      <Lifecycle onReady={onReady} onFailure={onFailure} />
    </Canvas>
  </SceneBoundary>
}
