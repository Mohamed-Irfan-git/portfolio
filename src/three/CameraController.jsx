import { useLayoutEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Vector3 } from 'three';
gsap.registerPlugin(ScrollTrigger);
const stops=[
 {id:'home',camera:[.7,2.9,11.5],look:[1.25,2.5,0]},
 {id:'studio',camera:[3,2.6,-.5],look:[2,2,-7]},
 {id:'about',camera:[.3,3,-17],look:[2,2.5,-25]},
 {id:'projects',camera:[.5,3.6,-33],look:[2,2.5,-43]},
 {id:'skills',camera:[1,3.6,-51],look:[3,2.7,-61]},
 {id:'contact',camera:[.5,3,-69],look:[2.8,2.4,-79]},
];
export default function CameraController({door,selected,projects}){
 const {camera,invalidate}=useThree();
 const state=useRef({x:.7,y:2.9,z:11.5,lx:1.25,ly:2.5,lz:0,door:0,focus:0});
 const target=useRef(new Vector3()),look=useRef(new Vector3());
 useLayoutEffect(()=>{
  const ctx=gsap.context(()=>{
   const p=state.current;
   const master=gsap.timeline({scrollTrigger:{trigger:document.documentElement,start:0,end:()=>Math.max(1,document.documentElement.scrollHeight-innerHeight),scrub:.7,invalidateOnRefresh:true,onUpdate:invalidate}});
   const setPath=()=>{
    master.clear();
    const total=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    stops.slice(1).forEach((stop,i)=>{const prev=stops[i];const from=document.getElementById(prev.id).offsetTop/total;const to=document.getElementById(stop.id).offsetTop/total;
     master.fromTo(p,{x:prev.camera[0],y:prev.camera[1],z:prev.camera[2],lx:prev.look[0],ly:prev.look[1],lz:prev.look[2]},{x:stop.camera[0],y:stop.camera[1],z:stop.camera[2],lx:stop.look[0],ly:stop.look[1],lz:stop.look[2],duration:Math.max(.001,to-from),ease:'sine.inOut',immediateRender:false,onUpdate:invalidate},from);
    });master.to(p,{duration:Math.max(.001,1-master.duration()),onUpdate:invalidate});
   };
   setPath(); ScrollTrigger.addEventListener('refreshInit',setPath);
   gsap.to(p,{door:-1.65,ease:'none',scrollTrigger:{trigger:'#home',start:'top top',end:'60% top',scrub:.4},onUpdate:invalidate});
   ctxCleanup.current=()=>ScrollTrigger.removeEventListener('refreshInit',setPath);
  });
  invalidate();return()=>{ctxCleanup.current?.();ctx.revert();};
 },[invalidate]);
 const ctxCleanup=useRef(null);
 useLayoutEffect(()=>{const tween=gsap.to(state.current,{focus:selected?1:0,duration:.8,ease:'power2.inOut',onUpdate:invalidate});return()=>tween.kill();},[selected,invalidate]);
 useFrame(()=>{
  const p=state.current;target.current.set(p.x,p.y,p.z);look.current.set(p.lx,p.ly,p.lz);
  if(p.focus>0){const i=Math.max(0,projects.findIndex(r=>r.name===selected?.name));target.current.lerp(new Vector3((i%2)*4-1,2.8,-38-Math.floor(i/2)*3),p.focus);look.current.lerp(new Vector3((i%2)*4-1,2.7,-42-Math.floor(i/2)*3),p.focus);}
  camera.position.copy(target.current);camera.lookAt(look.current);if(door.current)door.current.rotation.y=p.door;
 });return null;
}
