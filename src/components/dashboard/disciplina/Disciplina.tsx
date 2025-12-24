import { useState, useEffect } from "react";
import axios from "axios";
import "./Disciplina.css";

// const professoresDisponiveis = [
//     { value: "", label: "Selecione um professor" },
//     { value: "prof1", label: "João Silva" },
//     { value: "prof2", label: "Maria Santos" },
//     { value: "prof3", label: "Carlos Oliveira" },
// ];

// const statusOptions = [
//     { value: "ativa", label: "Ativa" },
//     { value: "inativa", label: "Inativa" },
// ];
interface Disciplina {
    id: number;
    nome: string;
    codDisciplina: string;
    cargaHoraria: number;
    status: "ativa" | "inativa";
    assunto: string;
}

interface DisciplinaForm {
    nome: string;
    codDisciplina: string;
    cargaHoraria: string;
    status: "ativa" | "inativa";
    assunto: string;
}

const api = axios.create({
    baseURL: 'http://localhost:3000',
});

function Disciplina() {

    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
    const [editId, setEditId] = useState<number | null>(null);

    const [form, setForm] = useState<DisciplinaForm>({
        nome: "",
        codDisciplina: "",
        cargaHoraria: "",
        status: "ativa",
        assunto: "",
    });

    useEffect(() => { carregarDisciplinas() })

    const carregarDisciplinas = async () => {
        const { data } = await api.get<Disciplina[]>('/disciplina');
        setDisciplinas(data);
    }

    const gerarCodigo = (nome: string) => {
        const prefixo = nome.substring(0, 3).toUpperCase() || "DIS";
        const numero = String(disciplinas.length + 1).padStart(3, "0");
        return `${prefixo}${numero}`;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
            codDisciplina: name === "nome" ? gerarCodigo(value) : prev.codDisciplina,
        }));
    };

    /* =======================
       SUBMIT
    ======================= */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            nome: form.nome,
            codDisciplina: form.codDisciplina,
            cargaHoraria: Number(form.cargaHoraria),
            status: form.status,
            assunto: form.assunto,
        };

        if (editId) {
            await api.patch(`/disciplina/${editId}`, payload);
        } else {
            await api.post("/disciplina/registro", payload);
        }

        limparFormulario();
        carregarDisciplinas();
    };

    const limparFormulario = () => {
        setForm({
            nome: "",
            codDisciplina: "",
            cargaHoraria: "",
            status: "ativa",
            assunto: "",
        });
        setEditId(null);
    };

    /* =======================
       AÇÕES
    ======================= */
    const handleCancelar = () => {
        limparFormulario();
    };

    const handleEdit = (d: Disciplina) => {
        setEditId(d.id);
        setForm({
            nome: d.nome,
            codDisciplina: d.codDisciplina,
            cargaHoraria: String(d.cargaHoraria),
            status: d.status,
            assunto: d.assunto,
        });
    };

    const handleInativar = async (disciplina: Disciplina) => {
        await api.patch(`/disciplina/${disciplina.id}`, {
            nome: disciplina.nome,
            codDisciplina: disciplina.codDisciplina,
            cargaHoraria: disciplina.cargaHoraria,
            assunto: disciplina.assunto,
            status: disciplina.status === "ativa" ? "inativa" : "ativa",
        });
        carregarDisciplinas();
    };

    // return (
    //     <div className="main-container">
    //         <h1 className="change-password-title">Criar Disciplina</h1>

    //         <form onSubmit={handleSubmit}>
    //             <div className="card-fields">
    //                 <div className="form-group">
    //                     <label>Nome da Disciplina</label>
    //                     <input
    //                         type="text"
    //                         name="nomeDisciplina"
    //                         placeholder="Digite o nome da disciplina"
    //                         value={form.nome}
    //                         onChange={handleChange}
    //                     />
    //                 </div>

    //                 <div className="form-group">
    //                     <label>Código da Disciplina</label>
    //                     <input
    //                         type="text"
    //                         name="codigoDisciplina"
    //                         placeholder="O código da disciplina é gerado automaticamente"
    //                         value={form.codigo}
    //                         onChange={handleChange}
    //                     />
    //                 </div>

    //                 <div className="form-group">
    //                     <label>Carga Horária</label>
    //                     <input
    //                         type="number"
    //                         name="cargaHoraria"
    //                         placeholder="Digite a carga horária da disciplina"
    //                         value={form.cargaHoraria}
    //                         onChange={handleChange}
    //                     />
    //                 </div>

    //                 <div className="form-group">
    //                     <label>Professor Responsável</label>
    //                     <select
    //                         name="professorResponsavel"
    //                         value={form.professor}
    //                         onChange={handleChange}>
    //                         {professores.map((professor) => (
    //                             <option key={professor.value} value={professor.value}>
    //                                 {professor.label}
    //                             </option>
    //                         ))}
    //                     </select>
    //                 </div>

    //                 <div className="form-group">
    //                     <label>Status da Disciplina</label>
    //                     <select
    //                         name="statusDisciplina"
    //                         value={form.status}
    //                         onChange={handleChange}
    //                     >
    //                         {statusOptions.map((option) => (
    //                             <option key={option.value} value={option.value}>
    //                                 {option.label}
    //                             </option>
    //                         ))}
    //                     </select>
    //                 </div>
    //             </div>
    //         </form>
    //     </div>
    // );


    return (
        <div className="main-container">
            <h1 className="disciplina-title">
                {editId ? "Atualizar Disciplina" : "Criar Disciplina"}
            </h1>

            {/* ---------------- FORM ---------------- */}
            <form onSubmit={handleSubmit}>
                <div className="card-fields">
                    <div className="column">
                        <div className="form-group">
                            <label>Nome da Disciplina</label>
                            <input
                                type="text"
                                name="nome"
                                placeholder="Digite o nome da disciplina"
                                value={form.nome}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Código da Disciplina</label>
                            <input
                            type="text"
                            name="codDisciplina"
                            value={form.codDisciplina}
                            onChange={(e) =>
                                setForm({
                                ...form,
                                codDisciplina: e.target.value.toUpperCase(),
                                })
                            }
                            placeholder="Ex: MAT-001"
                            required
                            />
                        </div>

                        <div className="form-group">
                            <label>Carga Horária</label>
                            <input
                                type="number"
                                name="cargaHoraria"
                                placeholder="Digite a carga horária"
                                value={form.cargaHoraria}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="column">
                        {/* <div className="form-group">
                            <label>Professor Responsável</label>
                            <select
                                name="professor"
                                value={form.professorId}
                                onChange={handleChange}
                            >
                                <option value="">Selecione um professor</option>
                                {professores.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.nome}
                                    </option>
                                ))}
                            </select>
                        </div> */}

                        <div className="form-group">
                            <label>Status da Disciplina</label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="ativa">Ativa</option>
                                <option value="inativa">Inativa</option>
                            </select>
                        </div>

                        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                            <label>Assunto da Disciplina</label>
                            <input
                                type="text"
                                name="assunto"
                                placeholder="Ex: Geometria, Gramática, Idade Média..."
                                value={form.assunto}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn-salvar">
                    {editId ? "Atualizar Disciplina" : "Salvar Disciplina"}
                </button>
                
                    <button
                    type="button"
                    className="btn-cancelar"
                    onClick={handleCancelar}
                    >
                    Cancelar
                    </button>
            </form>

            {/* ---------------- TABELA ---------------- */}
            <h2 style={{ marginTop: "40px" }}>Disciplinas Cadastradas</h2>

            <div className="tabela-disciplina">
                <table className="disciplina-table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nome</th>
                            <th>Carga Horária</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {disciplinas.map((d) => (
                            <tr key={d.codDisciplina}>
                                <td>{d.codDisciplina}</td>
                                <td>{d.nome}</td>
                                <td>{d.cargaHoraria}</td>
                                <td>{d.status}</td>

                                <td>
                                    <div className="acoes">
                                        <button onClick={() => handleEdit(d)} className="action-btn edit-btn">Editar</button>
                                        <button onClick={() => handleInativar(d)} className="action-btn delete-btn">
                                            {d.status === "ativa" ? "Inativar" : "Ativar"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default Disciplina;