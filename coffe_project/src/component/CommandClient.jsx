import { useState } from 'react'
import { useCommandes } from '../context/CommandesContext'

const PRIX_BOISSONS_CENTIMES = {
    TEA: 40,
    COFFEE: 60,
    CHOCOLATE: 50,
    'JUS D’ORANGE': 60,
}

const COMMANDES_TRES_CHAUDES = {
    COFFEE: { sucre: 0, message: 'Ch::' },
    CHOCOLATE: { sucre: 1, message: 'Hh:1:0' },
    TEA: { sucre: 2, message: 'Th:2:0' },
}

const formaterEuros = (centimes) => new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
}).format(centimes / 100)

function normaliserCommande(commande) {
    const commandeNormalisee = commande.trim().toUpperCase()
    if (['ORANGE', 'ORANGE JUS', "JUS D'ORANGE", 'JUS D’ORANGE'].includes(commandeNormalisee)) {
        return 'JUS D’ORANGE'
    }
    return commandeNormalisee
}

export default function CommandClient() {
    const { ajouterCommande, ajouterMessageMachine } = useCommandes()

    const [commande, setCommande] = useState('')  
    const [sucre, setSucre] = useState('')
    const [montant, setMontant] = useState('')
    const [erreur, setErreur] = useState('')
    const [confirmation, setConfirmation] = useState('')
    const [bienChaud, setBienChaud] = useState(false)
    const commandeNormalisee = normaliserCommande(commande)
    const prixBoissonCentimes = PRIX_BOISSONS_CENTIMES[commandeNormalisee]
    const estJusOrange = commandeNormalisee === 'JUS D’ORANGE'
    const commandeTresChaude = COMMANDES_TRES_CHAUDES[commandeNormalisee]
    const modeTresChaud = bienChaud && commandeTresChaude !== undefined
    const sucreVerrouille = estJusOrange || modeTresChaud
    const sucreAffiche = estJusOrange
        ? '0'
        : modeTresChaud
            ? String(commandeTresChaude.sucre)
            : sucre

    function handleSubmit(e) {
        e.preventDefault()
        setConfirmation('')
        const nombreSucre = estJusOrange
            ? 0
            : modeTresChaud
                ? commandeTresChaude.sucre
                : Number(sucre)
        const prixCentimes = prixBoissonCentimes

        if (prixCentimes === undefined) {
            setErreur('Commande rejetée : La boisson est inconnue.')
            return
        }

        if (!sucreVerrouille && (sucre === '' || !Number.isInteger(nombreSucre) || nombreSucre < 0 || nombreSucre > 3)) {
            setErreur('Commande rejetée : Le nombre de sucres doit être compris entre 0 et 3.')
            return
        }

        if (!sucreVerrouille && commandeNormalisee === 'CHOCOLATE' && nombreSucre !== 0) {
            setErreur('Commande rejetée : le chocolat doit être commandé sans sucre.')
            return
        }

        const montantNumerique = Number(montant)
        if (montant === '' || !Number.isFinite(montantNumerique) || montantNumerique < 0) {
            setErreur('Commande rejetée : Saisissez un montant valide.')
            return
        }

        const montantCentimes = Math.round(montantNumerique * 100)
        if (montantCentimes < prixCentimes) {
            const sommeManquante = prixCentimes - montantCentimes
            const message = `Paiement insuffisant pour ${commandeNormalisee} : il manque ${formaterEuros(sommeManquante)}.`
            ajouterMessageMachine(message)
            setErreur(message)
            return
        }

        const message = estJusOrange
            ? 'O::'
            : modeTresChaud
                ? commandeTresChaude.message
                : commandeNormalisee === 'CHOCOLATE'
                    ? 'H::'
                    : `${commandeNormalisee === 'TEA' ? 'T' : 'C'}:${nombreSucre}:0`

        setErreur('')
        setConfirmation(`Votre commande de ${commandeNormalisee} est prise en compte.`)
        ajouterCommande({
            boisson: commandeNormalisee,
            sucre: nombreSucre,
            message,
            prixCentimes,
            montantVerseCentimes: montantCentimes,
            monnaieCentimes: montantCentimes - prixCentimes,
        })
        setCommande('')
        setSucre('')
        setMontant('')
        setBienChaud(false)
    }

    function handleCommandeChange(e) {
        const valeur = e.target.value
        setCommande(valeur)
        if (!COMMANDES_TRES_CHAUDES[normaliserCommande(valeur)]) {
            setBienChaud(false)
        }
    }

    function handleMontantInvalid(e) {
        if (!e.currentTarget.validity.rangeUnderflow || prixBoissonCentimes === undefined) {
            return
        }

        const montantCentimes = Math.round(Number(e.currentTarget.value) * 100)
        const sommeManquante = prixBoissonCentimes - montantCentimes
        const message = `Paiement insuffisant pour ${commandeNormalisee} : il manque ${formaterEuros(sommeManquante)}.`
        ajouterMessageMachine(message)
        setErreur(message)
    }

    return (
        <section aria-labelledby="order-page-title">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">Votre pause café</p>
                    <h1 className="page-title" id="order-page-title">À boire, comme vous aimez.</h1>
                    <p className="page-description">
                        Choisissez votre boisson, indiquez vos préférences et réglez votre commande en quelques instants.
                    </p>
                </div>
            </div>

            <div className="order-layout">
                <section className="section-card order-card" aria-labelledby="order-form-title">
                    <h2 className="card-heading" id="order-form-title">Composer ma commande</h2>
                    <p className="card-subtitle">Les champs marqués sont nécessaires pour préparer votre boisson.</p>

                    <form onSubmit={handleSubmit} className="order-form">
                        <div className="form-field">
                            <label className="form-label" htmlFor="commande">Votre boisson</label>
                            <input
                                id="commande"
                                type="text"
                                value={commande}
                                onChange={handleCommandeChange}
                                className="form-control"
                                placeholder="Ex. café, thé, chocolat ou jus d’orange"
                                autoComplete="off"
                                required
                            />
                            <p className="form-hint">Saisissez le nom de votre boisson préférée.</p>
                        </div>

                        <div className="hot-option">
                            <input
                                id="bien-chaud"
                                type="checkbox"
                                checked={modeTresChaud}
                                disabled={commandeTresChaude === undefined}
                                onChange={e => setBienChaud(e.target.checked)}
                            />
                            <div>
                                <label htmlFor="bien-chaud">Servir bien chaud</label>
                                <p>
                                    {modeTresChaud
                                        ? `Le protocole très chaud fixe le sucre à ${commandeTresChaude.sucre}.`
                                        : 'Active le protocole très chaud pour le thé, le café et le chocolat.'}
                                </p>
                            </div>
                        </div>

                        <div className="form-field">
                            <label className="form-label" htmlFor="sucre">Nombre de carreaux de sucre</label>
                            <input
                                id="sucre"
                                type="number"
                                min="0"
                                max="3"
                                step="1"
                                value={sucreAffiche}
                                onChange={e => setSucre(e.target.value)}
                                readOnly={sucreVerrouille}
                                className="form-control"
                                required={!sucreVerrouille}
                                aria-describedby="sucre-help"
                            />
                            <p className="form-hint" id="sucre-help">
                                De 0 à 3 sucres. Le jus d’orange est servi sans sucre.
                            </p>
                        </div>

                        <div className="form-field">
                            <label className="form-label" htmlFor="montant">Montant versé (€)</label>
                            <input
                                id="montant"
                                type="number"
                                min={prixBoissonCentimes === undefined ? 0 : (prixBoissonCentimes / 100).toFixed(2)}
                                step="0.01"
                                value={montant}
                                onChange={e => setMontant(e.target.value)}
                                onInvalid={handleMontantInvalid}
                                className="form-control"
                                placeholder="0,00"
                                required
                            />
                            <p className="form-hint">Le montant minimum s’actualise selon la boisson choisie.</p>
                        </div>

                        {erreur && <p role="alert" className="error-message">{erreur}</p>}
                        {confirmation && (
                            <p role="status" aria-live="polite" className="success-message">
                                <span aria-hidden="true">✓ </span>{confirmation}
                            </p>
                        )}
                        <button type="submit" className="primary-button full-width">
                            Confirmer la commande <span aria-hidden="true">→</span>
                        </button>
                    </form>
                </section>

                <aside className="section-card price-card" aria-labelledby="price-list-title">
                    <p className="eyebrow">À la carte</p>
                    <h2 className="card-heading" id="price-list-title">Les classiques</h2>
                    <p className="card-subtitle">Des pauses simples, préparées à la demande.</p>
                    <dl className="price-list">
                        <div className="price-row"><dt>TEA</dt><dd><strong>0,40 €</strong></dd></div>
                        <div className="price-row"><dt>COFFEE</dt><dd><strong>0,60 €</strong></dd></div>
                        <div className="price-row"><dt>CHOCOLATE</dt><dd><strong>0,50 €</strong></dd></div>
                        <div className="price-row"><dt>JUS D’ORANGE</dt><dd><strong>0,60 €</strong></dd></div>
                    </dl>
                </aside>
            </div>
        </section>
    )
}

