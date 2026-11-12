import { useState } from 'react'
import { useCommandes } from '../context/CommandesContext'

const COMMANDES_AUTORISEES = ['TEA', 'COFFEE', 'CHOCOLATE']

export default function CommandClient() {
    const { ajouterCommande } = useCommandes()

    const [commande, setCommande] = useState('')  
    const [sucre, setSucre] = useState('')
    const [erreur, setErreur] = useState('')

    function handleSubmit(e) {
        e.preventDefault()
        const commandeNormalisee = commande.trim().toUpperCase()
        const nombreSucre = Number(sucre)

        if (!COMMANDES_AUTORISEES.includes(commandeNormalisee)) {
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

        const message = commandeNormalisee === 'CHOCOLATE'
            ? 'H::'
            : `${commandeNormalisee === 'TEA' ? 'T' : 'C'}:${nombreSucre}:0`

        setErreur('')
        ajouterCommande({
            boisson: commandeNormalisee,
            sucre: nombreSucre,
            message,
        })
        setCommande('')
        setSucre('')
    }

  return ( 
    <div className='container'>
        <div className='h-[300px] rounded-b-xl p-2  w-full bg-amber-700'>
      <form action="" onSubmit={handleSubmit} className=' flex flex-col gap-2'>
        <div>
          <label className='form- text-amber-50' htmlFor="commande">Saisir une commande</label>
          <input
            id="commande"
            type="text"
            value={commande}
            onChange={e => setCommande(e.target.value)}
            className='form-control h-10 bg-sky-200 outline-0 px-2'
            
            required
          />
        </div>
        <div>
          <label className='text-amber-50' htmlFor="sucre">Nombre de carreaux de sucre</label>
          <input
            id="sucre"
            type="number"
            value={sucre}
            onChange={e => setSucre(e.target.value)}
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
