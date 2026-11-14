'use client';
import { useCallback, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, ArrowUpRight, ArrowRight } from 'lucide-react';
import { chapters, type Chapter, sourceUrl } from '@/lib/content';
import { type MotionState } from '@/lib/motion';
import { useSettings } from './providers';
const EarthScene=dynamic(()=>import('./earth-scene'),{ssr:false});
export function TopicPage({chapter,index}:{chapter:Chapter;index:number}){
  const root=useRef<HTMLElement>(null),motion=useRef<MotionState>({progress:0,intro:1,pointerX:0,pointerY:0});
  const {reduced}=useSettings();const [category,setCategory]=useState('Tout');
  const ready=useCallback(()=>{},[]);
  const categories=['Tout',...new Set(chapter.resources.map(r=>r.category))];
  const resources=chapter.resources.filter(r=>category==='Tout'||r.category===category);
  useGSAP(()=>{
    gsap.from('.topic-reveal',{y:reduced?0:40,opacity:0,duration:reduced?0:1.25,stagger:.12,ease:'power3.out'});
  },{scope:root,dependencies:[reduced],revertOnUpdate:true});
  const next=chapters[(index+1)%chapters.length];
  return <main id="main" className="topic-page" ref={root}>
    <div className="topic-planet"><EarthScene motion={motion} onReady={ready}/></div>
    <div className="topic-content">
      <Link className="back-link inline-flex items-center gap-3 topic-reveal" href={'/#'+chapter.id} scroll={false}><ArrowLeft size={16}/>Retour au voyage</Link>
      <p className="eyebrow topic-reveal">{chapter.eyebrow}</p>
      <h1 className="topic-title topic-reveal">{chapter.name}</h1>
      <p className="topic-intro topic-reveal">{chapter.intro}</p>
      <div className="resource-section topic-reveal">
        <div className="resource-header flex flex-wrap items-center justify-between gap-5"><h2>Pour aller plus loin</h2><p>{chapter.resources.length} ressources</p></div>
        {categories.length>3&&<div className="resource-filters flex flex-wrap gap-2" aria-label="Filtrer les ressources">{categories.map(c=><button key={c} onClick={()=>setCategory(c)} aria-pressed={category===c}>{c}</button>)}</div>}
        <div className="resource-list" aria-live="polite">{resources.map(resource=><a className="resource-link" key={resource.href} href={resource.href} target="_blank" rel="noopener noreferrer"><div><span className="resource-category">{resource.category}</span><h3>{resource.title}</h3><p>{resource.description}</p></div><ArrowUpRight size={24}/><span className="sr-only">(site officiel, nouvel onglet)</span></a>)}</div>
      </div>
      <nav className="next-topic" aria-label="Rubrique suivante"><span>Poursuivre l’exploration</span><Link href={'/explorer/'+next.slug+'/'}>{next.name}<ArrowRight/></Link></nav>
      <footer className="page-footer flex flex-wrap justify-between gap-4"><Link href="/credits/">Concept indépendant · Crédits</Link><a href={sourceUrl} target="_blank" rel="noreferrer">Le site officiel <ArrowUpRight size={13}/></a></footer>
    </div>
  </main>;
}
