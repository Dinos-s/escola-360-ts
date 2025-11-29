import { NavLink } from 'react-router-dom';
import logoTipo from '../../assets/LOGOTIPO.png';
import './Sidebar.css';

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <img src={logoTipo} alt="Escola 360" />
            </div>

            <p className="user-greeting">Olá, Maria</p>

            <nav className="sidebar-nav">
                <NavLink to="/dashboard" end> Mural </NavLink>
                <NavLink to="/dashboard/graficos"> Gráficos </NavLink>
                <NavLink to="/dashboard/perfil"> Perfil </NavLink>
                <NavLink to="/dashboard/boletim"> Boletim </NavLink>
                <NavLink to="/dashboard/usuarios"> Usuários </NavLink>
                <NavLink to="/dashboard/trocaSenha"> Trocar Senha </NavLink>
            </nav>

            <div className="sidebar-footer">
                <a href="/">Sair</a>
            </div>
        </aside>
    )
}

export default Sidebar;