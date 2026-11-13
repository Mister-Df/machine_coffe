import React from 'react'
import { useCommandes } from '../context/CommandesContext'

const formaterEuros = (centimes) => new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
}).format(centimes / 100)

export default function MachineTask() {
  const { commandes, messagesMachine } = useCommandes()

  return (
    <main className="container">
      <h1 className="mb-4 text-2xl font-bold">Commandes à préparer</h1>
      {messagesMachine.length > 0 && (
        <section aria-label="Messages de la machine">
          <h2 className="text-xl font-semibold">Messages de la machine</h2>
          <ul>
            {messagesMachine.map((message) => (
              <li key={message.id} role="alert">{message.texte}</li>
            ))}
          </ul>
        </section>
      )}
      {commandes.length === 0 ? (
        <p>Aucune commande pour le moment.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {commandes.map((commande) => (
            <li key={commande.id} className="rounded border p-3">
              <strong>{commande.boisson}</strong>
              <p>Prix : {formaterEuros(commande.prixCentimes)}</p>
              <p>Montant versé : {formaterEuros(commande.montantVerseCentimes)}</p>
              <p>Instruction Drink Machine : <code>{commande.message}</code></p>
              {commande.monnaieCentimes > 0 && (
                <p>Monnaie rendue : {formaterEuros(commande.monnaieCentimes)}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
