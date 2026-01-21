import { useEffect, useState } from "react";
import axios from "axios";
import "./Notas.css";
import DataTable, { type TableColumn } from "../../tabela/tabela";

/* ================= TIPAGENS ================= */

type AvaliacaoAluno = {
  aluno: {
    id: number;
    nome: string;
  };
  turma: {
    id: number;
    nome: string;
  };
  disciplina: {
    id: number;
    nome: string;
  };
  avaliacao: {
    id: number;
    titulo: string;
    visivelParaAluno: boolean;
  };
  respondeu: boolean;
  corrigida: boolean;
  nota: number | null;
};

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

type NotaForm = {
  turmaId: number | "";
  disciplinaId: number | "";
  nota: string;
  pontosFortes: string;
  pontosFracos: string;
};

/* ================= COMPONENTE ================= */

function Notas() {
  /* ================= STATES ================= */

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [correcoes, setCorrecoes] = useState<AvaliacaoAluno[]>([]);

  const [turmaProfessorDisciplina, setTurmaProfessorDisciplina] =
    useState<TurmaProfessorDisciplina[]>([]);

  const [turmasUnicas, setTurmasUnicas] =
    useState<{ id: number; nome: string }[]>([]);

  const [disciplinasFiltradas, setDisciplinasFiltradas] =
    useState<TurmaProfessorDisciplina[]>([]);

  const [form, setForm] = useState<NotaForm>({
    turmaId: "",
    disciplinaId: "",
    nota: "",
    pontosFortes: "",
    pontosFracos: "",
  });

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const professorId = localStorage.getItem("id");

        if (!professorId) {
          setError("Professor não identificado.");
          return;
        }

        const res = await axios.get(
          "http://localhost:3000/turma-professor-disciplina/professor",
          {
            headers: {
              "professor-id": professorId,
            },
          }
        );

        const subAV = await axios.get(
          `http://localhost:3000/avaliacao/professor/${professorId}`
        );

        setTurmaProfessorDisciplina(res.data);

        const turmas = Array.from(
          new Map(
            res.data.map((item: TurmaProfessorDisciplina) => [
              item.turma.id,
              item.turma,
            ])
          ).values()
        );

        setTurmasUnicas(turmas);
      } catch {
        setError("Erro ao carregar turmas.");
      }
    };

    fetchData();
  }, []);

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
    setForm((prev) => ({
      ...prev,
      disciplinaId: Number(e.target.value),
    }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.turmaId || !form.disciplinaId || !form.nota) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const professorId = localStorage.getItem("id");

      await axios.post(
        "http://localhost:3000/submissao-avaliacao",
        {
          turmaId: form.turmaId,
          disciplinaId: form.disciplinaId,
          nota: Number(form.nota),
          pontosFortes: form.pontosFortes,
          pontosMelhorar: form.pontosFracos,
        },
        {
          headers: {
            "professor-id": professorId,
          },
        }
      );

      setMessage("Nota registrada com sucesso!");
      limparForm();
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao salvar nota.");
    }
  };

  const limparForm = () => {
    setForm({
      turmaId: "",
      disciplinaId: "",
      nota: "",
      pontosFortes: "",
      pontosFracos: "",
    });

    setDisciplinasFiltradas([]);
  };

  const columns: TableColumn<AvaliacaoAluno>[] = [
  {
    key: "aluno",
    header: "Aluno",
    render: (row) => row.aluno.nome,
  },
  {
    key: "turma",
    header: "Turma",
    render: (row) => row.turma.nome,
  },
  {
    key: "disciplina",
    header: "Disciplina",
    render: (row) => row.disciplina.nome,
  },
  {
    key: "avaliacao",
    header: "Avaliação",
    render: (row) => row.avaliacao.titulo,
  },
  {
    key: "visivelParaAluno",
    header: "Enviada",
    render: (row) =>
      row.avaliacao.visivelParaAluno ? "Sim" : "Não",
  },
  {
    key: "respondeu",
    header: "Respondida",
    render: (row) => (row.respondeu ? "Sim" : "Não"),
  },
  {
    key: "corrigida",
    header: "Corrigida",
    render: (row) => (row.corrigida ? "Sim" : "Não"),
  },
  {
    key: "acoes",
    header: "Ações",
    render: (row) => (
      <>
        {row.respondeu && !row.corrigida && (
          <button
            className="action-btn edit-btn"
            onClick={() => abrirCorrecao(row)}
          >
            Corrigir
          </button>
        )}

        {row.corrigida && (
          <span className="badge-ok">✔ Corrigida</span>
        )}
      </>
    ),
  },
];


  /* ================= RENDER ================= */

  return (
    <div className="main-container">
      <h1 className="profile-title">Lançamento de Notas</h1>

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
              <label>Nota</label>
              <input
                type="number"
                step="0.1"
                name="nota"
                placeholder="Ex: 10.0"
                value={form.nota}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Pontos Fortes</label>
              <textarea
                name="pontosFortes"
                value={form.pontosFortes}
                onChange={handleChange}
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
              <label>Pontos a Melhorar</label>
              <textarea
                name="pontosFracos"
                value={form.pontosFracos}
                onChange={handleChange}
              />
            </div>
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

      <h2>Lista de Notas Lançadas</h2>
      <DataTable columns={columns} data={correcoes} emptyMessage="Nenhuma Nota Lançada" />
    </div>
  );
}

export default Notas;