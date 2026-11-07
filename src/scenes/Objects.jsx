import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';
export function Box({position=[0,0,0],size=[1,1,1],color='#161d29',emissive,rotation,...props}){
 return <mesh position={position} rotation={rotation} castShadow receiveShadow {...props}><boxGeometry args={size}/><meshStandardMaterial color={color} roughness={.5} metalness={.5} emissive={emissive||'#000000'} emissiveIntensity={emissive?2:0}/></mesh>;
}
export function Label({text,position=[0,0,0],width=2,height=.4,color='#d4dbea',background='#101620',small=false}){
 const texture=useMemo(()=>{const c=document.createElement('canvas');c.width=1024;c.height=small?128:512;const ctx=c.getContext('2d');ctx.fillStyle=background;ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`600 ${small?64:72}px monospace`;const lines=text.split('\n');lines.forEach((line,i)=>ctx.fillText(line,512,c.height/2+(i-(lines.length-1)/2)*100,950));const t=new CanvasTexture(c);t.colorSpace=SRGBColorSpace;return t;},[text,color,background,small]);
 useEffect(()=>()=>texture.dispose(),[texture]);
 return <mesh position={position}><planeGeometry args={[width,height]}/><meshBasicMaterial map={texture}/></mesh>;
}
export function Monitor({position=[0,0,0],text='BUILD.\nCONNECT.\nREPEAT.',accent='#e63946',scale=1,onClick}){
 return <group position={position} scale={scale}><Box size={[2.5,1.5,.14]} color="#080b10" onClick={onClick}/><Label position={[0,0,.077]} width={2.34} height={1.32} text={text} color={accent}/><Box position={[0,-.9,0]} size={[.14,.4,.12]}/><Box position={[0,-1.1,.08]} size={[.75,.05,.45]}/><Box position={[0,-.75,.08]} size={[2.2,.015,.01]} color={accent} emissive={accent}/></group>;
}
export function Room({z=0}){
 return <group position={[0,0,z]}><Box position={[0,-.15,0]} size={[16,.2,13]} color="#0c1018"/><Box position={[0,3,-5]} size={[16,6,.15]} color="#111622"/>{[-6,-3,0,3,6].map(x=><Box key={x} position={[x,3,-4.9]} size={[.035,6,.03]} color="#273040"/>)}<Box position={[0,.02,-4.8]} size={[15,.025,.025]} color="#e63946" emissive="#e63946"/><Box position={[7.5,2,-1]} size={[.02,3,.04]} color="#f59e0b" emissive="#f59e0b"/></group>;
}
