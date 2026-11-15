import { BrowserRouter, Link, Navigate as Redirect, Routes, Route } from "react-router-dom"
import CommandClient from "../component/CommandClient"
import Navigate from "../component/Navigate"
import MachineTask from "../component/MachineTask"

export default function Router() {
    return (
        <BrowserRouter>
            <div className="app-shell">
                <header className="site-header">
                    <div className="header-inner">
                        <Link className="brand" to="/command" aria-label="Café Maison — accueil">
                            <span className="brand-mark" aria-hidden="true">☕</span>
                            <span>
                                <span className="brand-name">Café Maison</span>
                                <span className="brand-caption">La pause, bien préparée</span>
                            </span>
                        </Link>
                        <span className="header-note">
                            <span className="status-dot" aria-hidden="true" />
                            Machine prête
                        </span>
                    </div>
                </header>
                <Navigate />
                <main className="page-content">
                    <Routes>
                        <Route path="/" element={<Redirect to="/command" replace />} />
                        <Route path="/machine" element={<MachineTask />} />
                        <Route path="/command" element={<CommandClient />} />
                        <Route path="*" element={<Redirect to="/command" replace />} />
                    </Routes>
                </main>
                <footer className="site-footer">Un bon café, préparé avec soin.</footer>
            </div>
        </BrowserRouter>
    )
}
