import { useEffect, useRef, useState } from 'react';
import { portfolioData as data } from '../data/portfolio';
import { useMedia } from '../hooks/useMedia';

const CACHE_KEY='mim-irfan.leetcode.stats.v1';
const ORDER=['Easy','Medium','Hard'];

function normalizeStats(value){
 if(value?.username!=='Mhd_irfan369'||!Array.isArray(value.difficulties))return null;
 const difficulties=ORDER.map(name=>{
  const item=value.difficulties.find(difficulty=>difficulty.name===name);
  const solved=Number(item?.solved);
  if(!Number.isFinite(solved)||solved<0)return null;
  return {name,solved,total:Number.isFinite(Number(item?.total))?Number(item.total):null};
 });
 if(difficulties.some(item=>!item))return null;
 const totalSolved=Number(value.totalSolved);
 if(!Number.isFinite(totalSolved)||totalSolved<0)return null;
 const optionalNumber=number=>number==null?null:(Number.isFinite(Number(number))?Number(number):null);
 return {
  username:value.username,totalSolved,difficulties,
  profileRanking:optionalNumber(value.profileRanking),
  contestRating:optionalNumber(value.contestRating),
  contestsAttended:optionalNumber(value.contestsAttended),
  updatedAt:typeof value.updatedAt==='string'?value.updatedAt:null,
 };
}

function initialStats(){
 try{
  const cached=normalizeStats(JSON.parse(localStorage.getItem(CACHE_KEY)||'null'));
  if(cached?.updatedAt)return {...cached,source:'cached'};
 }catch{/* Continue to the dated-by-source portfolio baseline. */}
 return {...data.leetcodeFallback,username:'Mhd_irfan369',updatedAt:null,source:'baseline'};
}

function formatDate(value){
 if(!value)return null;
 const date=new Date(value);
 return Number.isNaN(date.getTime())?null:new Intl.DateTimeFormat(undefined,{year:'numeric',month:'short',day:'numeric'}).format(date);
}

function statusFor(stats){
 if(stats.source==='live')return `Live LeetCode statistics · Updated ${formatDate(stats.updatedAt)}`;
 if(stats.source==='cached')return `Cached values · Last updated: ${formatDate(stats.updatedAt)}`;
 return 'Portfolio baseline · update date unavailable';
}

export default function LeetCode({onStats}){
 const [stats,setStats]=useState(initialStats);
 const [count,setCount]=useState(0);
 const scoreRef=useRef(null),entered=useRef(false),completed=useRef(false),countRef=useRef(0),frameRef=useRef(0);
 const reduced=useMedia('(prefers-reduced-motion: reduce)');
 useEffect(()=>{onStats?.(stats);},[stats,onStats]);
 useEffect(()=>{
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),14000);
  fetch('/api/leetcode',{signal:controller.signal})
   .then(response=>{if(!response.ok)throw Error('LeetCode request failed');return response.json();})
   .then(value=>{
    const normalized=normalizeStats(value);if(!normalized)throw Error('LeetCode response is incomplete');
    const live={...normalized,updatedAt:new Date().toISOString(),source:'live'};
    try{localStorage.setItem(CACHE_KEY,JSON.stringify({...normalized,updatedAt:live.updatedAt}));}catch{/* Live values remain visible if storage is unavailable. */}
    setStats(live);
   })
   .catch(()=>{/* Keep the cached values or labelled portfolio baseline visible. */})
   .finally(()=>clearTimeout(timer));
  return()=>{clearTimeout(timer);controller.abort();};
 },[]);
 useEffect(()=>{
  const total=stats.totalSolved;
  if(reduced){countRef.current=total;setCount(total);entered.current=true;completed.current=true;return;}
  if(completed.current){countRef.current=total;setCount(total);return;}
  let observer;
  const animate=()=>{
   if(completed.current)return;
   entered.current=true;
   cancelAnimationFrame(frameRef.current);
   const from=countRef.current,start=performance.now(),duration=900;
   const tick=now=>{
    const progress=Math.min(1,(now-start)/duration);
    const eased=1-Math.pow(1-progress,3);
    const value=progress===1?total:Math.floor(from+(total-from)*eased);
    countRef.current=value;setCount(value);
    if(progress<1)frameRef.current=requestAnimationFrame(tick);
    else completed.current=true;
   };
   frameRef.current=requestAnimationFrame(tick);
  };
  if(entered.current){animate();return()=>cancelAnimationFrame(frameRef.current);}
  if(!scoreRef.current||typeof IntersectionObserver==='undefined'){animate();return()=>cancelAnimationFrame(frameRef.current);}
  observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){animate();observer.disconnect();}},{threshold:.35});
  observer.observe(scoreRef.current);
  return()=>{observer?.disconnect();};
 },[stats.totalSolved,reduced]);

 const status=statusFor(stats);
 return <section className="leetcode-panel" id="leetcode" aria-labelledby="leetcode-heading">
  <div className="leetcode-intro">
   <span className="eyebrow">THE PROBLEM-SOLVING MINDSET</span>
   <h3 id="leetcode-heading">Think deeply.<br/>Solve precisely.</h3>
   <a className="text-link" href="https://leetcode.com/u/Mhd_irfan369/" target="_blank" rel="noreferrer">Explore my LeetCode ↗</a>
  </div>
  <div className="coding-stats" aria-label="LeetCode scoreboard">
   <div className="scoreboard-total" ref={scoreRef}>
    <span className="stat-number">{count.toLocaleString()}</span>
    <span className="scoreboard-label">PROBLEMS SOLVED</span>
   </div>
   <div className="difficulty" aria-label={`Difficulty totals out of ${stats.totalSolved} solved`}>
    {stats.difficulties.map(item=>{
     const proportion=stats.totalSolved>0?item.solved/stats.totalSolved*100:0;
     return <div className={`difficulty-row difficulty-${item.name.toLowerCase()}`} key={item.name}>
      <div className="difficulty-label"><span>{item.name}</span><strong>{item.solved}</strong></div>
      <div className="difficulty-track" role="img" aria-label={`${item.name}: ${item.solved} of ${stats.totalSolved} solved`}><span style={{width:`${proportion}%`}}/></div>
     </div>;
    })}
   </div>
   <div className="rank-labels" aria-label="Contest profile">
    <span>RANK <b>{stats.profileRanking?.toLocaleString()??'—'}</b></span>
    <span>RATING <b>{stats.contestRating==null?'—':String(stats.contestRating)}</b></span>
    <span>CONTESTS <b>{stats.contestsAttended?.toLocaleString()??'—'}</b></span>
   </div>
   <p className={`stats-status stats-${stats.source}`} role="status">{status}</p>
  </div>
 </section>;
}
