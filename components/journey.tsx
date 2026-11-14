'use client';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Pause, Play } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';
import { chapters } from '@/lib/content';
import { clamp, safeProgress, sectionIndex, shots, smooth, type MotionState } from '@/lib/motion';
import { useSettings } from './providers';
const EarthScene=dynamic(()=>import('./earth-scene'),{ssr:false});

function AnimatedTitle({lines,first}:{lines:[string,string];first:boolean}) {
  const Tag=first?'h1':'h2';
  return <Tag className="chapter-title" aria-label={lines.join(' ')}><span className="title-float" aria-hidden="true">{lines.map((line,i)=><span className="title-line" key={line}>{line.split(/(\s+)/).map((word,j)=><span className="title-word" key={j}>{Array.from(word).map((char,k)=><span className="title-char" data-line={i} key={k}>{char}</span>)}</span>)}</span>)}</span></Tag>;
}

export default function Journey() {
  const root=useRef<HTMLDivElement>(null),stage=useRef<HTMLDivElement>(null),bar=useRef<HTMLDivElement>(null);
  const motion=useRef<MotionState>({progress:0,intro:0,pointerX:0,pointerY:0});
  const trigger=useRef<ScrollTrigger|null>(null),scrollTween=useRef<gsap.core.Tween|null>(null);
  const [active,setActive]=useState(0),[playing,setPlaying]=useState(false),[loaded,setLoaded]=useState(false);
  const {reduced,paused,toggleMotion,dark}=useSettings();
  const ready=useCallback(()=>setLoaded(true),[]);
  const navigate=useCallback((raw:number)=>{
    const i=sectionIndex(raw),st=trigger.current;
    if(!st)return;
    scrollTween.current?.kill();
    const y=st.start+(st.end-st.start)*i/7;
    if(reduced){window.scrollTo({top:y,behavior:'instant'});}
    else scrollTween.current=gsap.to(window,{scrollTo:{y,autoKill:true},duration:2.4,ease:'power2.inOut'});
    history.replaceState(null,'','#'+chapters[i].id);
  },[reduced]);
  useGSAP(()=>{
    gsap.registerPlugin(ScrollTrigger,ScrollToPlugin,useGSAP);
    if(!root.current||!stage.current)return;
    const articles=Array.from(stage.current.querySelectorAll<HTMLElement>('.chapter'));
    const timelines=articles.map((article,i)=>{
      const chars=article.querySelectorAll('.title-char'),meta=article.querySelectorAll('.chapter-meta');
      const tl=gsap.timeline({paused:true});
      const mode=i%4;
      tl.fromTo(chars,{
        opacity:0,y:mode===0?110:mode===2?-65:20,z:mode===2?280:-340,
        x:(n:number)=>mode===1?(n%2?170:-170):mode===3?(n%2?-150:150):0,
        rotationX:mode===0?75:0,rotationY:mode===1?55:0,rotation:mode===3?10:0,
        filter:'blur(6px)',
      },{opacity:1,x:0,y:0,z:0,rotationX:0,rotationY:0,rotation:0,filter:'blur(0px)',duration:reduced?0:1.5,stagger:reduced?0:.024,ease:'power4.out'},0)
      .fromTo(meta,{opacity:0,y:18},{opacity:1,y:0,duration:reduced?0:.9,stagger:.1,ease:'power2.out'},reduced?0:.38);
      return tl;
    });
    let current=-1;
    const update=()=>{
      const p=safeProgress(motion.current.progress),i=sectionIndex(p),distance=Math.abs(p-i);
      if(i!==current){current=i;setActive(i);}
      articles.forEach((article,j)=>{
        const d=p-j,opacity=1-smooth(.14,.45,Math.abs(d));
        const visible=opacity>.02;
        article.inert=!visible;article.setAttribute('aria-hidden',String(!visible));
        gsap.set(article,{autoAlpha:opacity,y:reduced?0:-d*70,rotationY:reduced?0:d*(shots[j].tx>.4?-9:9)});
        if(j===i&&distance<.29){if(timelines[j].paused())timelines[j].play();}
        else if(Math.abs(d)>.48)timelines[j].pause(0);
      });
      if(bar.current)bar.current.style.transform=`scaleX(${p/7})`;
    };
    const animation=gsap.to(motion.current,{progress:7,ease:'none',onUpdate:update,scrollTrigger:{
      trigger:root.current,start:'top top',end:'bottom bottom',scrub:reduced?true:.7,invalidateOnRefresh:true,
    }});
    trigger.current=animation.scrollTrigger??null;
    const hash=location.hash.slice(1),target=chapters.findIndex(c=>c.id===hash);
    if(target>0){motion.current.intro=1;requestAnimationFrame(()=>navigate(target));}
    update();
    const hashChange=()=>{const i=chapters.findIndex(c=>c.id===location.hash.slice(1));if(i>=0){setPlaying(false);navigate(i);}};
    const onAnchor=(e:MouseEvent)=>{
      const el=(e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="/#"],a[href^="#"]');
      if(!el)return;
      const i=chapters.findIndex(c=>c.id===el.hash.slice(1));
      if(i>=0){e.preventDefault();setPlaying(false);navigate(i);}
    };
    const interrupt=()=>{setPlaying(false);scrollTween.current?.kill();};
    window.addEventListener('hashchange',hashChange);document.addEventListener('click',onAnchor);
    window.addEventListener('wheel',interrupt,{passive:true});window.addEventListener('touchstart',interrupt,{passive:true});
    const onKey=(e:KeyboardEvent)=>{if((e.target as HTMLElement).closest('input,button,a,select,dialog'))return;if(e.key==='ArrowDown'||e.key==='PageDown'){e.preventDefault();setPlaying(false);navigate(sectionIndex(motion.current.progress)+1);}if(e.key==='ArrowUp'||e.key==='PageUp'){e.preventDefault();setPlaying(false);navigate(sectionIndex(motion.current.progress)-1);}};
    window.addEventListener('keydown',onKey);
    return()=>{animation.kill();trigger.current=null;scrollTween.current?.kill();window.removeEventListener('hashchange',hashChange);document.removeEventListener('click',onAnchor);window.removeEventListener('wheel',interrupt);window.removeEventListener('touchstart',interrupt);window.removeEventListener('keydown',onKey);};
  },{scope:root,dependencies:[reduced,navigate],revertOnUpdate:true});
  useGSAP(()=>{
    if(loaded){gsap.to(motion.current,{intro:1,duration:reduced?0:3.2,ease:'power2.inOut'});}
  },{scope:root,dependencies:[loaded,reduced]});
  useGSAP(()=>{
    if(reduced||paused)return;
    gsap.to('.title-float',{y:5,x:3,duration:3.6,ease:'sine.inOut',repeat:-1,yoyo:true});
  },{scope:root,dependencies:[reduced,paused],revertOnUpdate:true});
  useEffect(()=>{
    if(!playing)return;
    const timer=window.setInterval(()=>{
      const i=sectionIndex(motion.current.progress);
      if(i>=7){setPlaying(false);return;}navigate(i+1);
    },5800);
    return()=>clearInterval(timer);
  },[playing,navigate]);
  return <main id="main" ref={root} className="journey" onPointerMove={e=>{if(e.pointerType!=='touch'){motion.current.pointerX=clamp(e.clientX/window.innerWidth*2-1,-1,1);motion.current.pointerY=clamp(e.clientY/window.innerHeight*2-1,-1,1);}}} onPointerLeave={()=>{motion.current.pointerX=motion.current.pointerY=0;}}>
    <div className="journey-stage" ref={stage}>
      <EarthScene motion={motion} onReady={ready}/>
      {!loaded&&<span className="scene-loading" role="status">Chargement de la Terre…</span>}
      {chapters.map((chapter,i)=>{
        const shot=shots[i];return <section key={chapter.id} id={chapter.id} className={'chapter'+(shot.center?' chapter-centered':'')} style={{'--copy-x':`${shot.tx*100}%`,'--copy-y':`${shot.ty*100}%`,'--copy-w':`${shot.tw*100}%`,'--title-size':`${shot.fs}vw`,'--initial-opacity':i===0?1:0} as CSSProperties} aria-label={chapter.name}>
          <p className="eyebrow chapter-meta">{chapter.eyebrow}</p>
          <AnimatedTitle lines={chapter.lines} first={i===0}/>
          <p className="chapter-description chapter-meta">{chapter.description}</p>
          <Link href={`/explorer/${chapter.slug}/`} className="chapter-cta chapter-meta"><span>{chapter.cta}</span><span className="arrow-circle"><ArrowUpRight size={20}/></span></Link>
        </section>;
      })}
      <aside className="scene-caption hidden xl:flex" aria-label="Scène terrestre"><span className="live-dot"/>{dark?'La Terre, après le coucher du soleil':'Une planète. Des possibilités infinies.'}</aside>
      <div className="journey-bottom flex items-end justify-between gap-6">
        <div className="chapter-index"><span>{String(active+1).padStart(2,'0')}</span><span className="index-divider"/><span>08</span><p aria-live="polite">{chapters[active].name}</p></div>
        <nav className="chapter-dots hidden md:flex" aria-label="Parcourir les sections">{chapters.map((c,i)=><button key={c.id} onClick={()=>{setPlaying(false);navigate(i);}} aria-label={c.name} aria-current={i===active?'step':undefined}><span/><span className="dot-label">{c.name}</span></button>)}</nav>
        <button className="scroll-button flex items-center gap-4" onClick={()=>{setPlaying(false);navigate(active===7?0:active+1);}}><span>{active===7?'Recommencer':'Défiler pour explorer'}</span><ArrowDown size={20} className={active===7?'rotate-180':''}/></button>
      </div>
      <div className="journey-progress" aria-hidden="true"><div ref={bar}/></div>
      <div className="cinema-controls flex items-center gap-4">
        <button onClick={()=>{if(!playing&&active===7)navigate(0);setPlaying(p=>!p);}} aria-label={playing?'Arrêter la séquence':'Lancer la séquence'} aria-pressed={playing}>{playing?<Pause size={14}/>:<Play size={14}/>}<span>{playing?'Pause':'Lecture cinéma'}</span></button>
        <button onClick={toggleMotion} aria-label={paused?'Reprendre les mouvements ambiants':'Suspendre les mouvements ambiants'} aria-pressed={paused} className="ambient-control">{paused?<Play size={12}/>:<Pause size={12}/>}<span>Mouvement</span></button>
        <Link href="/credits/" className="concept-link">Concept indépendant</Link>
      </div>
    </div>
  </main>;
}
