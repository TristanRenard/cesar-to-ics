# Cesar to ICS
## Description
Le but de ce nano projet est de convertir un emploi du temps cesar au format ICS pour pouvoir l'importer dans un calendrier (Google Calendar, Outlook, etc...).

## Utilisation

### Prérequis
- Node.js (LTS recommandé)
- npm (vient avec Node.js) ou yarn ou pnpm (recommandé)

### Installation

#### Cloner le projet
```bash
git clone <url>
cd cesar-to-ics
```

#### Installer les dépendances
```bash
npm install

# ou
yard install

# ou
pnpm install
```

#### copier le .env.example en .env
```bash
cp .env.example .env
```

#### Remplir le fichier .env
```env
CESAR_USERNAME="etutrenard" # votre nom d'utilisateur cesar
CESAR_PASSWORD="2TjAk15DJaXE8uB<f5<A)@TMhZ@vCD" # votre mot de passe cesar
```

> [!CAUTION]
> VOTRE MOT DE PASSE CESAR EST STOCKÉ EN CLAIR DANS LE FICHIER .env. VEUILLEZ NE PAS PARTAGER CE FICHIER AVEC QUI QUE CE SOIT.
> NE PAS COMMITER CE FICHIER DANS UN REPO GIT.

> [!WARNING]
> VOS IDENTIFIANTS CESAR NE SONT PAS COLLECTÉS PAR CE PROJET. ILS SONT UTILISÉS UNIQUEMENT POUR SE CONNECTER A VOTRE COMPTE CESAR ET RÉCUPÉRER VOTRE EMPLOI DU TEMPS. 
> Si vous avez le moindre dout, vous pouvez consulter le code source de ce projet.

### Utilisation
```bash
npm start

# ou
yarn start

# ou
pnpm start
```

### TADAM ! Vous avez votre fichier `calendar.ics` dans le dossier `output` a la racine du projet.


## License
Aucune licence. Vous pouvez faire ce que vous voulez de ce projet. C'est un projet open source.


> PS : ce projet ne sera pas mis à jour ou amélioré de mon côté. Je sais que d'autres dev plus talentueux que moi travaillent sur des projets similaires ce micro projet est juste là pour répondre à un personnel. De ce fait je ne peux pas garantir que ce projet fonctionnera toujours. Si vous avez des problèmes, je vous invite à consulter le code source et à le modifier pour qu'il fonctionne à nouveau (Si certains font des pr pour améliorer ce projet, je les accepterai avec plaisir).
