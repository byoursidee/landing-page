import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { Plinth } from './Architecture'

function tube(points, radius = 0.1) {
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))), 40, radius, 12, false)
}
function merge(parts) { const result = mergeGeometries(parts); parts.forEach(g => g.dispose()); return result }
function useSculpture(factory) {
  const geometry = useMemo(factory, [])
  useEffect(() => () => geometry.dispose(), [geometry])
  return geometry
}
function SoftBody({ color = '#527a5b' }) {
  const points = useMemo(() => [new THREE.Vector2(0, 0), new THREE.Vector2(0.42, 0.12), new THREE.Vector2(0.5, 0.55), new THREE.Vector2(0.4, 1.8), new THREE.Vector2(0.5, 2.7), new THREE.Vector2(0.32, 3), new THREE.Vector2(0, 3.1)], [])
  return <mesh castShadow><latheGeometry args={[points, 32]} /><meshStandardMaterial color={color} metalness={0.22} roughness={0.42} /></mesh>
}
function Person({ position, scale = 1, color = '#527a5b', lean = 0 }) {
  return <group position={position} scale={scale} rotation={[0, 0, lean]}>
    <SoftBody color={color} />
    <mesh position={[0, 3.7, 0]} castShadow><sphereGeometry args={[0.5, 32, 24]} /><meshStandardMaterial color={color} metalness={0.2} roughness={0.4} /></mesh>
  </group>
}
function Care() {
  const arms = useSculpture(() => merge([
    tube([[-1.65, 2.8, 0], [-1.15, 2.4, 0.4], [-0.65, 2.6, 0.65], [0, 2.85, 0.55]], 0.18),
    tube([[1.65, 2.8, 0], [1.15, 2.4, 0.4], [0.65, 2.6, 0.65], [0, 2.85, 0.55]], 0.18),
    tube([[-1.65, 2.95, -0.1], [-1, 3.6, -0.65], [0, 3.8, -0.8], [1, 3.6, -0.65], [1.65, 2.95, -0.1]], 0.14),
  ]))
  return <group position={[0, 0.3, 0]} rotation={[0, -0.15, 0]}>
    <Person position={[-1.8, 0, 0]} lean={-0.1} />
    <Person position={[1.8, 0, 0]} lean={0.1} color="#729477" />
    <mesh geometry={arms} castShadow><meshStandardMaterial color="#65896b" metalness={0.24} roughness={0.4} /></mesh>
    <mesh position={[0, 3.45, 0.6]} castShadow><sphereGeometry args={[0.5, 40, 32]} /><meshStandardMaterial color="#c5a576" metalness={0.45} roughness={0.32} /></mesh>
  </group>
}
function Processor() {
  const traces = useSculpture(() => {
    const parts = []
    for (const side of [-1, 1]) for (let i = 0; i < 4; i++) {
      const y = 2.5 + i * 0.62
      parts.push(tube([[side * 1.25, y, 0], [side * 1.7, y, 0], [side * 2, y + (i - 1.5) * 0.35, 0], [side * 2.8, y + (i - 1.5) * 0.35, 0]], 0.055))
      parts.push(tube([[(i - 1.5) * 0.6, side > 0 ? 4.8 : 2.05, 0], [(i - 1.5) * 0.65, side > 0 ? 5.3 : 1.5, 0], [(i - 1.5) * 0.9, side > 0 ? 5.8 : 0.3, 0]], 0.055))
    }
    return merge(parts)
  })
  const code = useSculpture(() => merge([
    tube([[-0.45, 3.95, 0.35], [-0.95, 3.5, 0.35], [-0.45, 3.05, 0.35]], 0.055),
    tube([[0.45, 3.95, 0.35], [0.95, 3.5, 0.35], [0.45, 3.05, 0.35]], 0.055),
    tube([[0.2, 4.08, 0.35], [0, 3.5, 0.35], [-0.2, 2.92, 0.35]], 0.055),
  ]))
  const plate = useMemo(() => {
    const s = new THREE.Shape(), r = 0.18, w = 1.3
    s.moveTo(-w + r, -w); s.lineTo(w - r, -w); s.quadraticCurveTo(w, -w, w, -w + r)
    s.lineTo(w, w - r); s.quadraticCurveTo(w, w, w - r, w); s.lineTo(-w + r, w)
    s.quadraticCurveTo(-w, w, -w, w - r); s.lineTo(-w, -w + r); s.quadraticCurveTo(-w, -w, -w + r, -w)
    return s
  }, [])
  return <group rotation={[0, -0.2, 0]}>
    <mesh geometry={traces} castShadow><meshStandardMaterial color="#b79c70" metalness={0.5} roughness={0.3} /></mesh>
    <mesh position={[0, 3.45, -0.15]} castShadow><extrudeGeometry args={[plate, { depth: 0.35, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 3, steps: 1 }]} /><meshStandardMaterial color="#315c44" metalness={0.25} roughness={0.35} /></mesh>
    <mesh geometry={code}><meshStandardMaterial color="#e7d9b8" metalness={0.25} roughness={0.35} /></mesh>
    {[-1, 1].flatMap(side => Array.from({ length: 4 }, (_, i) => <mesh key={`${side}-${i}`} position={[side * 2.8, 2.5 + i * 0.62 + (i - 1.5) * 0.35, 0]}><sphereGeometry args={[0.115, 16, 12]} /><meshStandardMaterial color="#729477" metalness={0.3} roughness={0.4} /></mesh>))}
  </group>
}
function Bridge() {
  const structure = useSculpture(() => {
    const parts = []
    for (const z of [-0.6, 0.6]) {
      parts.push(tube([[-3, 0.5, z], [-1.6, 1.3, z], [0, 1.65, z], [1.6, 1.3, z], [3, 0.5, z]], 0.12))
      parts.push(tube([[-3, 1.1, z], [-1.6, 1.9, z], [0, 2.25, z], [1.6, 1.9, z], [3, 1.1, z]], 0.055))
      for (let i = -3; i <= 3; i++) {
        const y = 1.65 - (i / 3) ** 2 * 1.15
        parts.push(tube([[i, y, z], [i, y + 0.3, z], [i, y + 0.6, z]], 0.035))
      }
    }
    return merge(parts)
  })
  return <group rotation={[0, -0.2, 0]}>
    <mesh geometry={structure} castShadow><meshStandardMaterial color="#b59b70" metalness={0.4} roughness={0.35} /></mesh>
    {Array.from({ length: 23 }, (_, i) => {
      const x = (i - 11) * 0.255, y = 1.65 - (x / 3) ** 2 * 1.15
      return <mesh key={i} position={[x, y, 0]} rotation={[0, 0, Math.atan(-2 * x * 1.15 / 9)]} castShadow><boxGeometry args={[0.24, 0.09, 1.25]} /><meshStandardMaterial color="#9cad8e" roughness={0.6} /></mesh>
    })}
    <Person position={[-2.8, 0.45, -0.2]} scale={0.72} color="#527a5b" />
    <Person position={[2.8, 0.45, -0.2]} scale={0.72} color="#729477" />
  </group>
}
export default function Destinations() {
  return <>
    <group position={[4, 0, -1]}><Plinth radius={3.8} /><Care /></group>
    <group position={[5, 0, -39]}><Plinth /><Processor /></group>
    <group position={[4, 0, -79]}><Plinth radius={4.2} /><Bridge /></group>
  </>
}
