import React from 'react'
import Router from './Router/Router'
import { CommandesProvider } from './context/CommandesContext'
import './App.css'


export default function App() {
  return (
    <CommandesProvider>
      <Router />
    </CommandesProvider>
  )
}
