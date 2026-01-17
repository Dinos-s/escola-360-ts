import { useState, useEffect } from 'react';
import axios from 'axios';
import './MatriculaDisciplina.css';
import { DataTable, type TableColumn } from '../../tabela/tabela';

// 1. Ajuste das Tipagens para refletir o que você usa na tabela
type Matricula = {
    id: number;
    anoLetivo?: string;
    aluno?: { nome: string };
    turma?: { nome: string };
};

type ProfessorTurmaDisciplina = {
    id: number;
    // Adicione outras propriedades se desejar exibir o nome do professor/disciplina no select
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

function MatriculaDisciplina() {
    const [matriculas, setMatriculas] = useState<Matricula[]>([]);
    const [professorTurmaDisciplina, setProfessorTurmaDisciplina] = useState<ProfessorTurmaDisciplina[]>([]);
    const [matriculaDisciplina, setMatriculaDisciplina] = useState<MatriculaDisciplina[]>([]);
    const [form, setForm] = useState(
        { 
            matriculaId: '', 
            turmaProfessorDisciplinaId: '' 
        }
    );
    const [messagem, setMessagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'success' | 'error' | ''>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resMatricula, resPTD, resMD] = await Promise.all([
                    axios.get('http://localhost:3000/matricula'),
                    axios.get("http://localhost:3000/turma-professor-disciplina"),
                    axios.get("http://localhost:3000/matricula-disciplina"),
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
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            // Nota: Verifique se o endpoint para VINCULAR é realmente /matricula ou /matricula-disciplina
            const res = await axios.post('http://localhost:3000/matricula-disciplina', {
                turmaProfessorDisciplinaId: Number(form.turmaProfessorDisciplinaId),
                matriculaId: Number(form.matriculaId),
            });

            // Atualiza a lista (se o back-end retornar o objeto populado) ou recarrega os dados
            setMessagem('Vínculo realizado com sucesso!');
            setTipoMensagem('success');
            setForm({
                turmaProfessorDisciplinaId: '',
                matriculaId: ''
            });

            // Opcional: Recarregar lista após sucesso para garantir que dados novos (aluno/turma) apareçam
            // fetchData(); 
        } catch (error: any) {
            setMessagem('Erro ao realizar vínculo.');
            setTipoMensagem('error');
        }
    };

    const columns: TableColumn<MatriculaDisciplina>[] = [
    {
        key: 'aluno',
        header: 'Aluno',
        render: (row) => row.matricula?.aluno?.nome || '',
    },
    {
        key: 'turma',
        header: 'Turma',
        render: (row) => row.matricula?.turma?.nome || '',
    },
    {
        key: 'disciplina',
        header: 'Disciplina',
        render: (row) => row.turmaProfessorDisciplina?.disciplina?.nome || '',
    },
    {
        key: 'professor',
        header: 'Professor',
        render: (row) => row.turmaProfessorDisciplina?.professor?.nome || '',
    },
    ];

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
                        <label>Matrícula do Aluno (ID)</label>
                        <select name="matriculaId" value={form.matriculaId} onChange={handleChange}>
                            <option value="">Selecione uma matrícula</option>
                            {matriculas.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.turma?.nome} - {m.aluno?.nome || 'Sem nome'}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Turma / Professor / Disciplina</label>
                        <select name="turmaProfessorDisciplinaId" value={form.turmaProfessorDisciplinaId} onChange={handleChange}>
                            <option value="">Selecione uma turma</option>
                            {professorTurmaDisciplina.map((ptd) => (
                                <option key={ptd.id} value={ptd.id}>
                                    {ptd.disciplina.nome || 'Sem nome'} - {ptd.professor.nome || 'Sem professor'} - {ptd.turma.nome || 'Sem turma'}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="save-btn">Vincular</button>
                </div>
            </form>

            <h2 className="table-title">Matrículas Cadastradas</h2>
            {/* <table className="matricula-table">
                <thead>
                    <tr>
                        <th>Ano Letivo</th>
                        <th>Aluno</th>
                        <th>Turma</th>
                    </tr>
                </thead>
                <tbody>
                    {matriculas.length === 0 ? (
                        <tr>
                            <td colSpan={3} style={{ textAlign: "center" }}>
                                Nenhuma matrícula cadastrada
                            </td>
                        </tr>
                    ) : (
                        matriculaDisciplina.map(m => (
                            <tr key={m.id}>
                                <td>{m.matricula.anoLetivo ? new Date(m.matricula.anoLetivo).getFullYear() : 'N/A'}</td>
                                <td>{m.matricula.aluno?.nome || 'N/A'}</td>
                                <td>{m.matricula.turma?.nome || 'N/A'}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table> */}
            <DataTable
                columns={columns}
                data={matriculaDisciplina}
                emptyMessage="Nenhuma matrícula e disciplina cadastrada"
            />
        </div>
    );
}

export default MatriculaDisciplina;