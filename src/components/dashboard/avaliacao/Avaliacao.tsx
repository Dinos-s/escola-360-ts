import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./Avaliacao.css";
import { DataTable, type TableColumn } from "../../tabela/tabela";

/* ================= TIPAGENS ================= */

type TurmaProfessorDisciplina = {
  id: number;
  turma: {
    id: number;
    nome: string;
  };
  disciplina: {
    id: number;
    nome: string;
  };
};

type AvaliacaoForm = {
  titulo: string;
  tipo: string;
  periodo: string;
  anoLetivo: string;
  turmaId: number | "";
  disciplinaId: number | "";
  descricao: string;
  ficheiro: File | null;
};

type Avaliacao = {
  id: number;
  titulo: string;
  tipo: string;
  periodo: string;
  anoLetivo: string;
  descricao: string;
  visivelParaAluno: boolean;
  turma: {
    id: number;
    nome: string;
  };
  disciplina: {
    id: number;
    nome: string;
  };
};

type LinhaSubmissao = {
  id: number;
  aluno: {
    nome: string;
  };
  nota: number | null;
  estado: "PENDENTE" | "CORRIGIDO";
};


function Avaliacao() {
  const anoAtual = new Date().getFullYear().toString();

  /* ================= STATES ================= */

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [avaliacoes, setAvaliacao] = useState<Avaliacao[]>([]);

  const [turmaProfessorDisciplina, setTurmaProfessorDisciplina] =
    useState<TurmaProfessorDisciplina[]>([]);

  const [turmasUnicas, setTurmasUnicas] =
    useState<{ id: number; nome: string }[]>([]);

  const [disciplinasFiltradas, setDisciplinasFiltradas] =
    useState<TurmaProfessorDisciplina[]>([]);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState<Avaliacao | null>(null);

  const [submissoes, setSubmissoes] = useState<LinhaSubmissao[]>([]);


  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<AvaliacaoForm>({
    titulo: "",
    tipo: "",
    periodo: "",
    anoLetivo: anoAtual,
    turmaId: "",
    disciplinaId: "",
    descricao: "",
    ficheiro: null,
  });

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const professorId = localStorage.getItem("id");

        if (!professorId) {
          setError("Professor não identificado");
          return;
        }

        const [resTPD, resAV] = await Promise.all([
          axios.get(
            "http://localhost:3000/turma-professor-disciplina/professor",
            {
              headers: {
                "professor-id": professorId,
              },
            }
          ),
          axios.get(
            `http://localhost:3000/avaliacao/professor/${professorId}`
          ),
        ]);

        setTurmaProfessorDisciplina(resTPD.data);
        setAvaliacao(resAV.data);

        const turmasUnicas = Array.from(
          new Map(
            resTPD.data.map((item: TurmaProfessorDisciplina) => [
              item.turma.id,
              item.turma,
            ])
          ).values()
        );

        setTurmasUnicas(turmasUnicas);
      } catch {
        setError("Erro ao buscar dados.");
      }
    };

    fetchData();
  }, []);

  const carregarSubmissoes = async (avaliacao: Avaliacao) => {
    try {
      const professorId = localStorage.getItem("id");

      if (!professorId) return;

      const res = await axios.get(
        `http://localhost:3000/submissao-avaliacao/professor/avaliacao/${avaliacao.id}`,
        {
          headers: {
            "professor-id": professorId,
          },
        }
      );

      setAvaliacaoSelecionada(avaliacao);
      setSubmissoes(res.data);
    } catch {
      setError("Erro ao carregar submissões");
    }
  };


  /* ================= HANDLERS ================= */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTurmaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const turmaId = Number(e.target.value);

    setForm((prev) => ({
      ...prev,
      turmaId,
      disciplinaId: "",
    }));

    const disciplinas = turmaProfessorDisciplina.filter(
      (tpd) => tpd.turma.id === turmaId
    );

    setDisciplinasFiltradas(disciplinas);
  };

  const handleDisciplinaChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const disciplinaId = Number(e.target.value);

    setForm((prev) => ({
      ...prev,
      disciplinaId,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({ ...prev, ficheiro: file }));
    setPreviewUrl(URL.createObjectURL(file));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.turmaId || !form.disciplinaId) {
      setError("Selecione uma turma e uma disciplina.");
      return;
    }

    try {
      const professorId = localStorage.getItem("id");

      if (!professorId) {
        setError("Professor não identificado.");
        return;
      }

      const formData = new FormData();
      formData.append("titulo", form.titulo);
      formData.append("tipo", form.tipo);
      formData.append("periodo", form.periodo);
      formData.append("anoLetivo", form.anoLetivo);
      formData.append("descricao", form.descricao);
      formData.append("turmaId", String(form.turmaId));
      formData.append("disciplinaId", String(form.disciplinaId));

      if (form.ficheiro) {
        formData.append("ficheiro", form.ficheiro);
      }

      await axios.post(
        "http://localhost:3000/avaliacao/professor",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "professor-id": professorId,
          },
        }
      );

      setMessage("Avaliação cadastrada com sucesso!");
      limparForm();
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao cadastrar avaliação.");
    }
  };

  const limparForm = () => {
    setForm({
      titulo: "",
      tipo: "",
      periodo: "",
      anoLetivo: anoAtual,
      turmaId: "",
      disciplinaId: "",
      descricao: "",
      ficheiro: null,
    });

    setPreviewUrl(null);
    setDisciplinasFiltradas([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const corrigirSubmissao = async (submissaoId: number) => {
  const nota = prompt("Informe a nota:");
  if (!nota) return;

  try {
    const professorId = localStorage.getItem("id");

    await axios.patch(
      `http://localhost:3000/submissao-avaliacao/professor/${submissaoId}/corrigir`,
      { nota: Number(nota) },
      {
        headers: {
          "professor-id": professorId,
        },
      }
    );

    if (avaliacaoSelecionada) {
      carregarSubmissoes(avaliacaoSelecionada);
    }
  } catch {
    setError("Erro ao corrigir submissão");
  }
};

const baixarSubmissao = (submissaoId: number) => {
  const professorId = localStorage.getItem("id");

  window.open(
    `http://localhost:3000/submissao-avaliacao/professor/submissao/${submissaoId}/download`,
    "_blank"
  );
};


  /* ================= PATCH VISIBILIDADE ================= */

  const handleVisible = async (av: Avaliacao) => {
    try {
      const professorId = localStorage.getItem("id");

      await axios.patch(
        `http://localhost:3000/avaliacao/professor/${av.id}`,
        { visivelParaAluno: !av.visivelParaAluno },
        {
          headers: {
            "professor-id": professorId,
          },
        }
      );

      setAvaliacao((prev) =>
        prev.map((a) =>
          a.id === av.id
            ? { ...a, visivelParaAluno: !a.visivelParaAluno }
            : a
        )
      );
    } catch {
      setError("Erro ao atualizar visibilidade da avaliação.");
    }
  };

  /* ================= COLUMNS ================= */

  const columns: TableColumn<Avaliacao>[] = [
    { key: "titulo", header: "Título" },
    { key: "tipo", header: "Tipo" },
    {
      key: "turma",
      header: "Turma",
      render: (av) => av.turma.nome,
    },
    {
      key: "disciplina",
      header: "Disciplina",
      render: (av) => av.disciplina.nome,
    },
    { key: "periodo", header: "Período" },
    { key: "anoLetivo", header: "Ano Letivo" },
    { key: "descricao", header: "Descrição" },
    {
      key: "visivelParaAluno",
      header: "Visível para Aluno",
      render: (av) => (
        <button
          className="action-btn edit-btn"
          onClick={() => handleVisible(av)}
        >
          {av.visivelParaAluno ? "Ocultar" : "Mostrar"}
        </button>
      ),
    },
  ];

  const columnsSubmissoes: TableColumn<LinhaSubmissao>[] = [
  {
    key: "aluno",
    header: "Aluno",
    render: (s) => s.aluno.nome,
  },
  {
    key: "estado",
    header: "Enviada",
    render: (s) => (s.estado ? "Sim" : "Não"),
  },
  {
    key: "estado",
    header: "Corrigida",
    render: (s) => (s.estado === "CORRIGIDO" ? "Sim" : "Não"),
  },
  {
    key: "nota",
    header: "Nota",
    render: (s) => (s.nota ?? "-"),
  },
  {
    key: "acoes",
    header: "Ações",
    render: (s) => (
      <>
        {s.estado !== "CORRIGIDO" && (
          <button
            className="action-btn edit-btn"
            onClick={() => corrigirSubmissao(s.id)}
          >
            Corrigir
          </button>
        )}

        <button
          className="action-btn"
          onClick={() => baixarSubmissao(s.id)}
        >
          Baixar
        </button>
      </>
    ),
  },
];


  /* ================= RENDER ================= */

  return (
    <div className="main-container">
      <h1 className="profile-title">Cadastro de Avaliação</h1>

      {error && <p className="error message">{error}</p>}
      {message && <p className="success message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="profile-fields">
          {/* COLUNA 1 */}
          <div className="column">
            <div className="form-group">
              <label>Turma</label>
              <select
                value={form.turmaId}
                onChange={handleTurmaChange}
                required
              >
                <option value="">Selecione uma turma</option>
                {turmasUnicas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Título</label>
              <input
                name="titulo"
                placeholder="Descreva a prova"
                value={form.titulo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Tipo</label>
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                required
              >
                <option value="">Selecione</option>
                <option value="TESTE">Teste</option>
                <option value="PROVA">Prova</option>
              </select>
            </div>

            <div className="form-group">
              <label>Período</label>
              <select
                name="periodo"
                value={form.periodo}
                onChange={handleChange}
                required
              >
                <option value="">Selecione</option>
                <option value="B1">1° Bimestre</option>
                <option value="B2">2° Bimestre</option>
                <option value="B3">3° Bimestre</option>
                <option value="B4">4° Bimestre</option>
              </select>
            </div>

            <div className="form-group">
              <label>Arquivo</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* COLUNA 2 */}
          <div className="column">
            <div className="form-group">
              <label>Disciplina</label>
              <select
                value={form.disciplinaId}
                onChange={handleDisciplinaChange}
                required
              >
                <option value="">Selecione</option>
                {disciplinasFiltradas.map((d) => (
                  <option key={d.id} value={d.disciplina.id}>
                    {d.disciplina.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Ano Letivo</label>
              <input
                name="anoLetivo"
                value={form.anoLetivo}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Descrição</label>
              <textarea
                name="descricao"
                placeholder="Descreva a prova"
                value={form.descricao}
                onChange={handleChange}
              />
            </div>

            {previewUrl && (
              <div className="preview-box">
                {form.ficheiro?.type.startsWith("image") ? (
                  <img src={previewUrl} alt="Preview" />
                ) : (
                  <iframe src={previewUrl} title="Preview" />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="action-buttons">
          <button type="submit" className="save-btn">
            Cadastrar
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={limparForm}
          >
            Cancelar
          </button>
        </div>
      </form>

      <h2>Lista das Avaliações</h2>
      <DataTable
        columns={columns}
        data={avaliacoes}
        emptyMessage="Nenhuma Avaliação Lançada"
      />

      {avaliacaoSelecionada && (
        <>
          <h2>
            Submissões — {avaliacaoSelecionada.titulo}
          </h2>

          <DataTable
            columns={columnsSubmissoes}
            data={submissoes}
            emptyMessage="Nenhuma submissão enviada"
          />
        </>
      )}

    </div>
  );
}

export default Avaliacao;
