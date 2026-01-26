import { useState } from "react";
import { NavLink } from "react-router-dom";
import logoTipo from "../../assets/LOGOTIPO.png";
import "./Sidebar.css";

// =======================================================
// DEFINIÇÃO DAS ROTAS POR PERFIL
// =======================================================

const ROTAS_ALUNO = [
  { to: "/dashboard", name: "Mural", end: true },
  // { to: "/dashboard/graficos", name: "Gráficos de Desempenho" },
  { to: "/dashboard/boletim", name: "Boletim" },
  { to: "/dashboard/historico", name: "Histórico" },
  { to: "/dashboard/calendario", name: "Calendário" },
  { to: "/dashboard/envioAtividade", name: "Envio de Avaliação" },
  // { to: "/dashboard/calendario", name: "Gestão de Eventos" },
  { to: "/dashboard/perfil", name: "Perfil" },
  { to: "/dashboard/trocaSenha", name: "Trocar Senha" },
];

const ROTAS_PROFESSOR = [
  { to: "/dashboard", name: "Mural", end: true },
  { to: "/dashboard/notas", name: "Notas" },
  { to: "/dashboard/avaliacao", name: "Avaliação" },
  { to: "/dashboard/presenca", name: "Presença" },
  { to: "/dashboard/perfil", name: "Perfil" },
  { to: "/dashboard/trocaSenha", name: "Trocar Senha" },
];

const ROTAS_COORDENADOR = [
  { to: "/dashboard", name: "Mural", end: true },
  { to: "/dashboard/usuarios", name: "Gerenciar Usuários" },
  { to: "/dashboard/confNotas", name: "Confirma Notas" },
  { to: "/dashboard/crimural", name: "Criar Mural" },
  { to: "/dashboard/criCalendario", name: "Criar Calendário" },
  { to: "/dashboard/disciplina", name: "Criar Disciplina" },
  { to: "/dashboard/turma", name: "Criar Turma" },
  { to: "/dashboard/matricula", name: "Criar Matrícula" },
  { to: "/dashboard/matriculaDisciplina", name: "Matrícula e Disciplina" },
  { to: "/dashboard/professorDiciplina", name: "Vincular Professor e Disciplina" },
  { to: "/dashboard/perfil", name: "Meu Perfil" },
  { to: "/dashboard/criaAluno", name: "Criar Aluno" },
  { to: "/dashboard/criaProfessor", name: "Criar Professor" },
  { to: "/dashboard/trocaSenha", name: "Trocar Senha" },
];

function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tipoUser = localStorage.getItem("tipoUser");
  const userName = localStorage.getItem("userName") || "Usuário";

  const getRoutes = () => {
    if (tipoUser === "coordenador") return ROTAS_COORDENADOR;
    if (tipoUser === "professor") return ROTAS_PROFESSOR;
    if (tipoUser === "aluno") return ROTAS_ALUNO;
    return [];
  };

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const routes = getRoutes();

  return (
    <>
      <button className="hamburger-menu" onClick={toggleMenu}>
        {isMobileMenuOpen ? "✕" : "☰"}
      </button>

      {isMobileMenuOpen && (
        <div className="sidebar-overlay" onClick={closeMenu}></div>
      )}

      <aside className={`sidebar ${isMobileMenuOpen ? "open" : ""}`}>
        {/* Agrupamos o Topo e a Nav em um container que permite scroll 
          Isso resolve o bug do botão de sair se afastando
      */}
        <div className="sidebar-top-wrapper">
          <div className="sidebar-header">
            <img src={logoTipo} alt="Escola 360" className="sidebar-logo" />
            <p className="user-greeting">Olá, {userName}</p>
            <hr className="sidebar-divider" />
          </div>

          <nav className="sidebar-nav">
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
        </div>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
