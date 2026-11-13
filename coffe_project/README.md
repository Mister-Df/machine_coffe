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
- `/machine` : consulter les commandes acceptées et les messages transmis par la machine.

| Boisson | Prix |
|---|---:|
| Thé (`TEA`) | 0,40 € |
| Café (`COFFEE`) | 0,60 € |
| Chocolat chaud (`CHOCOLATE`) | 0,50 € |

Le nombre de sucres doit être compris entre 0 et 3; le chocolat chaud doit être sans sucre. Le paiement minimum dépend du prix de la boisson. Un paiement insuffisant est refusé et le message précise la somme manquante sur l’écran machine. Un paiement supérieur au prix permet de préparer la boisson et la monnaie est affichée.

Les commandes et messages sont conservés dans le contexte React en mémoire; ils sont réinitialisés au rechargement de la page.
