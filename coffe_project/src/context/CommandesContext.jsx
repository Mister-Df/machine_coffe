import { createContext, useContext, useState } from 'react'

const CommandesContext = createContext(null)

export function CommandesProvider({ children }) {
  const [commandes, setCommandes] = useState([])
  const [messagesMachine, setMessagesMachine] = useState([])

  function ajouterCommande(commande) {
    setCommandes((commandesActuelles) => [
      ...commandesActuelles,
      { ...commande, id: Date.now() },
    ])
  }

  function ajouterMessageMachine(message) {
    setMessagesMachine((messagesActuels) => [
      ...messagesActuels,
      { texte: message, id: Date.now() },
    ])
  }

  return (
    <CommandesContext.Provider value={{ commandes, ajouterCommande, messagesMachine, ajouterMessageMachine }}>
      {children}
    </CommandesContext.Provider>
  )
}

export function useCommandes() {
  const context = useContext(CommandesContext)
  if (!context) {
    throw new Error('useCommandes doit être utilisé dans un CommandesProvider')
  }
  return context
}
