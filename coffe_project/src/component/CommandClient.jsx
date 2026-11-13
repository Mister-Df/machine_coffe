import { useState } from 'react'
import { useCommandes } from '../context/CommandesContext'

const PRIX_BOISSONS_CENTIMES = {
    TEA: 40,
    COFFEE: 60,
    CHOCOLATE: 50,
}

const formaterEuros = (centimes) => new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
}).format(centimes / 100)

export default function CommandClient() {
    const { ajouterCommande, ajouterMessageMachine } = useCommandes()

    const [commande, setCommande] = useState('')  
    const [sucre, setSucre] = useState('')
    const [montant, setMontant] = useState('')
    const [erreur, setErreur] = useState('')
    const commandeNormalisee = commande.trim().toUpperCase()
    const prixBoissonCentimes = PRIX_BOISSONS_CENTIMES[commandeNormalisee]

    function handleSubmit(e) {
        e.preventDefault()
        const nombreSucre = Number(sucre)
        const prixCentimes = prixBoissonCentimes

        if (prixCentimes === undefined) {
            setErreur('Commande rejetée : La boisson est inconnue.')
            return
        }

        if (sucre === '' || !Number.isInteger(nombreSucre) || nombreSucre < 0 || nombreSucre > 3) {
            setErreur('Commande rejetée : Le nombre de sucres doit être compris entre 0 et 3.')
            return
        }

        if (commandeNormalisee === 'CHOCOLATE' && nombreSucre !== 0) {
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

        const message = commandeNormalisee === 'CHOCOLATE'
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
                            onChange={e => setCommande(e.target.value)}
                            className="form-control h-10 bg-sky-200 px-2 outline-0"
                            required
                        />
                    </div>
                    <p className="text-amber-50">
                        Prix : thé 0,40 € · café 0,60 € · chocolat chaud 0,50 €
                    </p>
                    <div>
                        <label className="text-amber-50" htmlFor="sucre">Nombre de carreaux de sucre</label>
                        <input
                            id="sucre"
                            type="number"
                            min="0"
                            max="3"
                            step="1"
                            value={sucre}
                            onChange={e => setSucre(e.target.value)}
                            className="form-control"
                            required
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
