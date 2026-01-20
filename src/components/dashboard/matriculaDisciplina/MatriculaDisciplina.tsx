import { useState, useEffect } from 'react';
import axios from 'axios';
import './MatriculaDisciplina.css';
import { DataTable, type TableColumn } from '../../tabela/tabela';

/* ================= TIPAGENS ================= */

type Matricula = {
    id: number;
    anoLetivo?: string;
    aluno?: { nome: string };
    turma?: {
        id: number;
        nome: string;
    };
};

type ProfessorTurmaDisciplina = {
    id: number;
    disciplina: {
        nome: string;
    };
    professor: {
        nome: string;
    };
    turma: {
        id: number;
        nome: string;
    };
};

type MatriculaDisciplina = {
    id: number;
    matricula: {
        anoLetivo: string;
        aluno: { nome: string };
        turma: { nome: string };
    };
    turmaProfessorDisciplina: {
        professor: { nome: string };
        disciplina: { nome: string };
        turma: { nome: string };
    };
};

/* ================= COMPONENT ================= */

function MatriculaDisciplina() {
    const [matriculas, setMatriculas] = useState<Matricula[]>([]);
    const [professorTurmaDisciplina, setProfessorTurmaDisciplina] =
        useState<ProfessorTurmaDisciplina[]>([]);
    const [matriculaDisciplina, setMatriculaDisciplina] =
        useState<MatriculaDisciplina[]>([]);
    const [form, setForm] = useState({
        matriculaId: '',
        turmaProfessorDisciplinaId: '',
    });
    const [messagem, setMessagem] = useState('');
    const [tipoMensagem, setTipoMensagem] =
        useState<'success' | 'error' | ''>('');

        const fetchData = async () => {
            try {
                const [resMatricula, resPTD, resMD] = await Promise.all([
                    axios.get('http://localhost:3000/matricula'),
                    axios.get('http://localhost:3000/turma-professor-disciplina'),
                    axios.get('http://localhost:3000/matricula-disciplina'),
                ]);

                setMatriculas(resMatricula.data);
                setProfessorTurmaDisciplina(resPTD.data);
                setMatriculaDisciplina(resMD.data);
            } catch (error) {
                console.error(error);
                setMessagem('Erro ao buscar dados iniciais.');
                setTipoMensagem('error');
            }
        };
        
    useEffect(() => {
        fetchData();
    }, []);

    /* ================= CORREÇÃO DO FILTRO ================= */

    const matriculaSelecionada = matriculas.find(
        m => m.id === Number(form.matriculaId)
    );

    const turmaProfessorDisciplinaSelecionada =
        professorTurmaDisciplina.filter(
            ptd =>
                ptd.turma.id === matriculaSelecionada?.turma?.id
        );

    /* ================= HANDLERS ================= */

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.matriculaId || !form.turmaProfessorDisciplinaId) {
            setMessagem('Por favor, selecione todos os campos.');
            setTipoMensagem('error');
            return;
        }

        try {
            await axios.post('http://localhost:3000/matricula-disciplina/', {
                turmaProfessorDisciplinaId: Number(form.turmaProfessorDisciplinaId),
                matriculaId: Number(form.matriculaId),
            });

            setMessagem('Vínculo realizado com sucesso!');
            setTipoMensagem('success');
            setForm({
                turmaProfessorDisciplinaId: '',
                matriculaId: '',
            });
            fetchData();
        } catch {
            setMessagem('Erro ao realizar vínculo.');
            setTipoMensagem('error');
        }
    };

    /* ================= TABELA ================= */

    const columns: TableColumn<MatriculaDisciplina>[] = [
        {
            key: 'aluno',
            header: 'Aluno',
            render: row => row.matricula?.aluno?.nome || '',
        },
        {
            key: 'turma',
            header: 'Turma',
            render: row => row.matricula?.turma?.nome || '',
        },
        {
            key: 'disciplina',
            header: 'Disciplina',
            render: row => row.turmaProfessorDisciplina?.disciplina?.nome || '',
        },
        {
            key: 'professor',
            header: 'Professor',
            render: row => row.turmaProfessorDisciplina?.professor?.nome || '',
        },
    ];

    /* ================= JSX ================= */

    return (
        <div className="main-container">
            <h1 className="matricula-title">Vincular Aluno e Disciplina</h1>

            {messagem && (
                <p className={`feedback-message ${tipoMensagem}`}>
                    {messagem}
                </p>
            )}

            <form onSubmit={handleSubmit}>
                <div className="column">
                    <div className="form-group">
                        <label>Matrícula do Aluno</label>
                        <select
                            name="matriculaId"
                            value={form.matriculaId}
                            onChange={handleChange}
                        >
                            <option value="">Selecione uma matrícula</option>
                            {matriculas.map(m => (
                                <option key={m.id} value={m.id}>
                                    {m.turma?.nome} - {m.aluno?.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Turma / Professor / Disciplina</label>
                        <select
                            name="turmaProfessorDisciplinaId"
                            value={form.turmaProfessorDisciplinaId}
                            onChange={handleChange}
                            disabled={!matriculaSelecionada}
                        >
                            <option value="">Selecione</option>
                            {turmaProfessorDisciplinaSelecionada.map(ptd => (
                                <option key={ptd.id} value={ptd.id}>
                                    {ptd.disciplina.nome} - {ptd.professor.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="save-btn">
                        Vincular
                    </button>
                </div>
            </form>

            <DataTable
                columns={columns}
                data={matriculaDisciplina}
                emptyMessage="Nenhuma matrícula e disciplina cadastrada"
            />
        </div>
    );
}

export default MatriculaDisciplina;
