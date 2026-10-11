import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

export function Instances({ items, color = '#9ca88f', metalness = 0.5, roughness = 0.5 }) {
  const ref = useRef()
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D()
    items.forEach(({ position, scale, rotation = [0, 0, 0] }, i) => {
      dummy.position.set(...position); dummy.scale.set(...scale); dummy.rotation.set(...rotation)
      dummy.updateMatrix(); ref.current.setMatrixAt(i, dummy.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
    ref.current.computeBoundingSphere()
  }, [items])
  return <instancedMesh ref={ref} args={[null, null, items.length]} castShadow receiveShadow>
    <boxGeometry /><meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
  </instancedMesh>
}

export function Plinth({ position, radius = 3.4 }) {
  return <group position={position}>
    <mesh position={[0, 0.13, 0]} receiveShadow><cylinderGeometry args={[radius, radius, 0.26, 80]} /><meshStandardMaterial color="#d7d3c0" metalness={0.12} roughness={0.65} /></mesh>
    <mesh position={[0, 0.27, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[radius - 0.045, radius, 80]} /><meshBasicMaterial color="#78906e" /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.009, 0]}><ringGeometry args={[radius + 0.8, radius + 0.815, 80]} /><meshBasicMaterial color="#9ca88f" /></mesh>
  </group>
}

function Oculus({ position }) {
  return <group position={position}>
    <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[5.8, 0.22, 12, 100]} /><meshStandardMaterial color="#b5b79e" metalness={0.8} roughness={0.3} /></mesh>
    <mesh position={[0, -0.16, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[5.7, 0.035, 8, 100]} /><meshBasicMaterial color="#efe4c7" /></mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}><ringGeometry args={[6, 8, 100]} /><meshStandardMaterial color="#e1dfd0" side={THREE.DoubleSide} /></mesh>
  </group>
}

export default function Architecture() {
  const fins = useMemo(() => Array.from({ length: 94 }, (_, i) => {
    const z = 22 - Math.floor(i / 2) * 2.5
    return { position: [i % 2 ? 15 : -15, 5.5, z], scale: [0.34, 11, 0.85] }
  }), [])
  const ribs = useMemo(() => [-13, -17, -21, -50, -54, -58].flatMap(z => [
    { position: [-10, 5, z], scale: [0.22, 10, 0.45] },
    { position: [10, 5, z], scale: [0.22, 10, 0.45] },
    { position: [0, 10, z], scale: [20.2, 0.22, 0.45] },
  ]), [])
  const seams = useMemo(() => Array.from({ length: 28 }, (_, i) => ({ position: [0, 0.007, 26 - i * 4.5], scale: [30, 0.008, 0.017] })), [])
  const lights = useMemo(() => [-7, 8].map(x => ({ position: [x, 0.015, -40], scale: [0.025, 0.02, 134] })), [])
  return <>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.025, -40]} receiveShadow><planeGeometry args={[120, 220]} /><meshStandardMaterial color="#e0ddce" metalness={0.08} roughness={0.7} /></mesh>
    <Instances items={seams} color="#9ca88f" />
    <Instances items={fins} color="#b4c0a8" />
    <Instances items={ribs} color="#a2b397" />
    <Instances items={lights} color="#78906e" metalness={0.15} />
    {[-15.6, 15.6].map(x => <mesh key={x} position={[x, 5, -40]}><boxGeometry args={[0.4, 10, 145]} /><meshStandardMaterial color="#e1dfd0" roughness={0.9} /></mesh>)}
    {[0, -38, -79].map((z, i) => <Oculus key={z} position={[i === 1 ? 5 : 4, 10.3, z]} />)}
    <mesh position={[0, 5, -110]}><boxGeometry args={[32, 10, 0.5]} /><meshStandardMaterial color="#e1dfd0" /></mesh>
  </>
}
