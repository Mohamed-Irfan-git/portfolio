import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, useProgress, useTexture } from '@react-three/drei';
import { SRGBColorSpace } from 'three';
import EntranceScene from '../scenes/EntranceScene';
import StudioScene from '../scenes/StudioScene';
import {AboutScene,ProjectGallery,SkillsScene,ContactScene} from '../scenes/PortfolioRooms';
import CameraController from './CameraController';
function Scene({selected,projects,onSelect,onReady}){
 const door=useRef();const portrait=useTexture('/images/irfan-cinematic.webp');portrait.colorSpace=SRGBColorSpace;
 useEffect(()=>{onReady();},[onReady]);
 return <><color attach="background" args={['#080b12']}/><fog attach="fog" args={['#080b12',12,37]}/><ambientLight intensity={.7}/><hemisphereLight args={['#b2bfd4','#2e1a1e',1.8]}/><directionalLight position={[2,8,6]} intensity={2.5} color="#dce4ff"/><EntranceScene ref={door}/><StudioScene portrait={portrait}/><AboutScene/><ProjectGallery projects={projects} onSelect={onSelect}/><SkillsScene/><ContactScene/><CameraController door={door} selected={selected} projects={projects}/><AdaptiveDpr pixelated/></>;
}
function Progress({onProgress}){const {progress}=useProgress();useEffect(()=>onProgress(progress),[progress,onProgress]);return null;}
export default function Experience(props){
 const [lost,setLost]=useState(false);const canvasRef=useRef(null);
 useEffect(()=>()=>{canvasRef.current?.removeEventListener('webglcontextlost',handleLoss);},[]);
 function handleLoss(e){e.preventDefault();setLost(true);props.onReady();}
 if(lost)return <div className="scene-fallback"><img src="/images/irfan-cinematic.webp" alt=""/><span>3D view paused. Continue exploring below.</span></div>;
 return <><Progress onProgress={props.onProgress}/><Canvas frameloop="demand" dpr={[1,1.5]} camera={{position:[.7,2.9,11.5],fov:46,near:.1,far:65}} gl={{antialias:true,alpha:false,powerPreference:'low-power'}} onCreated={({gl})=>{canvasRef.current=gl.domElement;gl.domElement.addEventListener('webglcontextlost',handleLoss);}} fallback={<div className="scene-fallback">3D is unavailable. Explore the portfolio below.</div>}><Suspense fallback={null}><Scene {...props}/></Suspense></Canvas></>;
}
