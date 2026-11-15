import { NavLink } from 'react-router-dom'

export default function Navigate() {
    return (
        <nav className="main-nav" aria-label="Navigation principale">
            <div className="nav-inner">
                <NavLink to="/command" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                    <span className="nav-icon" aria-hidden="true">＋</span>
                    Passer une commande
                </NavLink>
                <NavLink to="/machine" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                    <span className="nav-icon" aria-hidden="true">▤</span>
                    Espace machine
                </NavLink>
            </div>
        </nav>
    )
}
