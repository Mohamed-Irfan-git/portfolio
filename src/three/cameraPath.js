import { CatmullRomCurve3, MathUtils, Vector3 } from 'three';
import { chapters } from './chapters.js';

const route = [
  ...chapters.slice(0, 3),
  { start: 0.335, camera: [2, 2.65, -5.55], look: [2, 2.65, -6.18] },
  chapters[3],
  { start: 0.44, camera: [1, 3, -17], look: [2, 2.5, -25] },
  { start: 0.55, camera: [.5, 3.2, -31], look: [2, 2.6, -39] },
  { start: 0.60, camera: [.5, 3.2, -38], look: [2, 2.5, -42] },
  ...chapters.slice(4),
  { start: 1, camera: [0.5, 3, -72], look: [2.8, 2.4, -79] },
].sort((a, b) => a.start - b.start);
const points = route;

export const positionCurve = new CatmullRomCurve3(points.map(point => new Vector3(...point.camera)), false, 'centripetal');
export const lookCurve = new CatmullRomCurve3(points.map(point => new Vector3(...point.look)), false, 'centripetal');

export function sampleCameraPath(progress, position, look) {
  const p = MathUtils.clamp(progress, 0, 1);
  const nextIndex = route.findIndex(point => point.start > p);
  const index = Math.max(0, Math.min(route.length - 2, nextIndex < 0 ? route.length - 2 : nextIndex - 1));
  const from = route[index];
  const to = route[index + 1];
  const local = MathUtils.clamp((p - from.start) / Math.max(0.0001, to.start - from.start), 0, 1);
  const curveT = (index + local) / (route.length - 1);
  positionCurve.getPoint(curveT, position);
  lookCurve.getPoint(curveT, look);
}
