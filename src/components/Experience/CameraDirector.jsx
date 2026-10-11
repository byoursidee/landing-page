import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, Vector3 } from 'three'
import { cameraPath, lookPath } from '../../data/cameraWaypoints'

export default function CameraDirector({ journey, pointer }) {
  const look = useMemo(() => new Vector3(), [])
  const offset = useMemo(() => ({ x: 0, y: 0 }), [])
  useFrame(({ camera, size }, delta) => {
    const { reduced, traveling, playing } = journey.getSnapshot()
    const position = journey.position.value
    cameraPath.getPoint(position, camera.position)
    lookPath.getPoint(position, look)
    const portrait = size.width / size.height < 0.85
    // On portrait screens, the sculpture occupies the upper part of the view.
    if (portrait) {
      const focusX = position <= 0.5
        ? MathUtils.lerp(4, 5, MathUtils.smoothstep(position, 0.125, 0.5))
        : MathUtils.lerp(5, 4, MathUtils.smoothstep(position, 0.5, 0.875))
      camera.position.x -= 1.5
      camera.position.z += 4
      look.x = camera.position.x + (focusX - camera.position.x) * 1.5
      look.y = -1.6
    }
    const allowLook = !reduced && !traveling && !playing
    offset.x = MathUtils.damp(offset.x, allowLook ? pointer.current.x * 0.65 : 0, 3, delta)
    offset.y = MathUtils.damp(offset.y, allowLook ? pointer.current.y * 0.3 : 0, 3, delta)
    look.x += offset.x; look.y += offset.y
    camera.lookAt(look)
    const fov = portrait ? 66 : 54
    if (camera.fov !== fov) { camera.fov = fov; camera.updateProjectionMatrix() }
  })
  return null
}
