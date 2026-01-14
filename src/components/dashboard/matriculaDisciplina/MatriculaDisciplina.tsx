import { useState, useEffect } from 'react';
import axios from 'axios';
import './MatriculaDisciplina.css';
import type { TableColumn } from '../../tabela/tabela';

type Aluno = {
    id: number;
    nome: string;
};

type Turma = {
    id: number;
    nome: string;
};

type Matricula = {
    id: number;
    anoLetivo: number;
    aluno: Aluno;
    turma: Turma;
};

type Professor = {
    id: number;
    nome: string;
};

type Disciplina = {
    id: number;
    nome: string;
};

type TurmaPTD = {
    id: number;
    nome: string;
    turno: string;
};

type ProfessorTurmaDisciplina = {
    id: number;
    professor: Professor;
    disciplina: Disciplina;
    turma: TurmaPTD;
};

type MatriculaDisciplina = {
  id: number;
  matricula: {
    anoLetivo: number;
    aluno: {
      nome: string;
    };
  };
  professorTurmaDisciplina: {
    professor: {
      nome: string;
    };
    disciplina: {
      nome: string;
    };
    turma: {
      nome: string;
      turno: string;
    };
  };
};



function MatriculaDisciplina() {
    const [matricula, setMatricula] = useState<Matricula[]>([]);
    const [professorTurmaDisciplina, setProfessorTurmaDisciplina] = useState<ProfessorTurmaDisciplina[]>([]);
    const [matriculaDisciplina, setMatriculaDisciplina] = useState<MatriculaDisciplina[]>([]);
    const [form, setForm] = useState({
        matriculaId: '',
        professorTurmaDisciplinaId: ''
    });

    const [messagem, setMessagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'success' | 'error' | ''>(''); // 'success' ou 'error'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [matricula, professorTurmaDisciplina, matriculaDisciplina] = await Promise.all([
                    axios.get('http://localhost:3000/matricula'),
                    axios.get("http://localhost:3000/turma-professor-disciplina"),
                    axios.get("http://localhost:3000/matricula-disciplina"),
                ]);

                setMatricula(matricula.data);
                setProfessorTurmaDisciplina(professorTurmaDisciplina.data);
                setMatriculaDisciplina(matriculaDisciplina.data);
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
        try {
            const res = await axios.post('http://localhost:3000/matricula-disciplina', {
                professorTurmaDisciplinaId: Number(form.professorTurmaDisciplinaId),
                matriculaId: Number(form.matriculaId),
            });
            setMatriculaDisciplina(prev => [...prev, res.data]);
            setMessagem('Matrícula realizada com sucesso!');
            setTipoMensagem('success');

            setForm({
                professorTurmaDisciplinaId: '',
                matriculaId: ''
            });
        } catch (error: any) {
            setMessagem('Erro ao realizar matrícula.');
            setTipoMensagem('error');
        }
    };

    // const columns: TableColumn<MatriculaDisciplina>[] = [
    //     {
    //         key: 'anoLetivo',
    //         header: 'Ano Letivo',
    //         render: (row) => row.matricula.anoLetivo,
    //     },
    //     {
    //         key: 'aluno',
    //         header: 'Aluno',
    //         render: (row) => row.matricula.aluno.nome,
    //     },
    //     {
    //         key: 'disciplina',
    //         header: 'Disciplina',
    //         render: (row) =>
    //             row.professorTurmaDisciplina.disciplina.nome,
    //     },
    //     {
    //         key: 'professor',
    //         header: 'Professor',
    //         render: (row) =>
    //             row.professorTurmaDisciplina.professor.nome,
    //     },
    //     {
    //         key: 'turma',
    //         header: 'Turma',
    //         render: (row) =>
    //             `${row.professorTurmaDisciplina.turma.nome} (${row.professorTurmaDisciplina.turma.turno})`,
    //     },
    // ];


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

                    {/* MATRÍCULA */}
                    <div className="form-group">
                        <label>Matrícula</label>
                        <select
                            name="matriculaId"
                            value={form.matriculaId}
                            onChange={handleChange}
                        >
                            <option value="">Selecione</option>
                            {matricula.map(m => (
                                <option key={m.id} value={m.id}>
                                    {m.aluno.nome} – {m.anoLetivo}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* PROFESSOR / DISCIPLINA / TURMA */}
                    <div className="form-group">
                        <label>Professor / Disciplina / Turma</label>
                        <select
                            name="professorTurmaDisciplinaId"
                            value={form.professorTurmaDisciplinaId}
                            onChange={handleChange}
                        >
                            <option value="">Selecione</option>
                            {professorTurmaDisciplina.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.disciplina.nome} – Prof. {item.professor.nome} –{' '}
                                    {item.turma.nome} ({item.turma.turno})
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="save-btn">Enviar</button>
                </div>
            </form>

            {/* TABELA */}
            {/* <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                    Matrículas Cadastradas
                </h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600">
                                <th className="px-4 py-3 text-center font-medium">
                                    Ano Letivo
                                </th>
                                <th className="px-4 py-3 text-center font-medium">
                                    Aluno
                                </th>
                                <th className="px-4 py-3 text-center font-medium">
                                    Turma
                                </th>
                            </tr>
                        </thead>
                        <tbody className='divide-y'>
                            {matricula.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                                        Nenhuma matrícula cadastrada
                                    </td>
                                </tr>
                            ) : (
                                matricula.map(m => (
                                    <tr
                                        key={m.id}
                                        className="border-b last:border-none hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3">
                                            {new Date(m.anoLetivo).getFullYear()}
                                        </td>
                                        <td className="px-4 py-3">
                                            {m.aluno?.nome}
                                        </td>
                                        <td className="px-4 py-3">
                                            {m.turma?.nome}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div> */}

            <h2 className="table-title">Matrículas Cadastradas</h2>

            <table className="matricula-table">
                <thead>
                    <tr>
                        <th>Ano Letivo</th>
                        <th>Aluno</th>
                        <th>Turma</th>
                    </tr>
                </thead>
                <tbody>
                    {matricula.length === 0 ? (
                        <tr>
                            <td colSpan={3} style={{ textAlign: "center" }}>
                                Nenhuma matrícula cadastrada
                            </td>
                        </tr>
                    ) : (
                        matricula.map(matricula => (
                            <tr key={matricula.id}>
                                <td>{matricula.anoLetivo}</td>
                                <td>{matricula.aluno?.nome}</td>
                                <td>{matricula.turma?.nome}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default MatriculaDisciplina