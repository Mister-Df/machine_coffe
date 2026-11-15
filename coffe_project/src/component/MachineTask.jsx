import { useState } from 'react'
import { useCommandes } from '../context/CommandesContext'
import { buildSalesReport } from '../utils/salesReport'

const LIBELLES_BOISSONS = {
  TEA: 'Thé',
  COFFEE: 'Café',
  CHOCOLATE: 'Chocolat chaud',
  'JUS D’ORANGE': "Jus d'orange",
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
    <section aria-labelledby="machine-page-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Vue d’ensemble</p>
          <h1 className="page-title" id="machine-page-title">Espace machine</h1>
          <p className="page-description">
            Suivez les commandes en cours, consultez les messages et gardez un œil sur les ventes.
          </p>
        </div>
        <div className="machine-actions">
          <span className="machine-summary">
            <span className="status-dot" aria-hidden="true" />
            {commandes.length} commande{commandes.length === 1 ? '' : 's'}
          </span>
          <button type="button" className="primary-button" onClick={genererRapport}>
            Générer le rapport <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>

      {rapport && (
        <section className="section-card report-card" aria-label="Rapport des ventes">
          <div className="report-title-row">
            <div>
              <p className="eyebrow">Activité commerciale</p>
              <h2>Rapport des ventes</h2>
              <p>Résumé des ventes enregistrées par la machine.</p>
            </div>
            <button type="button" className="secondary-button" onClick={() => window.print()}>
              <span aria-hidden="true">⎙</span> Imprimer le rapport
            </button>
          </div>

          <div className="report-metrics">
            <div className="report-metric">
              <span>Recettes totales</span>
              <strong>{formaterEuros(rapport.totalRevenueCents)}</strong>
            </div>
            <div className="report-metric">
              <span>Jours avec ventes</span>
              <strong>{rapport.days.length}</strong>
            </div>
          </div>

          <h3 className="report-section-title">Unités vendues par boisson</h3>
          <ul className="report-list">
            {Object.entries(rapport.unitsByDrink).map(([boisson, unites]) => (
              <li key={boisson}>
                <span>{LIBELLES_BOISSONS[boisson] || boisson}</span>
                <strong>{unites} unité{unites === 1 ? '' : 's'}</strong>
              </li>
            ))}
          </ul>

          <h3 className="report-section-title">Recettes par date</h3>
          {rapport.days.length === 0 ? (
            <p className="form-hint">Aucune vente enregistrée.</p>
          ) : (
            <ul className="report-list">
              {rapport.days.map(({ date, units, revenueCents }) => (
                <li key={date}>
                  <span>{date.split('-').reverse().join('/')}</span>
                  <strong>{units} unité{units === 1 ? '' : 's'} · {formaterEuros(revenueCents)}</strong>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <div className="machine-grid">
        <section className="section-card panel-card" aria-label="Commandes à préparer">
          <div className="panel-heading">
            <h2>Commandes à préparer</h2>
            <span className="count-badge" aria-label={`${commandes.length} commandes`}>{commandes.length}</span>
          </div>
          {commandes.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon" aria-hidden="true">☕</span>
              <p>Aucune commande pour le moment. Les commandes validées apparaîtront ici.</p>
            </div>
          ) : (
            <ul className="order-list">
              {commandes.map((commande) => (
                <li key={commande.id} className="order-item">
                  <div className="order-item-top">
                    <p className="order-drink">{LIBELLES_BOISSONS[commande.boisson] || commande.boisson}</p>
                    <span className="order-price">{formaterEuros(commande.prixCentimes)}</span>
                  </div>
                  <div className="order-details">
                    <p className="order-detail">
                      <strong>Montant versé</strong>
                      {formaterEuros(commande.montantVerseCentimes)}
                    </p>
                    {commande.monnaieCentimes > 0 && (
                      <p className="order-detail">
                        <strong>Monnaie rendue</strong>
                        {formaterEuros(commande.monnaieCentimes)}
                      </p>
                    )}
                    <p className="order-detail protocol-line">
                      <strong>Instruction Drink Machine</strong>
                      <code>{commande.message}</code>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="section-card panel-card" aria-label="Messages de la machine">
          <div className="panel-heading">
            <h2>Messages de la machine</h2>
            {messagesMachine.length > 0 && (
              <span className="count-badge" aria-label={`${messagesMachine.length} messages`}>{messagesMachine.length}</span>
            )}
          </div>
          {messagesMachine.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon" aria-hidden="true">✓</span>
              <p>Tout fonctionne normalement. Les alertes et informations apparaîtront ici.</p>
            </div>
          ) : (
            <ul className="message-list">
              {messagesMachine.map((message) => (
                <li key={message.id} className="message-item" role="alert">{message.texte}</li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </section>
  )
}
