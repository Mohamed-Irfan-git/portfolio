import { Component, Suspense, lazy, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioData as data } from './data/portfolio';
import { mergeProjectData, normalizeProjects, savedProjects, snapshotDate } from './data/projects';
import { useMedia } from './hooks/useMedia';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import ProjectDialog from './components/ProjectDialog';
import Guide from './components/Guide';
import LeetCode from './components/LeetCode';
import Blueprint from './components/Blueprint';
import ContactForm from './components/ContactForm';
import RefinedCursor from './components/RefinedCursor';
import ProjectCard from './components/ProjectCard';
import SkillsSection from './components/SkillsSection';
import SplitHeadline from './components/SplitHeadline';
import { chapterAt, chapters } from './three/chapters.js';
import { progressRef } from './three/progress.js';
gsap.registerPlugin(ScrollTrigger);
const Experience = lazy(()=>import('./three/Experience'));
class SceneBoundary extends Component {
 state={failed:false}; static getDerivedStateFromError(){return {failed:true};}
 render(){return this.state.failed?<div className="scene-fallback"><img src="/images/irfan-cinematic.webp" alt=""/><span>Studio view unavailable · All portfolio content is available below.</span></div>:this.props.children;}
}
function Arrow(){return <span aria-hidden="true">↗</span>;}
function Marker({number,children}){return <p className="eyebrow section-marker"><span>{number} /</span> {children}</p>;}
export default function App(){
 const reduced=useMedia('(prefers-reduced-motion: reduce)'),mobile=useMedia('(max-width: 767px)');
 const lowPower=typeof navigator!=='undefined'&&navigator.hardwareConcurrency>0&&navigator.hardwareConcurrency<=4;
 const [simple,setSimple]=useState(false),[menu,setMenu]=useState(false),[active,setActive]=useState('surface');
 const debug=new URLSearchParams(window.location.search).has('debug');
 const [debugProgress,setDebugProgress]=useState(0);
 const [selected,setSelected]=useState(null),[projects,setProjects]=useState(()=>mergeProjectData(savedProjects,data.projects)),[galleryProjects,setGalleryProjects]=useState(()=>mergeProjectData(savedProjects,data.projects,{includeAllFeed:true})),[projectStatus,setProjectStatus]=useState(`Selected projects · GitHub snapshot ${snapshotDate}`),[projectsInView,setProjectsInView]=useState(false),[skill,setSkill]=useState('backend');
 const [leetcodeStats,setLeetcodeStats]=useState(null);
 const [contactSent,setContactSent]=useState(0);
 const [sceneReady,setSceneReady]=useState(false),[sceneProgress,setSceneProgress]=useState(0);
 const activeNav=chapters.find(chapter=>chapter.id===active)?.navId||'home';
 const sceneEnabled=!mobile&&!reduced&&!simple;
 useEffect(()=>{
   if(reduced)return undefined;
   const lenis=new Lenis({anchors:true,autoRaf:false});
   const updateScroll=()=>ScrollTrigger.update();
   const update=(time)=>lenis.raf(time*1000);
   lenis.on('scroll',updateScroll);
   gsap.ticker.add(update);
   gsap.ticker.lagSmoothing(0);
   return()=>{
     gsap.ticker.remove(update);
     lenis.off('scroll',updateScroll);
     lenis.destroy();
     gsap.ticker.lagSmoothing(500,33);
   };
 },[reduced]);
 useEffect(()=>{
   const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),16000);
   (async()=>{for(const url of ['/api/github','https://api.github.com/users/Mohamed-Irfan-git/repos?per_page=100&type=owner&sort=updated']){try{const r=await fetch(url,{signal:controller.signal});if(!r.ok)continue;const json=await r.json();if(!Array.isArray(json))continue;const list=normalizeProjects(json);if(list.length){setProjects(mergeProjectData(list,data.projects));setGalleryProjects(mergeProjectData(list,data.projects,{includeAllFeed:true}));setProjectStatus('Selected project links synced from GitHub');break;}}catch{/* saved repositories stay usable */}}clearTimeout(timer);})();
   return()=>{controller.abort();clearTimeout(timer);};
 },[]);
 useEffect(()=>{
   const section=document.getElementById('projects');
   if(!section)return undefined;
   const observer=new IntersectionObserver(([entry])=>setProjectsInView(entry.isIntersecting),{threshold:.01});
   observer.observe(section);
   return()=>observer.disconnect();
 },[]);
 useEffect(()=>{
   let alive=true;
   const maxScroll=()=>Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
   progressRef.current=Math.min(1,window.scrollY/maxScroll());
   const update=()=>{
     const chapter=chapterAt(progressRef.current);
     setActive(previous=>previous===chapter.id?previous:chapter.id);
     if(debug)setDebugProgress(progressRef.current);
   };
   const tween=gsap.to(progressRef,{current:1,ease:'none',onUpdate:update,scrollTrigger:{trigger:document.documentElement,start:0,end:maxScroll,scrub:1,invalidateOnRefresh:true}});
   update();
   const refresh=()=>{if(alive)ScrollTrigger.refresh();};
   document.fonts.ready.then(refresh);window.addEventListener('load',refresh);
   return()=>{alive=false;tween.kill();window.removeEventListener('load',refresh);};
 },[debug]);
 useEffect(()=>{if(!menu)return;const handler=e=>{if(e.key==='Escape'){setMenu(false);document.querySelector('.menu-toggle')?.focus();}};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler);},[menu]);
 return <div className={`app ${sceneEnabled?'with-scene':'simple-view'} ${activeNav==='home'?'at-entrance':''}`}>
   <a href="#studio" className="skip-link">Skip entrance and go to portfolio</a>
   <header className="site-header"><a href="#home" className="wordmark" aria-label="MIM Irfan home">MIM IRFAN<span>.</span></a><div className="header-coordinate">DEVELOPER’S UNIVERSE <span>01—08</span></div><button className="menu-toggle" aria-label={menu?'Close menu':'Menu'} aria-expanded={menu} aria-controls="main-nav" onClick={()=>setMenu(!menu)}>{menu?'Close −':'Menu +'}</button><nav id="main-nav" className={menu?'is-open':''} aria-label="Main navigation">{[['home','Home'],['about','About'],['projects','Projects'],['skills','Skills']].map(([id,label])=><a key={id} href={`#${id}`} aria-current={activeNav===id?'location':undefined} onClick={()=>setMenu(false)}>{label}</a>)}<a className="nav-contact" href="#contact" aria-current={activeNav==='contact'?'location':undefined} onClick={()=>setMenu(false)}>Let’s talk <Arrow/></a></nav>{!mobile&&!reduced&&<button className="view-toggle" type="button" aria-pressed={simple} onClick={()=>setSimple(!simple)}>{simple?'Enable 3D':'Simple view'}</button>}</header>
   {sceneEnabled&&<div className="experience" aria-hidden="true"><SceneBoundary><Suspense fallback={null}><Experience debug={debug} lowPower={lowPower} selected={selected} projects={galleryProjects} onSelect={setSelected} skillGroups={data.skillGroups} activeSkill={skill} onSkillSelect={setSkill} leetcodeStats={leetcodeStats} contactSent={contactSent} onReady={()=>setSceneReady(true)} onProgress={setSceneProgress}/></Suspense></SceneBoundary></div>}
   {sceneEnabled&&!sceneReady&&<div className="loading-status" role="status"><span className="status-dot"/>Preparing studio {sceneProgress>0?`${Math.round(sceneProgress)}%`:'…'}<button onClick={()=>setSimple(true)}>Use simple view</button></div>}
   <div className="scene-rail" aria-label="Journey chapters">{chapters.map((chapter,i)=><a key={chapter.id} href={`#${chapter.navId}`} aria-label={chapter.label} aria-current={active===chapter.id?'location':undefined}><span>{String(i+1).padStart(2,'0')}</span><i/></a>)}</div>
   {debug&&<output className="camera-debug" aria-live="off">progress {debugProgress.toFixed(3)} · {chapters.find(chapter=>chapter.id===active)?.label}</output>}
   <main>
    <section className="hero section" id="home"><div className="hero-topline"><span className="eyebrow"><span className="status-dot"/> A CURIOUS MIND. A CONNECTED WORLD.</span><span className="eyebrow location">SRI LANKA · 7.87° N, 80.77° E</span></div><div className="hero-copy"><p className="eyebrow red">WELCOME TO MY DIGITAL SPACE</p><SplitHeadline as="h1">BEYOND<br/>THE <span className="outline">INTERFACE</span><span className="red">.</span></SplitHeadline><p className="hero-intro">I’m <strong>Mohamed Irfan.</strong><br/>I build the intelligence behind the experience.</p><p className="hero-description">AI engineering. Cloud. Microservices.<br/>One connected universe of ideas.</p><div className="actions"><a className="button primary" href="#studio">Enter my universe <Arrow/></a><a className="text-link" href="#projects">Skip to the work <span>→</span></a></div></div><div className="hero-portrait-fallback"><img src="/images/irfan-cinematic.webp" alt="Cinematic portrait of Mohamed Irfan in a black jacket, lit with red and amber studio lighting" width="960" height="1200"/><div className="portrait-caption"><span>MIM IRFAN</span><span>THE DEVELOPER’S UNIVERSE</span></div></div><div className="portal-caption"><span className="eyebrow">01 / THE ENTRANCE</span><p>A little curiosity opens new worlds.</p></div><div className="hero-bottom"><a href="#studio" className="scroll-cue"><span>↓</span> SCROLL TO ENTER</a><span className="eyebrow">IDEAS → CODE → EXPERIENCES</span><span className="eyebrow">EST. IN CURIOSITY</span></div></section>
    <section id="studio" className="section studio"><div className="studio-copy reveal"><Marker number="02">THE DIGITAL STUDIO</Marker><SplitHeadline>HELLO, I’M<br/><span className="red">IRFAN.</span></SplitHeadline><p className="role-line">AI, Cloud & Microservices Developer</p><p>{data.identity.heroDescription}</p><div className="actions"><a className="button primary" href="#projects">Explore my work <Arrow/></a><a className="text-link" href="/cv/Irfan-CV.pdf" download>Download CV <Arrow/></a><a className="text-link studio-contact" href="#contact">Contact Me <Arrow/></a></div></div><figure className="studio-portrait reveal"><img src="/images/irfan-cinematic.webp" srcSet="/images/irfan-cinematic-small.webp 480w, /images/irfan-cinematic.webp 960w" sizes="(max-width:760px) 90vw, 38vw" alt="Mohamed Irfan, reimagined in a cinematic developer studio" width="960" height="1200" loading="lazy"/><figcaption><span>MOHAMED IRFAN</span><span>DEVELOPER / SRI LANKA</span></figcaption><span className="portrait-corner">MI / 02</span></figure></section>
    <section id="about" className="section about"><div className="about-heading reveal"><Marker number="03">THE PERSON BEHIND THE CODE</Marker><SplitHeadline>CURIOUS BY NATURE.<br/>BUILDER <span className="outline">BY CHOICE.</span></SplitHeadline></div><div className="about-content reveal"><span className="large-star" aria-hidden="true">✳</span><div><p className="lead">Complex problems.<br/>Thoughtful solutions.</p><p>I’m Mohamed Irfan. I enjoy turning complex problems into software that makes sense. My work brings together AI engineering, cloud development, and microservices.</p><p>I’m interested in what happens behind the interface: how services communicate, how data moves, and how systems stay reliable. Competitive programming keeps me questioning assumptions and looking for a better solution.</p><div className="education"><span className="eyebrow red">CURRENT CHAPTER</span><h3>University of Ruhuna</h3><p>BICT undergraduate · Sri Lanka</p></div><div className="interest-list">{data.aboutInterests.slice(0,4).map(i=><span key={i}>{i}</span>)}</div><a href={data.contact.linkedin} className="text-link" target="_blank" rel="noreferrer">More about me on LinkedIn <Arrow/></a></div></div></section>
    <section id="projects" className="section projects"><div className="section-top reveal"><Marker number="04">SELECTED WORK</Marker><a className="text-link" href={data.contact.github} target="_blank" rel="noreferrer">GitHub profile <Arrow/></a></div><div className="section-heading reveal"><SplitHeadline>IDEAS, <span className="outline">IN ORBIT.</span></SplitHeadline><p>Experiments. Systems. Real-world solutions. A few things I’ve been building.</p></div><div className="project-grid">{projects.map((project,index)=><ProjectCard key={project.name} project={project} number={index+1} onCaseStudy={setSelected}/>)}</div><div className="project-footer"><p className="project-feed-status" role="status">{projectStatus}</p></div></section>
    <section id="skills" className="section skills"><Marker number="05">THE TOOLKIT</Marker><div className="section-heading reveal"><SplitHeadline>DIFFERENT TOOLS.<br/><span className="outline">ONE VISION.</span></SplitHeadline><p>The technologies I build and explore with. Select a discipline to look a little closer.</p></div><SkillsSection groups={data.skillGroups} selectedId={skill} onSelect={setSkill} projects={projects} onProjectSelect={setSelected}/><LeetCode onStats={setLeetcodeStats}/><Blueprint nodes={data.architecture}/></section>
    <section id="contact" className="section contact">
     <Marker number="06">THE NEXT CHAPTER</Marker>
     <div className="contact-status"><span className="status-dot"/> CONNECTION STARTS HERE</div>
     <SplitHeadline className="reveal">GREAT THINGS<br/>START WITH<br/><span className="outline">“HELLO.”</span><a className="contact-arrow" href={`mailto:${data.contact.email}`} aria-label="Email Irfan">↗</a></SplitHeadline>
     <div className="contact-bottom">
      <p>Have an idea, an opportunity, or a problem<br/>worth solving? I’d love to hear about it.</p>
      <a className="contact-email" href={`mailto:${data.contact.email}`}>{data.contact.email}<Arrow/></a>
     </div>
     <div className="social-links">
      <a href={data.contact.github} target="_blank" rel="noreferrer">GitHub <Arrow/></a>
      <a href={data.contact.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow/></a>
      <a href={data.contact.leetcode} target="_blank" rel="noreferrer">LeetCode <Arrow/></a>
      <a href={`mailto:${data.contact.email}`}>Email <Arrow/></a>
     </div>
     <ContactForm email={data.contact.email} onSent={()=>setContactSent(count=>count+1)}/>
    </section>
   </main><footer><a className="wordmark" href="#home">MIM IRFAN<span>.</span></a><span>THOUGHTFULLY BUILT. ALWAYS EVOLVING.</span><span>© {new Date().getFullYear()} MOHAMED IRFAN</span><a href="#home">BACK TO TOP ↑</a></footer><Guide suppressed={Boolean(selected)||activeNav==='contact'||projectsInView}/><ProjectDialog project={selected} onClose={()=>setSelected(null)}/>
   <RefinedCursor disabled={mobile||reduced}/>
 </div>;
}
