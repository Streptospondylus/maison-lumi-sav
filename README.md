# Maison Lumi — Service après-vente

Mini-expérience mobile-first, statique et sans dépendance, prête pour GitHub Pages.

## Déploiement GitHub Pages

Le site se trouve dans le dossier `dist/`. Le workflow inclus dans `.github/workflows/pages.yml` le publie automatiquement à chaque push sur `main`.

Dans les paramètres du dépôt, sélectionnez **Settings → Pages → Source: GitHub Actions**. Aucun build ni secret n’est nécessaire.

## Envoi des commentaires

Le formulaire utilise FormSubmit, sans identifiant ni secret dans le code. Au premier envoi, FormSubmit adresse un e-mail d’activation à `maisonlumiservice@outlook.com`. Il faut confirmer cette activation une seule fois pour recevoir les signalements suivants.

Le parcours reste fonctionnel si le relais e-mail est indisponible.
