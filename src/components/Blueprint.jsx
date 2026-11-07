import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMedia } from '../hooks/useMedia';
import SplitHeadline from './SplitHeadline';

const centers={
 client:[80,210],gateway:[260,210],auth:[440,100],discovery:[440,320],orders:[620,210],events:[800,210],notifications:[980,210],postgres:[620,365],
};
const route=['client','gateway','auth','discovery','orders','postgres','orders','events','notifications'];
const edgePaths=[
 'M155 210 H185',
 'M335 200 C350 190 350 100 365 100',
 'M440 131 V289',
 'M515 320 C535 320 530 210 545 210',
 'M695 210 H725',
 'M875 210 H905',
 'M620 241 V334',
];
const edges=[['client','gateway'],['gateway','auth'],['auth','discovery'],['discovery','orders'],['orders','events'],['events','notifications'],['orders','postgres']];
const flowOrder=['client','gateway','auth','discovery','orders','postgres','events','notifications'];
const STEP_MS=600;

export default function Blueprint({nodes}){
 const mobile=useMedia('(max-width: 760px)');
 const reduced=useMedia('(prefers-reduced-motion: reduce)');
 const compact=mobile||reduced;
 const [activeId,setActiveId]=useState('gateway'),[running,setRunning]=useState(false),[status,setStatus]=useState('');
 const packet=useRef(null),frame=useRef(0),timer=useRef(0);
 const nodeById=useMemo(()=>Object.fromEntries(nodes.map(node=>[node.id,node])),[nodes]);
 const activeNode=nodes.find(node=>node.id===activeId);
 const ordered=flowOrder.map(id=>nodeById[id]).filter(Boolean);
 const reset=useCallback(()=>{
  cancelAnimationFrame(frame.current);clearTimeout(timer.current);frame.current=0;timer.current=0;
  setRunning(false);setActiveId(null);setStatus('');
  packet.current?.setAttribute('visibility','hidden');
 },[]);
 const selectNode=useCallback(id=>{
  cancelAnimationFrame(frame.current);clearTimeout(timer.current);frame.current=0;timer.current=0;
  setRunning(false);setStatus('');setActiveId(id);
  packet.current?.setAttribute('visibility','hidden');
 },[]);
 const sendRequest=useCallback(()=>{
  if(running)return;
  cancelAnimationFrame(frame.current);clearTimeout(timer.current);
  setRunning(true);setStatus('Request in progress');setActiveId(route[0]);
  if(packet.current){packet.current.setAttribute('visibility','visible');packet.current.setAttribute('cx',centers[route[0]][0]);packet.current.setAttribute('cy',centers[route[0]][1]);}
  let step=0,start=0;
  if(compact||typeof requestAnimationFrame==='undefined'){
   const advance=()=>{
    if(step<route.length-1){step+=1;setActiveId(route[step]);}
    if(step>=route.length-1){setRunning(false);setStatus(`Request completed · ${nodeById[route.at(-1)]?.label||'Notification Service'}`);return;}
    timer.current=setTimeout(advance,STEP_MS);
   };
   timer.current=setTimeout(advance,STEP_MS);return;
  }
  const animate=now=>{
   if(!start)start=now;
   const elapsed=now-start;const nextStep=Math.floor(elapsed/STEP_MS);
   while(step<nextStep&&step<route.length-1){step+=1;setActiveId(route[step]);}
   if(step>=route.length-1&&elapsed>=(route.length-1)*STEP_MS){
    if(packet.current){packet.current.setAttribute('cx',centers[route.at(-1)][0]);packet.current.setAttribute('cy',centers[route.at(-1)][1]);}
    setRunning(false);setStatus(`Request completed · ${nodeById[route.at(-1)]?.label||'Notification Service'}`);return;
   }
   const from=centers[route[step]],to=centers[route[Math.min(step+1,route.length-1)]];
   const local=(elapsed-step*STEP_MS)/STEP_MS;
   if(packet.current){packet.current.setAttribute('cx',from[0]+(to[0]-from[0])*local);packet.current.setAttribute('cy',from[1]+(to[1]-from[1])*local);}
   frame.current=requestAnimationFrame(animate);
  };
  frame.current=requestAnimationFrame(animate);
 },[compact,nodeById,running]);
 useEffect(()=>{const onKeyDown=event=>{if(event.key==='Escape'&&(running||status)){reset();}};window.addEventListener('keydown',onKeyDown);return()=>window.removeEventListener('keydown',onKeyDown);},[reset,running,status]);
 useEffect(()=>()=>{cancelAnimationFrame(frame.current);clearTimeout(timer.current);},[]);
 const chooseFromKeyboard=(event,id)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();selectNode(id);}};
 const renderNode=(node)=>{
  if(!node)return null;
  const [x,y]=centers[node.id]||[0,0];
  return <g key={node.id} className={`blueprint-node ${activeId===node.id?'is-active':''}`} role="button" tabIndex={0} aria-pressed={activeId===node.id} aria-label={`${node.label}. ${node.description}`} onClick={()=>selectNode(node.id)} onFocus={()=>selectNode(node.id)} onKeyDown={event=>chooseFromKeyboard(event,node.id)}>
   <rect x={x-75} y={y-31} width="150" height="62" rx="4"/>
   <text x={x} y={node.lines.length>1?y-2:y+5} textAnchor="middle">{node.lines.map((line,index)=><tspan key={line} x={x} dy={index===0?0:19}>{line}</tspan>)}</text>
  </g>;
 };
 return <section className={`blueprint ${compact?'is-compact':''}`} id="philosophy" aria-labelledby="blueprint-heading">
  <div className="blueprint-intro">
   <span className="eyebrow">HOW I THINK / SYSTEM DESIGN</span>
   <SplitHeadline as="h3" id="blueprint-heading">Built to connect.<br/>Designed to grow.</SplitHeadline>
   <button className="button primary blueprint-send" type="button" onClick={sendRequest} disabled={running}>{running?'Sending request…':'Send request'}<span aria-hidden="true">↗</span></button>
   <button className="text-link blueprint-reset" type="button" onClick={reset}>Reset</button>
  </div>
  <div className="blueprint-workbench">
   <svg className="blueprint-diagram" viewBox="0 0 1060 420" role="group" aria-label="System design request flow">
    <defs>
     <marker id="blueprint-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 Z" fill="#64748b"/></marker>
     <filter id="packet-glow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    {edgePaths.map((path,index)=><path key={path} className={`blueprint-edge ${activeId&&edges[index]?.includes(activeId)?'is-active':''}`} d={path} markerEnd="url(#blueprint-arrow)"/>)}
    {nodes.map(renderNode)}
    <circle ref={packet} className="blueprint-packet" cx={centers.client[0]} cy={centers.client[1]} r="8" visibility="hidden" filter="url(#packet-glow)"/>
   </svg>
   <div className="blueprint-compact-flow" aria-label="System design request flow">
    {ordered.map((node,index)=><div className="blueprint-flow-step" key={node.id}>
     {index>0&&<span className="blueprint-flow-arrow" aria-hidden="true">↓</span>}
     <button type="button" aria-pressed={activeId===node.id} className={`blueprint-flow-node ${activeId===node.id?'is-active':''}`} onClick={()=>selectNode(node.id)} onFocus={()=>selectNode(node.id)}>
      <span>{node.label}</span>{node.id==='postgres'&&<small>Connected to Orders Service</small>}
     </button>
    </div>)}
   </div>
   <div className="blueprint-description" aria-live="polite" aria-atomic="true">
    {activeNode?<><span className="eyebrow">{activeNode.label}</span><p>{activeNode.description}</p></>:<p>Select a component to read its description.</p>}
   </div>
   <p className="blueprint-status" role="status" aria-live="polite">{status}</p>
  </div>
 </section>;
}
