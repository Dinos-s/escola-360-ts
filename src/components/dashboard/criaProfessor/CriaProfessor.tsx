import { useEffect, useState } from "react";
import axios from "axios";
import "./CriaProfessor.css";

import { DataTable, type TableColumn } from "../../tabela/tabela";

interface Professor {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  matricula: string;
  status: string;
  dataAdmissao: string;
  formacaoAcad: string;
  titulacao: string;
  deficiencia: string;
  tipoDeficiencia: string;
}

function CriaProfessor() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    password: "",
    cpf: "",
    matricula: "",
    status: "",
    dataAdmissao: "",
    formacaoAcad: "",
    titulacao: "",
    deficiencia: "",
    tipoDeficiencia: "",
  });

  const buscarProfessores = async () => {
    try {
      const response = await axios.get("http://localhost:3000/professor");
      setProfessores(response.data);
    } catch {
      setError("Erro ao carregar Professores");
    }
  };

  useEffect(() => {
    buscarProfessores();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "deficiencia" && value === "Não") {
      setForm({
        ...form,
        [name]: value,
        tipoDeficiencia: "",
      });
      return;
    }

    setForm({ ...form, [name]: value });

    if (name === "cpf") {
      const cpfLimpo = value.replace(/\D/g, "");

      if (cpfLimpo.length === 11) {
        if (!validarCPF(cpfLimpo)) {
          setCpfError("CPF inválido");
        } else {
          setCpfError("");
        }
      } else {
        setCpfError("CPF deve conter 11 dígitos");
        setTimeout(() => {
          setCpfError("");
        }, 5000);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (cpfError) {
      setError("Corrija os erros do formulário antes de enviar.");
      return;
    }

    if (!editId && form.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (editId && form.password && form.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    const payload = {
      nome: form.nome,
      email: form.email,
      cpf: form.cpf,
      matricula: form.matricula,
      status: form.status,
      dataAdmissao: form.dataAdmissao,
      formacaoAcad: form.formacaoAcad,
      titulacao: form.titulacao,
      deficiencia: form.deficiencia,
      tipoDeficiencia: form.tipoDeficiencia,
      ...(form.password && { password: form.password }),
    };

    try {
      if (editId) {
        await axios.patch(
          `http://localhost:3000/professor/${editId}`,
          payload
        );

        setMessage("Professor atualizado com sucesso!");
      } else {
        const response = await axios.post(
          "http://localhost:3000/professor/registro",
          payload
        );

        setMessage(`Usuário ${response.data.nome} cadastrado com sucesso!`);
      }

  limparForm();
  setEditId(null);
  buscarProfessores();
    } catch (err: any) {
      if (err.response && err.response.data) {
        const errorMessage = err.response.data.message;

        if (Array.isArray(errorMessage)) {
          setError(errorMessage.join(", "));
        } else {
          setError(errorMessage || "Erro desconhecido");
        }
      } else {
        setError("Ocorreu um erro ao tentar cadastrar o aluno.");
      }
    }
    console.log("Dados enviados:", form);
    // Aqui você poderá usar axios.post("/professores", form)
  };

  const limparForm = () => {
    setForm({
      nome: "",
      email: "",
      password: "",
      cpf: "",
      matricula: "",
      status: "",
      dataAdmissao: "",
      formacaoAcad: "",
      titulacao: "",
      deficiencia: "",
      tipoDeficiencia: "",
    });
    setError("");
    setMessage("");
  };

  const validarCPF = (cpf: string) => {
    cpf = cpf.replace(/\D/g, "");

    if (cpf.length !== 11) return false;

    // Impede CPFs repetidos: 00000000000, 11111111111, etc.
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    // Primeiro dígito
    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf[i - 1]) * (11 - i);
    }
    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;

    // Segundo dígito
    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf[i - 1]) * (12 - i);
    }
    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[10])) return false;

    return true;
  };

  const handleInativar = async (usuario: any) => {
    const novoStatus = usuario.status === "Ativo" ? "Inativo" : "Ativo";
    const endpoint = `http://localhost:3000/professor/${usuario.id}/status`;

    await axios.patch(endpoint, { status: novoStatus });
    // window.location.reload();
    buscarProfessores();
  };

  const formatarParaInputDate = (data: string) => {
    if (!data) return "";
    return new Date(data).toISOString().split("T")[0];
  };

  const handleEdit = (p: Professor) => {
    setEditId(p.id);
    setForm({
      nome: p.nome,
      email: p.email,
      cpf: p.cpf,
      matricula: p.matricula,
      dataAdmissao: formatarParaInputDate(p.dataAdmissao),
      formacaoAcad: p.formacaoAcad,
      titulacao: p.titulacao,
      status: p.status,
      deficiencia: p.deficiencia,
      tipoDeficiencia: p.tipoDeficiencia,
      password: "",
    });
  };

  const columns: TableColumn<Professor>[] = [
    { key: "matricula", header: "Matrícula" },
    { key: "nome", header: "Nome" },
    { key: "email", header: "E-mail" },
    // { key: "cpf", header: "CPF" },
    // { key: "dataAdmissao", header: "Data de Admissão" },
    // { key: "status", header: "Status" },
    { key: 'formacaoAcad', header: 'Formação Acadêmica'},
    { key: 'titulacao', header: 'Titulação'},
    {
      key: "acoes",
      header: "Ações",
      render: (u) => (
        <div className="acoes">
          <button className="action-btn edit-btn" onClick={() => handleEdit(u)}>
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
    <div className="main-container">
      <h1 className="profile-title">Cadastro Professor</h1>
      {/* Mensagens de erro ou sucesso */}
      {error && <p className="error message">{error}</p>}
      {message && <p className="success message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="profile-fields">
          {/* ---------- COLUNA 1 ---------- */}
          <div className="column">
            <div className="form-group">
              <label>Nome completo</label>
              <input
                name="nome"
                placeholder="Digite o nome completo do professor"
                value={form.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>CPF</label>
              <input
                type="text"
                name="cpf"
                placeholder="Digite o cpf do professor"
                value={form.cpf}
                onChange={handleChange}
                className={cpfError ? "error" : ""}
                required
              />
              {cpfError && <span className="spanErro">{cpfError}</span>}
            </div>

            <div className="form-group">
              <label>Matrícula</label>
              <input
                name="matricula"
                placeholder="Digite a matrícula do professor"
                value={form.matricula}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                placeholder="E-mail do professor"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Data de Admissão</label>
              <input
                type="date"
                name="dataAdmissao"
                value={form.dataAdmissao}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Formação Acadêmica</label>
              <input
                name="formacaoAcad"
                placeholder="Formação Acadêmica do professor"
                value={form.formacaoAcad}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* ---------- COLUNA 2 ---------- */}
          <div className="column">
            <div className="form-group">
              <label>Titulação</label>
              <input
                name="titulacao"
                placeholder="Titulação do professor"
                value={form.titulacao}
                onChange={handleChange}
                required
              />
            </div>

            {/* <div className="form-group">
                            <label>Turma</label>
                            <select name="id_turma" value={form.id_turma} onChange={handleChange}>
                                <option value="">Selecione</option>

                                {turmas.map((turma) => (
                                    <option key={turma.id} value={turma.id}>
                                        {turma.nome} - {turma.turno}
                                    </option>
                                ))}
                            </select>
                        </div> */}

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
              >
                <option value="">Selecione</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>

            <div className="form-group">
              <label>Deficiência</label>
              <select
                name="deficiencia"
                required
                value={form.deficiencia}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="Sim">Sim</option>
                <option value="Nao">Não</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tipo de Deficiência</label>
              <input
                type="text"
                name="tipoDeficiencia"
                placeholder="Especifique o tipo de deficiência"
                value={form.tipoDeficiencia}
                onChange={handleChange}
                disabled={form.deficiencia !== "Sim"}
                className={`
                                    border rounded px-3 py-2 w-full
                                    ${
                                      form.deficiencia !== "Sim"
                                        ? "cursor-not-allowed bg-gray-100 opacity-50 text-gray-400"
                                        : "cursor-text bg-white"
                                    }
                                `}
                required={form.deficiencia === "Sim"}
              />
            </div>

            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                placeholder={
                  editId
                    ? "Deixe em branco para manter a senha atual"
                    : "Digite a senha do professor"
                }
                name="password"
                value={form.password}
                onChange={handleChange}
                required={!editId}
              />
            </div>
          </div>
        </div>

        {/* ---------- BOTÕES ---------- */}
        <div className="action-buttons">
          <button type="submit" className="save-btn">
            {editId ? "Atualizar" : "Cadastrar"}
          </button>
          <button type="button" className="cancel-btn" onClick={limparForm}>
            Cancelar
          </button>
        </div>
      </form>

      <h2>Profesores Cadastrados</h2>
      <DataTable
        columns={columns}
        data={professores}
        emptyMessage="Nenhum professor cadastrado"
      />
    </div>
  );
}

export default CriaProfessor;