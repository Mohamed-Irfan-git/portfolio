import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { CanvasTexture, SRGBColorSpace } from 'three';
import { progressRef } from '../three/progress.js';
import { portfolioData } from '../data/portfolio';
import { Box, Label, Monitor, Room } from './Objects';

export function AboutScene(){return <group position={[0,0,-24]}><Room/></group>;}

function ProjectNode({project,index,position,onSelect}){
 const texture=useMemo(()=>{
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=576;
  const ctx=canvas.getContext('2d');const color=['#ff7380','#daa978','#97a9bf','#a2b8a3'][index%4];
  ctx.fillStyle='#0d1420';ctx.fillRect(0,0,1024,576);
  ctx.strokeStyle='#ffffff12';ctx.lineWidth=1;
  for(let x=42;x<1024;x+=64){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,576);ctx.stroke();}
  ctx.fillStyle=color;ctx.fillRect(0,0,1024,12);
  ctx.font='24px monospace';ctx.fillStyle='#94a3b8';ctx.fillText(`PROJECT / ${String(index+1).padStart(2,'0')}`,54,74);
  const words=project.name.replaceAll('_',' ').split(/\s+/);let lines=[],line='';
  ctx.font='600 66px sans-serif';
  for(const word of words){const next=line?`${line} ${word}`:word;if(ctx.measureText(next).width>900&&line){lines.push(line);line=word;}else line=next;}if(line)lines.push(line);
  const titleSize=lines.length>2?50:66;ctx.font=`600 ${titleSize}px sans-serif`;ctx.fillStyle='#f8fafc';
  lines.slice(0,3).forEach((text,i)=>ctx.fillText(text,54,220+i*78));
  ctx.fillStyle=color;ctx.fillRect(54,470,66,4);
  ctx.font='24px monospace';ctx.fillStyle='#b7c2d2';ctx.fillText(project.language||'Source code',54,524);
  const map=new CanvasTexture(canvas);map.colorSpace=SRGBColorSpace;return map;
 },[project.name,project.language,index]);
 useEffect(()=>()=>texture.dispose(),[texture]);
 return <group position={position} rotation={[0,index%2===0?.04:-.04,0]} onPointerOver={event=>{event.stopPropagation();document.body.style.cursor='pointer';}} onPointerOut={()=>{document.body.style.cursor='';}}>
  <mesh castShadow>
   <boxGeometry args={[3.42,2.1,.16]}/>
   <meshStandardMaterial color="#161e2a" metalness={.72} roughness={.28} emissive="#e63946" emissiveIntensity={.16}/>
  </mesh>
  <mesh position={[0,0,.09]} onClick={event=>{event.stopPropagation();onSelect(project);}}>
   <planeGeometry args={[3.28,1.96]}/>
   <meshBasicMaterial map={texture} toneMapped={false}/>
  </mesh>
  <Box position={[0,1.06,.05]} size={[3.44,.025,.035]} color="#ff4d5a" emissive="#ff4d5a"/>
  <Box position={[0,-1.06,.05]} size={[3.44,.025,.035]} color="#ff4d5a" emissive="#ff4d5a"/>
  <Box position={[-1.71,0,.05]} size={[.025,2.1,.035]} color="#ff4d5a" emissive="#ff4d5a"/>
  <Box position={[1.71,0,.05]} size={[.025,2.1,.035]} color="#ff4d5a" emissive="#ff4d5a"/>
 </group>;
}

function ProjectConnections({nodes}){
 const root=useRef(),packets=useRef([]);
 const links=nodes.slice(0,-1).map((node,index)=>({from:node.position,to:nodes[index+1].position}));
 useFrame(()=>{
  const progress=progressRef.current;
  const systemProgress=Math.max(0,Math.min(1,(progress-.37)/.26));
  if(root.current)root.current.visible=progress>=.35&&progress<=.66;
  packets.current.forEach((packet,index)=>{
   if(!packet||!links[index])return;
   const phase=(systemProgress*2.8+index*.31)%1;
   packet.position.set(
    links[index].from[0]+(links[index].to[0]-links[index].from[0])*phase,
    links[index].from[1]+(links[index].to[1]-links[index].from[1])*phase,
    links[index].from[2]+(links[index].to[2]-links[index].from[2])*phase,
   );
  });
 });
 return <group ref={root}>
  {links.map((link,index)=><Line key={`link-${index}`} points={[link.from,link.to]} color="#b14c63" lineWidth={1.25} transparent opacity={.36} depthWrite={false}/>) }
  {links.map((link,index)=><mesh key={`packet-${index}`} ref={node=>{packets.current[index]=node;}}>
    <sphereGeometry args={[.075,10,8]}/>
    <meshBasicMaterial color={index%2?'#f59e0b':'#ff4d5a'} toneMapped={false}/>
  </mesh>)}
 </group>;
}

export function ProjectGallery({projects=[],onSelect}){
 const nodes=useMemo(()=>projects.map((project,index)=>({project,index,position:[index%2===0?-3.65:3.65,2.8+(index%2)*.35,-20-Math.floor(index/2)*4.4]})),[projects]);
 return <group>
  <ProjectConnections nodes={nodes}/>
  {nodes.map(node=><ProjectNode key={node.project.name} project={node.project} index={node.index} position={node.position} onSelect={onSelect}/>) }
 </group>;
}

