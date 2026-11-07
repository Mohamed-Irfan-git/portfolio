import { forwardRef, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import { progressRef } from '../three/progress.js';
import { Box, Label, Monitor, Room } from './Objects';

const StudioScene = forwardRef(function StudioScene({ portrait }, forwardedRef) {
  const root = useRef();
  const materials = useRef([]);
  useEffect(() => {
    const scene = root.current;
    if (!scene) return;
    const collected = new Set();
    scene.traverse(object => {
      if (!object.material) return;
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        if (collected.has(material)) continue;
        collected.add(material);
        materials.current.push({ material, opacity: material.opacity, transparent: material.transparent, depthWrite: material.depthWrite });
      }
    });
    return () => { materials.current = []; };
  }, []);
  useFrame(() => {
    const progress = progressRef.current;
    const fading = progress >= 0.34 && progress < 0.39;
    const opacity = 1 - MathUtils.smoothstep(progress, 0.34, 0.385);
    if (root.current) root.current.visible = progress < 0.39;
    for (const entry of materials.current) {
      const { material } = entry;
      const transparent = fading || entry.transparent;
      const depthWrite = fading ? false : entry.depthWrite;
      if (material.transparent !== transparent || material.depthWrite !== depthWrite) {
        material.transparent = transparent;
        material.depthWrite = depthWrite;
        material.needsUpdate = true;
      }
      material.opacity = fading ? opacity : entry.opacity;
    }
  });
  return <group ref={node => { root.current = node; if (typeof forwardedRef === 'function') forwardedRef(node); else if (forwardedRef) forwardedRef.current = node; }} position={[0, 0, -6]}>
    <Room/>

    {/* Work surface, monitor, keyboard and mouse. */}
    <group position={[2, 0, 0]}>
      <Box position={[0, 1.45, 0]} size={[5, .15, 2.1]} color="#46362f"/>
      <Box position={[0, 1.36, -.92]} size={[4.7, .06, .08]} color="#886248"/>
      {[-2.1, 2.1].map(x => <Box key={x} position={[x, .68, 0]} size={[.12, 1.4, 1.7]} color="#151923"/>)}
      <Monitor position={[0, 2.65, -.25]} terminal/>
      <Box position={[0, 1.56, .55]} size={[1.48, .06, .43]} color="#2c3545"/>
      {Array.from({ length: 10 }, (_, i) => <Box key={i} position={[-.6 + i * .13, 1.6, .55]} size={[.07, .01, .32]} color="#788494"/>)}
      <mesh position={[1.1, 1.62, .55]} scale={[.13, .07, .2]}>
        <sphereGeometry args={[1, 16, 10]}/>
        <meshStandardMaterial color="#687482" roughness={.38}/>
      </mesh>
      <Box position={[-2, 1.55, -.3]} size={[.48, .07, .42]} color="#252c35"/>
      <Box position={[-2, 2.05, -.3]} size={[.06, 1, .06]} color="#bf975c"/>
      <mesh position={[-2, 2.57, -.3]} rotation={[0, 0, .3]}>
        <coneGeometry args={[.37, .31, 18, 1, true]}/>
        <meshStandardMaterial color="#c1a16e" metalness={.68} roughness={.3} side={2}/>
      </mesh>
      <mesh position={[-2, 2.57, -.3]}>
        <sphereGeometry args={[.09, 12, 8]}/>
        <meshStandardMaterial color="#ffd29a" emissive="#ffb967" emissiveIntensity={1.1}/>
      </mesh>
      <pointLight position={[-1.9, 2.47, -.18]} color="#ffbb77" intensity={9} distance={6}/>
      <Box position={[0, 1.35, -.95]} size={[4.8, .035, .045]} emissive="#e63946" color="#e63946"/>
      <Box position={[-2.35, 1.38, -.9]} size={[.035, .04, .08]} emissive="#ff4d5a" color="#ff4d5a"/>
    </group>

    {/* The supplied portrait texture is used directly; only its frame and light change. */}
    <group position={[5, 3, -4.75]}>
      <Box size={[1.88, 2.34, .15]} color="#e63946" emissive="#e63946"/>
      <Box position={[0, 0, .09]} size={[1.72, 2.18, .08]} color="#594630"/>
      <mesh position={[0, 0, .14]}>
        <planeGeometry args={[1.58, 1.98]}/>
        <meshBasicMaterial map={portrait}/>
      </mesh>
      {[-.82, .82].map(x => <Box key={x} position={[x, 0, .19]} size={[.035, 2.1, .035]} emissive="#ff4d5a" color="#ff4d5a"/>)}
      <pointLight position={[0, 0, .5]} color="#e63946" intensity={2.5} distance={4}/>
    </group>

    {/* Shelves and readable wall lettering. */}
    {[2.5, 3.5].map(y => <group key={y}>
      <Box position={[-3, y, -4.5]} size={[3.4, .12, .65]} color="#322b29"/>
      {[0, 1, 2, 3].map(i => <Box key={i} position={[-4 + i * .25, y + .32, -4.5]} size={[.17, .55, .33]} color={['#64434b', '#a0784e', '#344b58', '#475865'][i]}/>)}
    </group>)}
    <Label text="BUILD. CONNECT. REPEAT." position={[-3.1, 4.55, -4.71]} width={3.75} height={.42} small color="#f2d4a9" background="#18202c"/>
    <Label text="STAY CURIOUS." position={[1.8, 4.2, -4.71]} width={3.25} height={.45} small color="#f2d4a9" background="#18202c"/>
    <Box position={[-5.5, 3, -4.8]} size={[.035, 3.2, .035]} emissive="#f59e0b" color="#f59e0b"/>
  </group>;
});
export default StudioScene;
