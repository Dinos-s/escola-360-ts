import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logoTipo from '../../assets/LOGOTIPO.png';
import './Sidebar.css';

// =======================================================
// DEFINIÇÃO DAS ROTAS POR PERFIL
// =======================================================

const ROTAS_ALUNO = [
    { to: "/dashboard", name: "Mural", end: true },
    { to: "/dashboard/graficos", name: "Gráficos de Desempenho" },
    { to: "/dashboard/boletim", name: "Boletim" },
    { to: "/dashboard/historico", name: "Histórico" },
    { to: "/dashboard/calendario", name: "Calendário" },
    // { to: "/dashboard/calendario", name: "Gestão de Eventos" },
    { to: "/dashboard/perfil", name: "Perfil" },
    { to: "/dashboard/trocaSenha", name: "Trocar Senha" },
];

const ROTAS_PROFESSOR = [
    { to: "/dashboard", name: "Mural", end: true },
    { to: "/dashboard/notas", name: "Notas" },
    { to: "/dashboard/presenca", name: "Presença" },
    { to: "/dashboard/perfil", name: "Perfil" },
    { to: "/dashboard/trocaSenha", name: "Trocar Senha" },
];

const ROTAS_COORDENADOR = [
    { to: "/dashboard", name: "Mural", end: true },
    { to: "/dashboard/usuarios", name: "Gerenciar Usuários" },
    { to: "/dashboard/confNotas", name: " Confirma Notas" },
    { to: "/dashboard/crimural", name: "Criar Mural" },
    { to: "/dashboard/criCalendario", name: "Criar Calendário" },
    { to: "/dashboard/disciplina", name: "Criar Disciplina" },
    { to: "/dashboard/turma", name: "Criar Turma" },
    { to: "/dashboard/perfil", name: "Meu Perfil" },
    { to: "/dashboard/trocaSenha", name: "Trocar Senha" },
];

function Sidebar() {
    const [userProfile, setUserProfile] = useState("aluno"); // Estado para armazenar o perfil do usuário
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleProfileClick = (profileName) => {
        // Se o perfil clicado já estiver ativo, ele fecha (seta para null)
        // Se estiver inativo, ele ativa o perfil
        setUserProfile(userProfile === profileName ? null : profileName);
    }

    const closeMenu = () => {
        if (window.innerWidth <= 900) {
            setIsMobileMenuOpen(false);
        }
    };

    const getRoutes = (profile) => {
        if (profile === "coordenador") return ROTAS_COORDENADOR;
        if (profile === "aluno") return ROTAS_ALUNO;
        if (profile === "professor") return ROTAS_PROFESSOR;
        return [];
    }

    // Função para renderizar o NavMenu
    const renderNavMenu = (profile) => {
        const routes = getRoutes(profile);
        return (
            <nav id="sidebar-nav" className="sidebar-nav">
                {routes.map((route, index) => (
                    <NavLink
                        key={index}
                        to={route.to}
                        end={route.end || false}
                        onClick={closeMenu}
                    >
                        {route.name}
                    </NavLink>
                ))}
            </nav>
        );
    };

    return (
        <aside className="sidebar">
            <div className={`sidebar-content ${isMobileMenuOpen ? "mobile-open" : ""}`}>
                <img src={logoTipo} alt="Escola 360" className="sidebar-logo desktop-only" />

                <p className="user-greeting">Olá, Maria</p>

                <div className="profile-switcher">
                    <button onClick={() => handleProfileClick("aluno")}
                        className={`profile-btn ${userProfile === "aluno" ? "active" : ""}`}
                        title="Visualizar rotas do Aluno">Aluno</button>
                    {/* LINKS DO ALUNO (Visível se 'aluno' estiver ativo) */}
                    {userProfile === "aluno" && renderNavMenu("aluno")}

                    <button
                        onClick={() => handleProfileClick("professor")}
                        className={`profile-btn ${userProfile === "professor" ? "active" : ""
                            }`}
                        title="Visualizar rotas do Professor"
                    >
                        Professor
                    </button>
                    {/* LINKS DO PROFESSOR (Visível se 'professor' estiver ativo) */}
                    {userProfile === "professor" && renderNavMenu("professor")}

                    <button
                        onClick={() => handleProfileClick("coordenador")}
                        className={`profile-btn ${userProfile === "coordenador" ? "active" : ""
                            }`}
                        title="Visualizar rotas do Coordenador"
                    >
                        Coordenador
                    </button>
                    {/* LINKS DO COORDENADOR (Visível se 'coordenador' estiver ativo) */}
                    {userProfile === "coordenador" && renderNavMenu("coordenador")}
                </div>
            </div>

            <div className="sidebar-footer">
                <a href="/">Sair</a>
            </div>
        </aside>
    )
}

export default Sidebar;