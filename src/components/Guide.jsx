import { useEffect, useRef, useState } from 'react';
import { portfolioData as data } from '../data/portfolio';
function answer(question) {
  const q = question.toLowerCase();
  if (/contact|email|reach|linkedin/.test(q)) return { text: `You can reach Irfan at ${data.contact.email}, or connect on LinkedIn.`, href:'#contact', label:'Let’s talk' };
  if (/leetcode|competitive|algorithm/.test(q)) return { text:'Irfan explores data structures, algorithms, and competitive programming. Visit the problem-solving section for his public LeetCode profile and available live stats.', href:'#leetcode', label:'Problem solving' };
  if (/project|work|build|\bai\b/.test(q)) return { text:'Explore tableFlow, Rag-System, help_desk, Nexora, and more in the project gallery. Each project links directly to its public source code.', href:'#projects',label:'Explore projects' };
  if (/skill|tech|java|cloud|backend/.test(q)) return { text:`His toolkit includes ${data.skillGroups.flatMap(group=>group.items.map(item=>item.name)).slice(0,18).join(', ')}.`, href:'#skills',label:'Explore skills' };
  if (/learn|focus|next/.test(q)) return { text:`His current focus is ${data.identity.currentFocus}.`,href:'#about',label:'Meet Irfan' };
  if (/who|irfan|about|study|university/.test(q)) return { text:`${data.identity.name} is an AI, cloud and microservices developer. ${data.identity.education}.`,href:'#about',label:'Meet Irfan' };
  return {text:'Ask me about Irfan’s background, skills, projects, competitive programming, or contact details.'};
}
export default function Guide({suppressed=false}) {
 const [open,setOpen]=useState(false),[value,setValue]=useState(''),[messages,setMessages]=useState([{text:data.assistant.greeting}]);
 const input=useRef(null),toggle=useRef(null),log=useRef(null);
 useEffect(()=>{if(open)input.current?.focus();},[open]);
 useEffect(()=>{if(suppressed)setOpen(false);},[suppressed]);
 useEffect(()=>{log.current?.scrollTo(0,log.current.scrollHeight);},[messages]);
 const close=()=>{setOpen(false);toggle.current?.focus();};
 function ask(q){if(!q.trim())return;setMessages(m=>[...m,{text:q,user:true},answer(q)]);setValue('');}
 return <aside className="guide-widget" hidden={suppressed} onKeyDown={e=>{if(e.key==='Escape')close();}}>{open && <section className="guide-panel" aria-label="DEEP portfolio guide"><header><div><b>DEEP<span className="red">.</span></b><small>YOUR PORTFOLIO GUIDE</small></div><button onClick={close} aria-label="Close guide">×</button></header><div ref={log} className="guide-log" aria-live="polite">{messages.map((m,i)=><div key={i} className={m.user?'message user':'message'}><p>{m.text}</p>{m.href&&<a href={m.href} onClick={close}>{m.label} ↗</a>}</div>)}</div><div className="guide-suggestions">{['Who is Irfan?','Show projects','Contact details'].map(q=><button key={q} onClick={()=>ask(q)}>{q}</button>)}</div><form onSubmit={e=>{e.preventDefault();ask(value);}}><input ref={input} aria-label="Ask about Irfan" value={value} maxLength={500} onChange={e=>setValue(e.target.value)} placeholder="Ask about Irfan…"/><button aria-label="Send question">↗</button></form><small className="fine-print">Local guide · prepared answers, not an AI model.</small></section>}<button ref={toggle} className="guide-toggle" aria-expanded={open} onClick={()=>open?close():setOpen(true)}><span className="guide-symbol">✳</span> Ask DEEP <span>{open?'−':'↗'}</span></button></aside>;
}
