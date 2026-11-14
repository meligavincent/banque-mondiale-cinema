# Banque mondiale — Cinéma

Site de démonstration indépendant : Next.js App Router, React 19, React Three Fiber, Three.js, GSAP / ScrollTrigger et Tailwind CSS 4.

## Démarrage

Node.js 22 ou ultérieur.

```sh
npm ci
npm run dev
```

Ouvrir http://localhost:3008. `npm run build` génère le site statique dans `out/`. Servir ce dossier avec un hébergeur statique (ou `python3 -m http.server 3008 --directory out`). `npm start` sert cet export localement ; `next start` n’est pas utilisé pour un export statique.

## Vérifications

```sh
npm run typecheck
npm test
npm run build
```

## Structure

- `components/journey.tsx` : huit sections, chorégraphies typographiques GSAP, ScrollTrigger et lecture cinéma.
- `components/earth-scene.tsx` : scène R3F, textures jour/nuit, nuages, atmosphère et mouvements continus.
- `lib/motion.ts` : trajectoires de caméra, progression bornée, protections contre les dimensions nulles.
- `lib/content.ts` : contenu éditorial, routes et liens vers les ressources officielles.
- `app/explorer/[slug]` : huit pages thématiques pré-générées avec ressources filtrables.
- `components/providers.tsx` : thème mémorisé, réduction des animations et pause de l’ambiance.

Le mode jour est activé par défaut. Le bouton lune active la Terre nocturne ; le choix est conservé en localStorage. Les menus sont des dialogues natifs, utilisables au clavier. La navigation et les contenus restent disponibles si WebGL échoue. Aucun serveur métier, outil de suivi ou formulaire fictif n’est inclus.

## Sources et droits

Contenu et liens : https://www.banquemondiale.org/ext/fr/home, consulté le 14 novembre 2026. Ce projet n’est pas affilié à la Banque mondiale.

Textures : Solar System Scope, CC BY 4.0, données sources NASA. Nuit et nuages téléchargés depuis Wikimedia Commons ; jour depuis le miroir `Shriisoot/Planets-texture` sur GitHub. Redimensionnement en 4096×2048 (jour/nuit), 2048×1024 (nuages), conversion WebP. Attribution et liens disponibles sur `/credits/`.

Les animations de la maquette `banque-mondiale-cinema.html` ont été portées en composants React ; le site ne dépend pas de l’environnement de la conversation.
