import React from 'react'
import { useCommandes } from '../context/CommandesContext'

export default function MachineTask() {
  const { commandes } = useCommandes()

  return (
    <main className="container">
      <h1 className="mb-4 text-2xl font-bold">Commandes à préparer</h1>
      {commandes.length === 0 ? (
        <p>Aucune commande pour le moment.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {commandes.map((commande) => (
            <li key={commande.id} className="rounded border p-3">
              <strong>{commande.boisson}</strong>
              <p>Instruction Drink Machine : <code>{commande.message}</code></p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
