import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerformanceMonitor, useDetectGPU, useProgress, useTexture } from '@react-three/drei';
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
import { AdditiveBlending, BufferGeometry, Color, Float32BufferAttribute, MathUtils, SRGBColorSpace } from 'three';
import EntranceScene from '../scenes/EntranceScene';
import StudioScene from '../scenes/StudioScene';
import {AboutScene,ProjectGallery,SkillsScene,ContactScene} from '../scenes/PortfolioRooms';
import CameraRig from './CameraRig';
import { chapters } from './chapters.js';
import { progressRef } from './progress.js';
function Waypoints(){return <group>{chapters.map((chapter,index)=><mesh key={chapter.id} position={chapter.camera}><sphereGeometry args={[0.13,10,8]}/><meshStandardMaterial color={index===0?'#f59e0b':'#ff4d5a'} emissive={index===0?'#f59e0b':'#ff4d5a'} emissiveIntensity={2} toneMapped={false}/></mesh>)}</group>;}
function HighTierEffects({enabled}){
 if(!enabled)return null;
 return <EffectComposer multisampling={0}><Bloom intensity={.6} luminanceThreshold={.9} luminanceSmoothing={.25} mipmapBlur/><Vignette eskil={false} offset={.18} darkness={.5}/><Noise opacity={.04}/></EffectComposer>;
}
function DiveEffects({lowPower}){
 const lineMaterial=useRef(),dustMaterial=useRef(),streams=useRef();
 const lineGeometry=useMemo(()=>{
  const positions=[],colors=[];const palette=['#ff4d5a','#f59e0b','#83b9e8','#f8fafc'];
  for(let strand=0;strand<(lowPower?10:44);strand++){
   const phase=strand*1.73,startX=Math.sin(phase)*1.8,startY=2.65+Math.cos(phase*1.3)*1.05,color=new Color(palette[strand%palette.length]);
   let previous=null;
   for(let step=0;step<=10;step++){
    const u=step/10,point=[startX+Math.sin(phase+u*5)*u*1.35,startY+Math.cos(phase*1.7+u*4)*u*.75,-7.2-u*23];
    if(previous){positions.push(...previous,...point);colors.push(color.r,color.g,color.b,color.r,color.g,color.b);}previous=point;
   }
  }
  const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(positions,3));geometry.setAttribute('color',new Float32BufferAttribute(colors,3));return geometry;
 },[lowPower]);
 const dustGeometry=useMemo(()=>{
  const positions=[];let seed=369;
  const random=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};
  for(let i=0;i<(lowPower?120:480);i++)positions.push((random()-.5)*14,random()*8-1,-12-random()*38);
  const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(positions,3));return geometry;
 },[lowPower]);
 useEffect(()=>()=>{lineGeometry.dispose();dustGeometry.dispose();},[lineGeometry,dustGeometry]);
 useFrame(()=>{
  const progress=progressRef.current;
  const lineIn=MathUtils.smoothstep(progress,.315,.35),lineOut=1-MathUtils.smoothstep(progress,.43,.52);
  const dustIn=MathUtils.smoothstep(progress,.35,.46),dustOut=1-MathUtils.smoothstep(progress,.82,.94);
  if(lineMaterial.current)lineMaterial.current.opacity=.68*lineIn*lineOut;
  if(dustMaterial.current)dustMaterial.current.opacity=.22*dustIn*dustOut;
  if(streams.current)streams.current.rotation.z=.018*Math.sin(progress*24)*lineIn*lineOut;
 });
 return <group><group ref={streams}><lineSegments geometry={lineGeometry}><lineBasicMaterial ref={lineMaterial} vertexColors transparent opacity={0} depthWrite={false} blending={AdditiveBlending} toneMapped={false}/></lineSegments></group><points geometry={dustGeometry}><pointsMaterial ref={dustMaterial} color="#a8c7e7" size={.045} sizeAttenuation transparent opacity={0} depthWrite={false} toneMapped={false}/></points></group>;
}
function Scene({selected,projects,onSelect,onReady,debug,skillGroups,activeSkill,onSkillSelect,leetcodeStats,lowPower,contactSent,highTier}){
 const door=useRef(),portalLight=useRef(),lightLeak=useRef();const portrait=useTexture('/images/irfan-cinematic.webp');portrait.colorSpace=SRGBColorSpace;
 useEffect(()=>{onReady();},[onReady]);
 return <><color attach="background" args={['#080b12']}/><fog attach="fog" args={['#080b12',12,37]}/><ambientLight intensity={.62}/><hemisphereLight args={['#b8c5d9','#2e1a1e',1.25]}/><directionalLight position={[2,8,6]} intensity={2.2} color="#dce4ff"/><pointLight position={[6,5,1]} color="#e63946" intensity={3.4} distance={16}/><pointLight position={[-5,4,-4]} color="#f59e0b" intensity={2.6} distance={18}/><EntranceScene ref={door} portalLight={portalLight} lightLeak={lightLeak}/><StudioScene portrait={portrait}/><DiveEffects lowPower={lowPower}/><AboutScene/><ProjectGallery projects={projects} onSelect={onSelect}/><SkillsScene skillGroups={skillGroups} activeSkill={activeSkill} onSkillSelect={onSkillSelect} leetcodeStats={leetcodeStats}/><ContactScene sent={contactSent}/>{debug&&<Waypoints/>}<CameraRig door={door} portalLight={portalLight} lightLeak={lightLeak} selected={selected} projects={projects}/><HighTierEffects enabled={highTier}/></>;
}
function Progress({onProgress}){const {progress}=useProgress();useEffect(()=>onProgress(progress),[progress,onProgress]);return null;}
export default function Experience(props){
 const gpu=useDetectGPU();
 const gpuTier=gpu?.tier||0;
 const maxDpr=props.lowPower?1:gpuTier>=3?1.75:gpuTier>=2?1.25:1;
 const highTier=!props.lowPower&&gpuTier>=3;
 const [dpr,setDpr]=useState(1),[lost,setLost]=useState(false);
 const canvasRef=useRef(null);
 useEffect(()=>setDpr(maxDpr),[maxDpr]);
 useEffect(()=>()=>{canvasRef.current?.removeEventListener('webglcontextlost',handleLoss);},[]);
 function handleLoss(e){e.preventDefault();setLost(true);props.onReady();}
 if(lost)return <div className="scene-fallback"><img src="/images/irfan-cinematic.webp" alt=""/><span>3D view paused. Continue exploring below.</span></div>;
 return <>
  <Progress onProgress={props.onProgress}/>
  <Canvas frameloop="always" dpr={dpr} camera={{position:[.7,2.9,11.5],fov:46,near:.1,far:100}} gl={{antialias:true,alpha:false,powerPreference:'low-power'}} onCreated={({gl})=>{canvasRef.current=gl.domElement;gl.domElement.addEventListener('webglcontextlost',handleLoss);}} fallback={<div className="scene-fallback">3D is unavailable. Explore the portfolio below.</div>}>
   <Suspense fallback={null}>
    <PerformanceMonitor bounds={()=>[45,60]} flipflops={3} onDecline={()=>setDpr(1)} onIncline={()=>setDpr(maxDpr)}>
     <Scene {...props} highTier={highTier}/>
    </PerformanceMonitor>
   </Suspense>
  </Canvas>
 </>;
}
