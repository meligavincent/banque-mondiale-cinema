import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { Header } from '@/components/header';
import './globals.css';
export const metadata:Metadata={
  title:{default:'Banque mondiale — Un avenir. Pour chacun.',template:'%s — Banque mondiale'},
  description:'Une exploration des priorités, des données et de l’action du Groupe de la Banque mondiale. Concept indépendant avec une Terre en trois dimensions.',
  robots:{index:false,follow:false},
  icons:{icon:'/icon.svg'},
};
const themeInit=`try{document.documentElement.dataset.theme=localStorage.getItem('wb-theme')==='dark'?'dark':'light'}catch{document.documentElement.dataset.theme='light'}`;
export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="fr" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:themeInit}}/></head><body><Providers><a className="skip-link" href="#main">Aller au contenu</a><Header/>{children}</Providers></body></html>;
}
