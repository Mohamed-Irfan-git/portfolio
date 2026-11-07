// The camera and overlays share these normalized scroll boundaries.
// The extra endpoint in cameraPath.js completes the Signal segment.
export const chapters = [
  { id: 'surface', label: 'The Surface', start: 0, end: 0.14, navId: 'home', camera: [0.7, 2.9, 11.5], look: [1.25, 2.5, 0] },
  { id: 'maker', label: 'The Maker', start: 0.14, end: 0.30, navId: 'studio', camera: [3, 2.6, -0.5], look: [2, 2, -7] },
  { id: 'dive', label: 'The Dive', start: 0.30, end: 0.37, navId: 'about', camera: [2, 2.7, -4.3], look: [2, 2.65, -6.25] },
  { id: 'system', label: 'The System', start: 0.37, end: 0.63, navId: 'projects', camera: [2, 2.65, -7.3], look: [2, 2.65, -11.5] },
  { id: 'core', label: 'The Core', start: 0.63, end: 0.76, navId: 'skills', camera: [0.5, 3.6, -49], look: [3, 2.7, -60] },
  { id: 'mindset', label: 'The Mindset', start: 0.76, end: 0.84, navId: 'skills', camera: [1.5, 3.4, -54], look: [3, 2.7, -61] },
  { id: 'blueprint', label: 'The Blueprint', start: 0.84, end: 0.92, navId: 'skills', camera: [1, 3, -60], look: [2.8, 2.5, -67] },
  { id: 'signal', label: 'The Signal', start: 0.92, end: 1, navId: 'contact', camera: [0.5, 3, -69], look: [2.8, 2.4, -79] },
];

export function chapterAt(progress) {
  return chapters.find(chapter => progress < chapter.end) || chapters[chapters.length - 1];
}
