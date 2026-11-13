# Machine à café

Application web React permettant de saisir des commandes de boissons et de consulter les instructions de préparation.

## Démarrage

```sh
npm install
npm run dev
```

Le serveur Vite est configuré sur le port `3000`.

## Utilisation

- `/command` : choisir une boisson, saisir le nombre de sucres et le montant versé.
- `/machine` : consulter les commandes acceptées et les messages transmis par la machine, puis générer ou imprimer un rapport de ventes.

| Boisson | Prix |
|---|---:|
| Thé (`TEA`) | 0,40 € |
| Café (`COFFEE`) | 0,60 € |
| Chocolat chaud (`CHOCOLATE`) | 0,50 € |
| Jus d'orange (`ORANGE`, `ORANGE JUICE` ou `JUS D'ORANGE`) | 0,60 € |

Le nombre de sucres doit être compris entre 0 et 3; le chocolat chaud standard doit être sans sucre. Le jus d'orange est servi sans sucre. Le paiement minimum dépend du prix de la boisson. Un paiement insuffisant est refusé et le message précise la somme manquante sur l’écran machine. Un paiement supérieur au prix permet de préparer la boisson et la monnaie est affichée.

Pour le thé, le café et le chocolat chaud, l'option « Servir bien chaud » envoie les commandes de firmware `Th:2:0`, `Ch::` et `Hh:1:0` respectivement. Le protocole fixe alors le sucre à 2 pour le thé, 0 pour le café et 1 pour le chocolat. Le jus d'orange utilise la commande `O::`.

Les commandes et messages sont conservés dans le contexte React en mémoire; ils sont réinitialisés au rechargement de la page.

Le rapport regroupe les unités vendues par boisson, les recettes par date et le total des recettes. Les recettes sont calculées au prix des boissons, sans compter la monnaie rendue. Les ventes et leurs dates restent en mémoire et ne survivent pas au rechargement.

## Vérification

```sh
npm test
npm run build
```
