# SEO Booster

SEO Booster est une application web conçue pour aider les créateurs de contenu à améliorer leur référencement (SEO). Grâce à l'intelligence artificielle de Gemini, elle génère des mots-clés pertinents, optimise des textes existants, et propose même des analyses de la concurrence.

## Fonctionnalités

*   **Génération de mots-clés** : Obtenez des listes de mots-clés primaires, secondaires et de longue traîne.
*   **Optimisation de texte** : Améliorez vos textes pour les rendre plus attractifs et performants pour le SEO.
*   **Proposition de texte** : Générez des suggestions de textes marketing prêtes à l'emploi.
*   **Analyse de la concurrence (Premium)** : Découvrez les stratégies de vos concurrents.
*   **Multilingue** : Disponible en Français et en Anglais.
*   **Modèle Freemium** : Accès gratuit avec des quotas, et une version Premium avec des fonctionnalités illimitées.

## Déploiement Facile (avec Netlify)

Vous pouvez déployer cette application gratuitement en quelques minutes. Nous recommandons d'utiliser [Netlify](https://www.netlify.com/), un service d'hébergement très simple et puissant pour les applications web modernes.

**Prérequis :**
1.  Un compte [GitHub](https://github.com/).
2.  Le code de ce projet sur votre ordinateur.

### Étapes de déploiement

1.  **Créer un dépôt sur GitHub :**
    *   Connectez-vous à votre compte GitHub.
    *   Créez un nouveau dépôt (repository).
    *   Suivez les instructions pour "push an existing repository from the command line" afin d'envoyer le code du projet dans votre nouveau dépôt.

2.  **Déployer avec Netlify :**
    *   Inscrivez-vous ou connectez-vous à [Netlify](https://app.netlify.com/) avec votre compte GitHub.
    *   Sur votre tableau de bord, cliquez sur **"Add new site"** puis **"Import an existing project"**.
    *   Choisissez **"Deploy with GitHub"** et autorisez Netlify à accéder à vos dépôts.
    *   Sélectionnez le dépôt GitHub que vous venez de créer pour SEO Booster.

3.  **Configurer le déploiement :**
    Netlify est intelligent et devrait détecter que vous avez un site statique. Les réglages par défaut sont généralement suffisants.
    *   **Build command** : Vous pouvez laisser ce champ **vide**. Il n'y a pas d'étape de compilation nécessaire pour ce projet.
    *   **Publish directory** : Laissez la valeur par défaut (généralement la racine du projet).

4.  **Ajouter la clé API (Étape cruciale !) :**
    Avant de lancer le déploiement, vous devez fournir votre clé API Gemini de manière sécurisée. Le code est configuré pour la récupérer depuis une variable d'environnement.
    *   Cliquez sur **"Show advanced"** ou allez dans les **"Site settings"** après la création du site.
    *   Naviguez vers **"Site configuration" > "Environment variables"**.
    *   Cliquez sur **"Add a variable"**.
    *   Remplissez les champs comme suit :
        *   **Key** : `API_KEY`
        *   **Value** : `Collez_votre_clé_API_Gemini_ici`
    *   Cliquez sur **"Create variable"**.

5.  **Lancer le déploiement :**
    *   Cliquez sur le bouton **"Deploy site"** (ou "Deploy [nom-du-dépôt]").
    *   Netlify va maintenant déployer votre application. En moins d'une minute, elle sera en ligne à une URL unique (par exemple `nom-aleatoire.netlify.app`). Vous pourrez bien sûr personnaliser ce nom de domaine plus tard depuis les réglages du site.

Votre application SEO Booster est maintenant en ligne et accessible à tous ! Netlify redéploiera automatiquement votre site à chaque fois que vous enverrez des modifications sur votre dépôt GitHub.