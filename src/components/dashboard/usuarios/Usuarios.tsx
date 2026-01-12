import { useEffect, useState } from "react";
import axios from "axios";
import "./Usuarios.css";
import UsuarioModal from "./modalUsers/ModalUsers";
import { DataTable, type TableColumn } from "../../tabela/tabela";

// ===== Interfaces =====
interface BaseUser {
  id: number;
  nome: string;
  email: string;
  status: string;
  tipo: "Aluno" | "Professor";
}

type Usuario = {
  id: number;
  nome: string;
  email: string;
  status: "Ativo" | "Inativo";
};

interface Aluno extends BaseUser {
  matricula: string;
  turma?: string;
}

interface Professor extends BaseUser {
  disciplina?: string;
}

// ===== Componente =====
export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [perfilExibido, setPerfilExibido] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [termoBusca, setTermoBusca] = useState("");

  // Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [perfilModal, setPerfilModal] = useState<"alunos" | "professores" | "">(
    ""
  );
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
      setProfessores(
        resProf.data.map((p: any) => ({ ...p, tipo: "Professor" }))
      );
    };

    carregar();
  }, []);

  // ===== Ações =====
  const handleEditar = (usuario: any) => {
    setModoEdicao(true);
    setUsuarioEditando(usuario);

    const perfil = usuario.tipo === "Aluno" ? "alunos" : "professores";
    setPerfilModal(perfil);

    const formAjustado = { ...usuario,
      formacaoAcademica: usuario.formacaoAcad || "",
    };

    // ✅ Ajuste da data para input[type="date"]
    if (perfil === "alunos" && usuario.dataNasc) {
      formAjustado.dataNascimento = usuario.dataNasc.split("T")[0];
    }

    if (perfil === "professores" && usuario.dataAdmissao) {
      formAjustado.dataAdmissao = usuario.dataAdmissao.split("T")[0];
    }

    setForm(formAjustado);
    setModalAberto(true);
  };


  // const handleSubmit = async () => {
  //   try {
  //     if (modoEdicao) {
  //       const endpoint =
  //         perfilModal === "alunos"
  //           ? `http://localhost:3000/aluno/${usuarioEditando.id}`
  //           : `http://localhost:3000/professor/${usuarioEditando.id}`;
  //       const { id, tipo, senha, status, ...dadosParaEnviar } = form;

  //       const response = await axios.patch(endpoint, dadosParaEnviar);
  //       setUsuarios((prev) =>
  //         prev.map((u) => (u.id === usuarioEditando.id ? response.data : u))
  //       );
  //     } else {
  //       let dadosParaEnviar: any = {
  //         nome: form.nome,
  //         matricula: form.matricula,
  //         email: form.email,
  //         cpf: form.cpf,
  //         password: form.senha,
  //         status: form.status,
  //         deficiencia: form.deficiencia,
  //         tipoDeficiencia: form.tipoDeficiencia || "",
  //       };

  //       if (perfilModal === "alunos") {
  //         dadosParaEnviar = {
  //           ...dadosParaEnviar,
  //           dataNasc: form.dataNascimento,
  //         };
  //       }

  //       if (perfilModal === "professores") {
  //         dadosParaEnviar = {
  //           ...dadosParaEnviar,
  //           dataAdmissao: form.dataAdmissao,
  //           titulacao: form.titulacao,
  //           formacaoAcad: form.formacaoAcademica,
  //         };
  //       }
  //       const endpoint =
  //         perfilModal === "alunos"
  //           ? "http://localhost:3000/aluno/registro"
  //           : "http://localhost:3000/professor/registro";

  //       const response = await axios.post(endpoint, dadosParaEnviar);
  //       setUsuarios((prev) => [...prev, response.data]);
  //     }

  //     setModalAberto(false);
  //     // window.location.reload();
  //   } catch (err) {
  //     console.error("Erro ao salvar usuário", err);
  //     console.log("dados error:", err.response.data);
  //   }
  // };

  const handleSubmit = async () => {
    try {
      if (modoEdicao) {
        const endpoint =
          perfilModal === "alunos"
            ? `http://localhost:3000/aluno/${usuarioEditando.id}`
            : `http://localhost:3000/professor/${usuarioEditando.id}`;

        let dados: any = {
          nome: form.nome,
          email: form.email,
        };

        if (perfilModal === "alunos") {
          dados.dataNasc = form.dataNascimento;
        }

        if (perfilModal === "professores") {
          dados = {
            ...dados,
            dataAdmissao: form.dataAdmissao,
            titulacao: form.titulacao,
            formacaoAcad: form.formacaoAcademica,
          };
        }

        const res = await axios.patch(endpoint, dados);

        if (perfilModal === "alunos") {
          setAlunos((prev) =>
            prev.map((a) => (a.id === usuarioEditando.id ? res.data : a))
          );
        } else {
          setProfessores((prev) =>
            prev.map((p) => (p.id === usuarioEditando.id ? res.data : p))
          );
        }
      }

      setModalAberto(false);
    } catch (err: any) {
      console.error("Erro ao salvar", err.response?.data);
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

  const columns: TableColumn<Usuario>[] = [
    { key: "nome", header: "Nome" },
    { key: "email", header: "E-mail" },
    { key: "status", header: "Status" },
    {
      key: "acoes",
      header: "Ações",
      render: (u) => (
        <div className="acoes">
          <button
            className="action-btn edit-btn"
            onClick={() => handleEditar(u)}
          >
            Editar
          </button>

          <button
            className="action-btn delete-btn"
            onClick={() => handleInativar(u)}
          >
            {u.status === "Ativo" ? "Inativar" : "Ativar"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container">
      <div className="header-users">

        <div className="spacer"></div>

        <div className="header-text">
          <h1>Gerenciamento de Usuários</h1>
          {/* <p>Visualize e gerencie as contas de alunos e professores.</p> */}
        </div>

        {/* Botão flutuante */}
        <button
          className="btn-add-user"
          onClick={() => {
            setModoEdicao(false);
            setForm({});
            setPerfilModal("");
            setModalAberto(true);
          }}
        >
          <span className="plus-icon">+</span> Add Usuário
        </button>
      </div>

      {/* Abas */}
      <div className="tabs-container">
        {["Todos", "Alunos", "Professores"].map((t) => (
          <button
            key={t}
            className={`tab-button ${
              perfilExibido === t.toLowerCase() ? "active" : ""
            }`}
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

      <DataTable
        columns={columns}
        data={filtrados}
        emptyMessage="Nenhum usuário encontrado"
      />

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
