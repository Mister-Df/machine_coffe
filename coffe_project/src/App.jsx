import React from 'react'
import Router from './Router/Router'
import { CommandesProvider } from './context/CommandesContext'


export default function App() {
  return (
    <CommandesProvider>
      <Router />
    </CommandesProvider>
  )
}
