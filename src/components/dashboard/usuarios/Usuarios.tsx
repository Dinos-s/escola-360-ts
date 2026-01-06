import { useEffect, useState } from "react";
import axios from "axios";
import "./Usuarios.css";
import UsuarioModal from "./modalUsers/ModalUsers";

// ===== Interfaces =====
interface BaseUser {
  id: number;
  nome: string;
  email: string;
  status: string;
  tipo: "Aluno" | "Professor";
}

interface Aluno extends BaseUser {
  matricula: string;
  turma?: string;
}

interface Professor extends BaseUser {
  disciplina?: string;
}

// ===== Componente =====
export default function Usuarios() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [perfilExibido, setPerfilExibido] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [termoBusca, setTermoBusca] = useState("");

  // Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [perfilModal, setPerfilModal] = useState<"alunos" | "professores" | "">("");
  const [form, setForm] = useState<any>({});
  const [usuarioEditando, setUsuarioEditando] = useState<any>(null);

  // ===== Carregar dados =====
  useEffect(() => {
    const carregar = async () => {
      const [resAlunos, resProf] = await Promise.all([
        axios.get("http://localhost:3000/aluno"),
        axios.get("http://localhost:3000/professor"),
      ]);

      setAlunos(resAlunos.data.map((a: any) => ({ ...a, tipo: "Aluno" })));
      setProfessores(resProf.data.map((p: any) => ({ ...p, tipo: "Professor" })));
    };

    carregar();
  }, []);

  // ===== Ações =====
  const handleEditar = (usuario: any) => {
    setModoEdicao(true);
    setUsuarioEditando(usuario);
    setPerfilModal(usuario.tipo === "Aluno" ? "alunos" : "professores");
    setForm(usuario);
    setModalAberto(true);
  };

  const handleSubmit = async () => {
    try {
      if (modoEdicao) {
        const endpoint =
          perfilModal === "alunos"
            ? `http://localhost:3000/aluno/${usuarioEditando.id}`
            : `http://localhost:3000/professor/${usuarioEditando.id}`;
          const { id, tipo, ...dadosParaEnviar } = form;

      await axios.patch(endpoint, dadosParaEnviar);
      } else {
        const endpoint =
          perfilModal === "alunos"
            ? "http://localhost:3000/aluno"
            : "http://localhost:3000/professor";

        await axios.post(endpoint, form);
      }

      setModalAberto(false);
      window.location.reload();
    } catch (err) {
      console.error("Erro ao salvar usuário", err);
      console.log("dados error:", err.response.data);
    }
  };

  const handleInativar = async (usuario: any) => {
    const novoStatus = usuario.status === "Ativo" ? "Inativo" : "Ativo";
    const endpoint =
      usuario.tipo === "Aluno"
        ? `http://localhost:3000/aluno/${usuario.id}/status`
        : `http://localhost:3000/professor/${usuario.id}/status`;

    await axios.patch(endpoint, { status: novoStatus });
    window.location.reload();
  };

  // ===== Filtros =====
  const todos = [...alunos, ...professores];

  const listaBase =
    perfilExibido === "alunos"
      ? alunos
      : perfilExibido === "professores"
      ? professores
      : todos;

  const filtrados = listaBase.filter((u) => {
    const matchStatus = filtroStatus === "Todos" || u.status === filtroStatus;
    const matchBusca =
      u.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      u.email.toLowerCase().includes(termoBusca.toLowerCase());
    return matchStatus && matchBusca;
  });

  return (
    <div className="container">
      <h2>Gerenciamento de Usuários</h2>

      {/* Botão flutuante */}
      <button
        className="floating-add-btn"
        title="Novo Usuário"
        onClick={() => {
          setModoEdicao(false);
          setForm({});
          setPerfilModal("");
          setModalAberto(true);
        }}
      >
        +
      </button>

      {/* Abas */}
      <div className="tabs-container">
        {["Todos", "Alunos", "Professores"].map((t) => (
          <button
            key={t}
            className={`tab-button ${perfilExibido === t.toLowerCase() ? "active" : ""}`}
            onClick={() => setPerfilExibido(t.toLowerCase())}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div className="search-filter-area">
        <input
          className="search-input"
          placeholder="Buscar por nome ou e-mail"
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
        />

        <select
          className="filtro-select"
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
        >
          {["Todos", "Ativo", "Inativo"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Tabela */}
      <table className="user-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map((u) => (
            <tr key={`${u.tipo}-${u.id}`}>
              <td>{u.nome}</td>
              <td>{u.email}</td>
              <td>{u.status}</td>
              <td className="acoes">
                <button className="action-btn edit-btn" onClick={() => handleEditar(u)}>
                  Editar
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleInativar(u)}
                >
                  {u.status === "Ativo" ? "Inativar" : "Ativar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <UsuarioModal
        aberto={modalAberto}
        modoEdicao={modoEdicao}
        perfil={perfilModal}
        form={form}
        setForm={setForm}
        setPerfil={setPerfilModal}
        onClose={() => setModalAberto(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
