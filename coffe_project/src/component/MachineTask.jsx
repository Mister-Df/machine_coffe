import React from 'react'
import { useState } from 'react'
import { useCommandes } from '../context/CommandesContext'
import { buildSalesReport } from '../utils/salesReport'

const LIBELLES_BOISSONS = {
  TEA: 'Thé',
  COFFEE: 'Café',
  CHOCOLATE: 'Chocolat chaud',
  'ORANGE JUICE': "Jus d'orange",
}

const formaterEuros = (centimes) => new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
}).format(centimes / 100)

export default function MachineTask() {
  const { commandes, messagesMachine } = useCommandes()
  const [rapport, setRapport] = useState(null)

  function genererRapport() {
    const rapportVentes = buildSalesReport(commandes)
    setRapport(rapportVentes)
    console.log('Rapport des ventes', rapportVentes)
  }

  return (
    <main className="container">
      <h1 className="mb-4 text-2xl font-bold">Commandes à préparer</h1>
      <button type="button" className="mb-4 rounded border px-3 py-2" onClick={genererRapport}>
        Générer le rapport de ventes
      </button>
      {rapport && (
        <section className="mb-4 rounded border p-3" aria-label="Rapport des ventes">
          <h2 className="text-xl font-semibold">Rapport des ventes</h2>
          <h3 className="font-semibold">Unités vendues par boisson</h3>
          <ul>
            {Object.entries(rapport.unitsByDrink).map(([boisson, unites]) => (
              <li key={boisson}>{LIBELLES_BOISSONS[boisson]} : {unites}</li>
            ))}
          </ul>
          <p>Recettes totales : {formaterEuros(rapport.totalRevenueCents)}</p>
          <h3 className="font-semibold">Recettes par date</h3>
          {rapport.days.length === 0 ? (
            <p>Aucune vente enregistrée.</p>
          ) : (
            <ul>
              {rapport.days.map(({ date, units, revenueCents }) => (
                <li key={date}>
                  {date.split('-').reverse().join('/')} : {units} unité(s), {formaterEuros(revenueCents)}
                </li>
              ))}
            </ul>
          )}
          <button type="button" className="rounded border px-3 py-2" onClick={() => window.print()}>
            Imprimer le rapport
          </button>
        </section>
      )}
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
