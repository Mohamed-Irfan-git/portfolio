import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { easing } from 'maath';
import { MathUtils, Vector3 } from 'three';
import { chapters } from './chapters.js';
import { sampleCameraPath } from './cameraPath.js';
import { progressRef } from './progress.js';

export default function CameraRig({ door, portalLight, lightLeak, selected, projects }) {
  const { camera, pointer } = useThree();
  const pathPosition = useRef(new Vector3());
  const pathLook = useRef(new Vector3());
  const targetPosition = useRef(new Vector3());
  const targetLook = useRef(new Vector3());
  const currentLook = useRef(new Vector3(1.25, 2.5, 0));
  const focusPosition = useRef(new Vector3());
  const focusLook = useRef(new Vector3());
  const focusBlend = useRef(0);
  const parallax = useRef(new Vector3());

  useFrame((_, delta) => {
    const progress = progressRef.current;
    sampleCameraPath(progress, pathPosition.current, pathLook.current);
    targetPosition.current.copy(pathPosition.current);
    targetLook.current.copy(pathLook.current);

    const index = selected ? projects.findIndex(project => project.name === selected.name) : -1;
    focusBlend.current = MathUtils.damp(focusBlend.current, index >= 0 ? 1 : 0, 5, delta);
    if (index >= 0) {
      const x = index % 2 === 0 ? -3.65 : 3.65;
      const y = 2.8 + (index % 2) * .35;
      const z = -20 - Math.floor(index / 2) * 4.4;
      focusPosition.current.set(x, y, z + 3);
      focusLook.current.set(x, y, z);
    }
    if (focusBlend.current > 0.001) {
      targetPosition.current.lerp(focusPosition.current, focusBlend.current);
      targetLook.current.lerp(focusLook.current, focusBlend.current);
    }

    parallax.current.set(pointer.x, pointer.y, 0);
    if (parallax.current.lengthSq() > 1) parallax.current.normalize();
    parallax.current.multiplyScalar(0.15);
    targetPosition.current.add(parallax.current);
    targetLook.current.addScaledVector(parallax.current, 0.25);

    easing.damp3(camera.position, targetPosition.current, 0.25, delta);
    easing.damp3(currentLook.current, targetLook.current, 0.25, delta);
    camera.lookAt(currentLook.current);

    const surface = chapters[0];
    const surfaceT = MathUtils.clamp((progress - surface.start) / (surface.end - surface.start), 0, 1);
    const opening = MathUtils.smoothstep(surfaceT, 0.06, 0.9);
    if (door.current) door.current.rotation.y = -1.58 * opening;
    if (portalLight.current) portalLight.current.intensity = 0.25 + 18 * MathUtils.smoothstep(surfaceT, 0.28, 1);
    if (lightLeak.current) lightLeak.current.opacity = 0.035 + 0.32 * MathUtils.smoothstep(surfaceT, 0.16, 1);
  });
  return null;
}
