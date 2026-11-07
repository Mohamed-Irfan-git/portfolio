import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CanvasTexture, SRGBColorSpace } from 'three';
import { progressRef } from '../three/progress.js';
export function Box({position=[0,0,0],size=[1,1,1],color='#161d29',emissive,rotation,...props}){
 return <mesh position={position} rotation={rotation} castShadow receiveShadow {...props}><boxGeometry args={size}/><meshStandardMaterial color={color} roughness={.5} metalness={.5} emissive={emissive||'#000000'} emissiveIntensity={emissive?2:0}/></mesh>;
}
export function Label({text,position=[0,0,0],width=2,height=.4,color='#d4dbea',background='#101620',small=false}){
 const texture=useMemo(()=>{const c=document.createElement('canvas');c.width=1024;c.height=small?128:512;const ctx=c.getContext('2d');ctx.fillStyle=background;ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';const lines=text.split(/\r?\n|\\n/);const fontSize=small?64:Math.min(86,Math.floor(350/lines.length));const lineHeight=fontSize*1.35;ctx.font=`600 ${fontSize}px monospace`;lines.forEach((line,i)=>ctx.fillText(line,512,c.height/2+(i-(lines.length-1)/2)*lineHeight,950));const t=new CanvasTexture(c);t.colorSpace=SRGBColorSpace;return t;},[text,color,background,small]);
 useEffect(()=>()=>texture.dispose(),[texture]);
 return <mesh position={position}><planeGeometry args={[width,height]}/><meshBasicMaterial map={texture}/></mesh>;
}
function TerminalScreen({position=[0,0,0],width=2.34,height=1.32,mode='studio'}){
 const elapsed=useRef(0),lastDraw=useRef(0),wasVisible=useRef(false);
 const {texture,context}=useMemo(()=>{const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=576;const ctx=canvas.getContext('2d');const map=new CanvasTexture(canvas);map.colorSpace=SRGBColorSpace;return {texture:map,context:ctx};},[]);
 useEffect(()=>()=>texture.dispose(),[texture]);
 useFrame((_,delta)=>{
  const visible=mode!=='signal'||progressRef.current>=.92;
  if(visible&&!wasVisible.current){elapsed.current=0;lastDraw.current=0;}
  wasVisible.current=visible;
  if(!visible)return;
  elapsed.current+=delta;if(elapsed.current-lastDraw.current<.12)return;lastDraw.current=elapsed.current;
  const ctx=context,w=1024,h=576;ctx.fillStyle='#080d14';ctx.fillRect(0,0,w,h);ctx.fillStyle='#141d2a';ctx.fillRect(0,0,w,58);
  ['#e63946','#f59e0b','#536176'].forEach((color,i)=>{ctx.beginPath();ctx.fillStyle=color;ctx.arc(34+i*30,29,8,0,Math.PI*2);ctx.fill();});
  ctx.fillStyle='#94a3b8';ctx.font='20px monospace';ctx.fillText(mode==='signal'?'irfan / signal terminal':'irfan / studio — terminal',130,36);
  if(mode==='signal'){
   const command='> say hello',typing=Math.min(command.length,Math.max(0,Math.floor((elapsed.current-.8)/.12)));
   ctx.fillStyle='#e8a067';ctx.font='29px monospace';ctx.fillText('CONNECTION OPEN',56,132);
   ctx.fillStyle='#f8fafc';ctx.fillText(command.slice(0,typing),56,198);
   if(typing===command.length&&Math.sin(elapsed.current*4)>0)ctx.fillText('_',56+ctx.measureText(command).width+5,198);
   ctx.fillStyle='#526176';ctx.font='18px monospace';ctx.fillText('A DIRECT LINE TO THE DEVELOPER',56,264);
   ctx.fillStyle=Math.sin(elapsed.current*3)>0?'#ff4d5a':'#536176';ctx.fillRect(56,520,15,28);
  }else{
   const rows=[['>','E63946'],['const systems = [','94A3B8'],['  "AI engineering",','F59E0B'],['  "cloud services",','F59E0B'],['  "microservices"','F59E0B'],['];','94A3B8'],['await systems.connect();','F8FAFC']];
   ctx.font='29px monospace';rows.forEach((row,i)=>{ctx.fillStyle=`#${row[1]}`;ctx.fillText(row[0],56,133+i*54);});
   ctx.fillStyle=Math.sin(elapsed.current*3)>0?'#ff4d5a':'#536176';ctx.fillRect(56,520,15,28);ctx.fillStyle='#526176';ctx.font='18px monospace';ctx.fillText('READY · BUILD / CONNECT / REPEAT',89,541);
  }
  texture.needsUpdate=true;
 });
 return <mesh position={position}><planeGeometry args={[width,height]}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh>;
}
export function Monitor({position=[0,0,0],text='BUILD.\nCONNECT.\nREPEAT.',accent='#e63946',scale=1,onClick,terminal=false,terminalMode='studio'}){
 return <group position={position} scale={scale}><Box size={[2.5,1.5,.14]} color="#080b10" onClick={onClick}/>{terminal?<TerminalScreen position={[0,0,.077]} mode={terminalMode}/>:<Label position={[0,0,.077]} width={2.34} height={1.32} text={text} color={accent}/>}<Box position={[0,-.9,0]} size={[.14,.4,.12]}/><Box position={[0,-1.1,.08]} size={[.75,.05,.45]}/><Box position={[0,-.75,.08]} size={[2.2,.015,.01]} color={accent} emissive={accent}/></group>;
}
export function Room({z=0}){
 return <group position={[0,0,z]}><Box position={[0,-.15,0]} size={[16,.2,13]} color="#0c1018"/><Box position={[0,3,-5]} size={[16,6,.15]} color="#111622"/>{[-6,-3,0,3,6].map(x=><Box key={x} position={[x,3,-4.9]} size={[.035,6,.03]} color="#273040"/>)}<Box position={[0,.02,-4.8]} size={[15,.025,.025]} color="#e63946" emissive="#e63946"/><Box position={[7.5,2,-1]} size={[.02,3,.04]} color="#f59e0b" emissive="#f59e0b"/></group>;
}
