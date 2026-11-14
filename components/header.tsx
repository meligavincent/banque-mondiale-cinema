'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { Globe2, Menu, Moon, Sun, Search, X, ArrowUpRight, ArrowRight } from 'lucide-react';
import { useSettings } from './providers';
import { chapters } from '@/lib/content';

export function Header() {
  const {dark,toggleTheme}=useSettings();
  const dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLButtonElement|null>(null);
  const [mode,setMode]=useState<'menu'|'search'>('menu'),[query,setQuery]=useState('');
  const open=(next:'menu'|'search',button:HTMLButtonElement)=>{trigger.current=button;setMode(next);setQuery('');dialog.current?.showModal();document.documentElement.classList.add('dialog-open');};
  const close=()=>{dialog.current?.close();};
  const normal=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const matches=chapters.filter(c=>normal(c.name+' '+c.lines.join(' ')+' '+c.intro+' '+c.resources.map(r=>r.title).join(' ')).includes(normal(query)));
  return <>
    <header className="site-header flex items-center justify-between">
      <Link href="/" className="brand inline-flex items-center gap-2.5" aria-label="Banque mondiale — Accueil"><Globe2 size={28} strokeWidth={1.15}/><span>Banque mondiale</span></Link>
      <nav className="header-links hidden items-center gap-8 lg:flex" aria-label="Navigation principale">
        <Link href="/#priorites">Notre action</Link><Link href="/explorer/donnees/">Données</Link><Link href="/explorer/publications/">Publications</Link>
      </nav>
      <div className="flex items-center gap-1 sm:gap-3">
        <button className="icon-button" aria-label="Rechercher" onClick={e=>open('search',e.currentTarget)}><Search size={19}/></button>
        <button className="icon-button theme-toggle" aria-label={dark?'Activer le mode jour':'Activer le mode nuit'} aria-pressed={dark} onClick={toggleTheme}>{dark?<Sun size={19}/>:<Moon size={19}/>}</button>
        <button className="menu-button flex items-center gap-3" onClick={e=>open('menu',e.currentTarget)} aria-label="Ouvrir le menu" aria-haspopup="dialog"><span className="hidden sm:inline">Menu</span><Menu size={22}/></button>
      </div>
    </header>
    <dialog ref={dialog} className="navigation-dialog" onClick={e=>{if(e.target===dialog.current)close();}} onClose={()=>{document.documentElement.classList.remove('dialog-open');trigger.current?.focus();}} aria-labelledby="dialog-title">
      <div className="dialog-inner">
        <div className="flex items-center justify-between gap-5"><p id="dialog-title" className="eyebrow">{mode==='search'?'Rechercher sur le site':'Explorer le monde en mouvement'}</p><button autoFocus className="icon-button" onClick={close} aria-label="Fermer le menu"><X/></button></div>
        {mode==='search'&&<label className="search-field"><Search size={24}/><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Un sujet, une priorité…" aria-label="Votre recherche"/></label>}
        <nav className={mode==='menu'?'menu-grid':'search-results'} aria-label={mode==='menu'?'Toutes les sections':'Résultats de recherche'}>
          {(mode==='menu'?chapters:matches).map((chapter,i)=><Link key={chapter.id} href={mode==='menu'?'/#'+chapter.id:'/explorer/'+chapter.slug+'/'} onClick={close} className="menu-link"><span className="menu-number">{String(i+1).padStart(2,'0')}</span><span>{chapter.name}</span><ArrowRight size={22}/></Link>)}
        </nav>
        {mode==='search'&&<p className="search-count" role="status">{matches.length?`${matches.length} rubrique${matches.length>1?'s':''}`:'Aucun résultat. Essayez « emploi », « eau » ou « projets ».'}</p>}
        <div className="dialog-footer flex flex-wrap items-center justify-between gap-6"><Link href="/credits/" onClick={close}>À propos de ce site</Link><a href="https://www.worldbank.org/en/home" target="_blank" rel="noreferrer">English <ArrowUpRight size={14}/></a></div>
      </div>
    </dialog>
  </>;
}
