import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./Avaliacao.css";

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

function Avaliacao() {
  const anoAtual = new Date().getFullYear().toString();

  /* ================= STATES ================= */

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [turmaProfessorDisciplina, setTurmaProfessorDisciplina] =
    useState<TurmaProfessorDisciplina[]>([]);

  const [turmasUnicas, setTurmasUnicas] = useState<
    { id: number; nome: string }[]
  >([]);

  const [disciplinasFiltradas, setDisciplinasFiltradas] =
    useState<TurmaProfessorDisciplina[]>([]);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
        const res = await axios.get(
          "http://localhost:3000/turma-professor-disciplina"
        );

        setTurmaProfessorDisciplina(res.data);

        const turmasMap = new Map<number, { id: number; nome: string }>();

        res.data.forEach((item: TurmaProfessorDisciplina) => {
          turmasMap.set(item.turma.id, item.turma);
        });

        setTurmasUnicas(Array.from(turmasMap.values()));
      } catch {
        setError("Erro ao buscar dados.");
      }
    };

    fetchData();
  }, []);

  /* ================= HANDLERS ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
              <label>Título</label>
              <input
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Tipo</label>
              <select name="tipo" value={form.tipo} onChange={handleChange} required>
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
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="B3">B3</option>
                <option value="B4">B4</option>
              </select>
            </div>

            <div className="form-group">
              <label>Turma</label>
              <select value={form.turmaId} onChange={handleTurmaChange} required>
                <option value="">Selecione</option>
                {turmasUnicas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Arquivo</label>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} />
            </div>
          </div>

          {/* COLUNA 2 */}
          <div className="column">
            <div className="form-group">
              <label>Ano Letivo</label>
              <input
                name="anoLetivo"
                value={form.anoLetivo}
                onChange={handleChange}
              />
            </div>

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
              <label>Descrição</label>
              <textarea
                name="descricao"
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
          <button type="button" className="cancel-btn" onClick={limparForm}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default Avaliacao;
