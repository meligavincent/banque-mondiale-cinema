import Link from 'next/link';
export default function NotFound(){return <main id="main" className="error-page flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center"><p className="eyebrow">404</p><h1>Une autre direction.</h1><p>Cette page n’existe pas. Retrouvez le parcours et ses huit rubriques.</p><Link className="credits-return" href="/">Revenir à l’accueil</Link></main>;}
