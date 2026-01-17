import { useEffect, useState } from "react";
import axios from "axios";
import "./CriaAluno.css";

import { DataTable, type TableColumn } from "../../tabela/tabela";

interface Aluno {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  matricula: string;
  dataNasc: string;
  status: string;
  deficiencia: string;
  tipoDeficiencia: string;
}

function CriaAluno() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [alunos, setAlunos] = useState<Aluno[]>([]);

  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    password: "",
    cpf: "",
    matricula: "",
    status: "",
    deficiencia: "",
    tipoDeficiencia: "",
    dataNasc: "",
  });

  const buscarAlunos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/aluno");
      console.log(response.data);
      
      setAlunos(response.data);
    } catch {
      setError("Erro ao carregar alunos");
    }
  };

  useEffect(() => {
    buscarAlunos();
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
      deficiencia: form.deficiencia,
      tipoDeficiencia: form.tipoDeficiencia,
      dataNasc: form.dataNasc,
      ...(form.password && { password: form.password }),
    };

    try {
      if (editId) {
        await axios.patch(
          `http://localhost:3000/aluno/${editId}`,
          payload
        );

        setMessage("Aluno atualizado com sucesso!");
      } else {
        const response = await axios.post(
          "http://localhost:3000/aluno/registro",
          payload
        );
        
        setMessage(`Usuário ${response.data.nome} cadastrado com sucesso!`);
      }

      limparForm();
      setEditId(null);
      buscarAlunos();
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
    // Aqui você poderá usar axios.post("/alunos", form)
  };

  const limparForm = () => {
    setForm({
      nome: "",
      email: "",
      password: "",
      cpf: "",
      matricula: "",
      status: "",
      deficiencia: "",
      tipoDeficiencia: "",
      dataNasc: "",
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
    const endpoint = `http://localhost:3000/aluno/${usuario.id}/status`;

    await axios.patch(endpoint, { status: novoStatus });
    // window.location.reload();
    buscarAlunos();
  };

  const formatarParaInputDate = (data: string) => {
    if (!data) return "";
    return new Date(data).toISOString().split("T")[0];
  };

  const handleEdit = (a: Aluno) => {
    setEditId(a.id);
    setForm({
      nome: a.nome,
      email: a.email,
      cpf: a.cpf,
      matricula: a.matricula,
      dataNasc: formatarParaInputDate(a.dataNasc),
      status: a.status,
      deficiencia: a.deficiencia,
      tipoDeficiencia: a.tipoDeficiencia,
      password: "",
    });
  };

  const columns: TableColumn<Aluno>[] = [
    { key: "matricula", header: "Matrícula" },
    { key: "nome", header: "Nome" },
    { key: "email", header: "E-mail" },
    // { key: 'cpf', header: 'CPF' },
    // { key: 'dataNasc', header: 'Data de Nascimento' },
    // { key: 'status', header: 'Status' },
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
      <h1 className="profile-title">Cadastro Aluno</h1>
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
                type="text"
                name="nome"
                placeholder="Digite o nome completo do Aluno"
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
                placeholder="Digite o cpf do Aluno"
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
                type="text"
                name="matricula"
                placeholder="Digite a matrícula do Aluno"
                value={form.matricula}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                name="email"
                placeholder="E-mail do Aluno"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Data de Nascimento</label>
              <input
                type="date"
                name="dataNasc"
                value={form.dataNasc}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* ---------- COLUNA 2 ---------- */}
          <div className="column">
            {/* <div className="form-group">
                            <label>Turma</label>
                            <select
                                name="id_turma"
                                value={form.id_turma}
                                onChange={handleChange}
                            >
                                <option value="">Selecione a turma</option>
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
                required
                className={`
                                    border rounded px-3 py-2 w-full
                                    ${
                                      form.deficiencia !== "Sim"
                                        ? "cursor-not-allowed bg-gray-100 opacity-50 text-gray-400"
                                        : "cursor-text bg-white"
                                    }
                                `}
              />
            </div>

            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                name="password"
                placeholder={editId ? "Deixe em branco para manter a senha atual" : "Senha de acesso do Aluno"}
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

      <h2>Alunos Cadastrados</h2>
      <DataTable
        columns={columns}
        data={alunos}
        emptyMessage="Nenhum aluno cadastrado"
      />
    </div>
  );
}

export default CriaAluno;
