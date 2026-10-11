import { CatmullRomCurve3, Vector3 } from 'three'

// One path through one world. Positions are in metres; y stays at eye level.
const positions = [
  [-1, 2.3, 19], [-1, 2.3, 9], [0, 2.3, -3], [2, 2.3, -18],
  [1, 2.3, -29], [0, 2.3, -43], [-2, 2.3, -57], [-1, 2.3, -69],
  [0, 2.3, -82],
]
export const cameraPath = new CatmullRomCurve3(positions.map(p => new Vector3(...p)), false, 'catmullrom', 0.35)
export const lookPath = new CatmullRomCurve3(positions.map(([x, , z]) => new Vector3(x + 0.6, 3.1, z - 17)), false, 'catmullrom', 0.35)