function SkillRings({groups,activeId,onSelect,onHover}){
 const rings=useRef([]);
 useFrame((_,delta)=>rings.current.forEach((ring,index)=>{if(ring)ring.rotation.z+=delta*(index%2===0?.035:-.035);}));
 return <group position={[0,2.8,-1]}>
  {groups.map((group,index)=>{
   const radius=2.05+index*.2,selected=group.id===activeId;
   return <group key={group.id} ref={node=>{rings.current[index]=node;}} rotation={[.18+index*.12,index*.19,index*.43]}>
    <mesh onClick={event=>{event.stopPropagation();onSelect(group.id);}} onPointerOver={event=>{event.stopPropagation();onHover(group.id);document.body.style.cursor='pointer';}} onPointerOut={()=>{onHover(null);document.body.style.cursor='';}}>
     <torusGeometry args={[radius,.018,8,112]}/>
     <meshStandardMaterial color={selected?'#ff5965':'#7c6570'} emissive={selected?'#e63946':'#3e222b'} emissiveIntensity={selected?1.35:.25} metalness={.72} roughness={.34}/>
    </mesh>
    <mesh position={[radius,0,0]} onClick={event=>{event.stopPropagation();onSelect(group.id);}} onPointerOver={event=>{event.stopPropagation();onHover(group.id);document.body.style.cursor='pointer';}} onPointerOut={()=>{onHover(null);document.body.style.cursor='';}}>
     <sphereGeometry args={[selected ? .105 : .065,12,10]}/>
     <meshBasicMaterial color={selected?'#ff4d5a':'#9b7180'} toneMapped={false}/>
    </mesh>
   </group>;
  })}
 </group>;
}
export function SkillsScene({skillGroups=[],activeSkill,onSkillSelect,leetcodeStats}){
 const [hovered,setHovered]=useState(null);
 const technologyPanel=useRef(),scorePanel=useRef();
 const active=skillGroups.find(group=>group.id===activeSkill)||skillGroups[0];
 const displayed=skillGroups.find(group=>group.id===hovered)||active;
 const technologies=displayed?.skills||[];
 const rows=[];for(let index=0;index<technologies.length;index+=2)rows.push(technologies.slice(index,index+2).join(' · '));
 const panelText=displayed?[displayed.title.toUpperCase(),...rows].join('\n'):'';
 const score=leetcodeStats||{...portfolioData.leetcodeFallback,source:'baseline'};
 const scoreRows=[
  `LEETCODE / ${score.source==='live'?'LIVE':score.source==='cached'?'CACHE':'BASELINE'}`,
  `${score.totalSolved} SOLVED`,
  `EASY ${score.difficulties.find(item=>item.name==='Easy')?.solved??'—'} · MEDIUM ${score.difficulties.find(item=>item.name==='Medium')?.solved??'—'}`,
  `HARD ${score.difficulties.find(item=>item.name==='Hard')?.solved??'—'}`,
  `RANK ${score.profileRanking?.toLocaleString()??'—'} · RATING ${score.contestRating==null?'—':String(score.contestRating)}`,
  `CONTESTS ${score.contestsAttended??'—'}`,
 ];
 useFrame(()=>{
  const progress=progressRef.current;
  if(technologyPanel.current)technologyPanel.current.visible=progress>=.63&&progress<.76;
  if(scorePanel.current)scorePanel.current.visible=progress>=.76&&progress<.84;
 });
 return <group position={[0,0,-60]}>
  <mesh position={[0,2.8,-1]}>
   <sphereGeometry args={[1.05,40,32]}/>
   <meshPhysicalMaterial color="#b4253b" emissive="#e63946" emissiveIntensity={1.6} roughness={.22} metalness={.28} clearcoat={1}/>
  </mesh>
  <mesh position={[0,2.8,-1]}>
   <sphereGeometry args={[1.4,32,24]}/>
   <meshBasicMaterial color="#e63946" transparent opacity={.075} depthWrite={false} toneMapped={false}/>
  </mesh>
  <pointLight position={[0,2.8,-1]} color="#e63946" intensity={14} distance={13}/>
  <pointLight position={[-3,4,-2]} color="#f59e0b" intensity={3.5} distance={10}/>
  <Label text="THE CORE / TOOLKIT" position={[0,4.55,-1]} width={3.1} height={.34} small color="#e8c8ce" background="#111827"/>
  <SkillRings groups={skillGroups} activeId={hovered||active?.id} onHover={setHovered} onSelect={onSkillSelect}/>
  <group ref={scorePanel}><Monitor position={[-5.3,3,-1]} scale={1.1} text={scoreRows.join('\n')} accent="#f59e0b"/></group>
  {displayed&&<group ref={technologyPanel}><Monitor position={[5.3,3,-1]} scale={1.45} text={panelText} accent="#ff7580"/></group>}
 </group>;
}
export function ContactScene({sent=false}){
 const pulseLight=useRef(),pulseTime=useRef(0);
 useEffect(()=>{if(sent)pulseTime.current=0;},[sent]);
 useFrame((_,delta)=>{
  if(!pulseLight.current)return;
  if(!sent){pulseLight.current.intensity=3;return;}
  pulseTime.current=Math.min(2,pulseTime.current+delta);
  const pulse=Math.sin((pulseTime.current/2)*Math.PI);
  pulseLight.current.intensity=3+9*pulse;
 });
 return <group position={[0,0,-78]}><Room/><Monitor position={[3,2.7,-1]} scale={1.6} terminal terminalMode="signal" accent="#e8a067"/><Box position={[3,1.3,-1]} size={[5.6,.2,2]}/><pointLight ref={pulseLight} position={[3,2,1]} color="#e63946" intensity={3} distance={8}/></group>;
}
