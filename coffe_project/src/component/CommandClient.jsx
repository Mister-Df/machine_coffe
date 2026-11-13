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
        <div className="container">
            <div className="w-full rounded-b-xl bg-amber-700 p-2">
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <div>
                        <label className="text-amber-50" htmlFor="commande">Saisir une commande</label>
                        <input
                            id="commande"
                            type="text"
                            value={commande}
                            onChange={handleCommandeChange}
                            className="form-control h-10 bg-sky-200 px-2 outline-0"
                            required
                        />
                    </div>
                    <p className="text-amber-50">
                        Prix : thé 0,40 € · café 0,60 € · chocolat chaud 0,50 € · jus d'orange 0,60 €
                    </p>
                    <div className="text-amber-50">
                        <input
                            id="bien-chaud"
                            type="checkbox"
                            checked={modeTresChaud}
                            disabled={commandeTresChaude === undefined}
                            onChange={e => setBienChaud(e.target.checked)}
                        />
                        <label className="ms-2" htmlFor="bien-chaud">Servir bien chaud</label>
                        {modeTresChaud && (
                            <p>
                                Le protocole très chaud fixe le sucre à {commandeTresChaude.sucre}.
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="text-amber-50" htmlFor="sucre">Nombre de carreaux de sucre</label>
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
                        />
                    </div>
                    <div>
                        <label className="text-amber-50" htmlFor="montant">Montant versé (€)</label>
                        <input
                            id="montant"
                            type="number"
                            min={prixBoissonCentimes === undefined ? 0 : (prixBoissonCentimes / 100).toFixed(2)}
                            step="0.01"
                            value={montant}
                            onChange={e => setMontant(e.target.value)}
                            onInvalid={handleMontantInvalid}
                            className="form-control"
                            required
                        />
                    </div>
                    {erreur && <p role="alert" className="text-white">{erreur}</p>}
                    <button type="submit" className="rounded bg-sky-200 px-4 py-2 text-slate-900">
                        Passer la commande
                    </button>
                </form>
            </div>
        </div>
    )
}
