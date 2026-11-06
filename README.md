# SPIKE PROTOCOL

Jeu d'arcade en navigateur : esquivez les pointes, rebondissez entre les parois et récupérez les éclats de données pour battre votre record.

## Jouer

Le jeu est conçu pour fonctionner dans un navigateur moderne, sur ordinateur comme sur écran tactile.

- **Souris / tactile :** toucher l'écran pendant une partie pour donner une impulsion.
- **Clavier :** Espace, Flèche haut ou W pour donner une impulsion.
- **Pause :** Échap ou P.
- **Son :** bouton en haut à droite.

Le record est enregistré localement dans le navigateur utilisé. Il n'est pas synchronisé entre appareils.

## Développement

Prérequis : Node.js 22 ou version compatible avec Vite 7.

```bash
npm ci
npm run dev
```

## Vérification et compilation

```bash
npm run typecheck
npm run build
npm run preview
```

La compilation produit le site dans le dossier `dist/`. Le projet utilise Vite, React, TypeScript et Tailwind CSS.

## Structure

- `src/App.tsx` : interface principale et états du jeu.
- `src/components/Screens.tsx` : écrans d'accueil, pause et fin.
- `src/game/engine.ts` : boucle, règles, collisions et rendu Canvas.
- `src/game/audio.ts` : effets sonores générés avec Web Audio.
- `src/index.css` : styles et effets visuels.
- `src/main.tsx` : point d'entrée React.

## Notes

- Les scores sont conservés dans le stockage local du navigateur.
- Les polices Space Grotesk et JetBrains Mono sont chargées depuis Google Fonts ; une connexion internet est nécessaire pour les obtenir.
- Les dépendances et ressources externes doivent être vérifiées avant toute distribution publique ou commerciale.
