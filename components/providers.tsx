'use client';
import { createContext, useContext, useEffect, useState } from 'react';
type Settings = { dark: boolean; toggleTheme: () => void; reduced: boolean; paused: boolean; toggleMotion: () => void };
const SettingsContext = createContext<Settings>({dark:false,toggleTheme:()=>{},reduced:false,paused:false,toggleMotion:()=>{}});
export const useSettings = () => useContext(SettingsContext);
export function Providers({children}:{children:React.ReactNode}) {
  const [dark,setDark]=useState(false), [reduced,setReduced]=useState(false), [paused,setPaused]=useState(false);
  useEffect(()=>{
    setDark(document.documentElement.dataset.theme==='dark');
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>setReduced(media.matches);update();media.addEventListener('change',update);
    return ()=>media.removeEventListener('change',update);
  },[]);
  const toggleTheme=()=>setDark(value=>{
    const next=!value;document.documentElement.dataset.theme=next?'dark':'light';
    try{localStorage.setItem('wb-theme',next?'dark':'light');}catch{}
    return next;
  });
  return <SettingsContext.Provider value={{dark,toggleTheme,reduced,paused,toggleMotion:()=>setPaused(p=>!p)}}>{children}</SettingsContext.Provider>;
}
