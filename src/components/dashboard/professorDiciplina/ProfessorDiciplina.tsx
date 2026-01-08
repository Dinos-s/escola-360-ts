import { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfessorDiciplina.css';

import { DataTable, type TableColumn } from '../../tabela/tabela';
 
type Diciplina = {
  id: number;
  nome: string;
};

type Turma = {
  id: number;
  nome: string;
};

type Professor = {
  id: number;
  nome: string;
};

type ProfessorTurmaDisciplina = {
  id: number;
  professor?: Professor;
  disciplina?: Diciplina;
  turma?: Turma;
};

function ProfessorDiciplina() {
    const [diciplinas, setDiciplinas] = useState<Diciplina[]>([]);
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [professores, setProfessores] = useState<Professor[]>([]);
    const [matricula, setMatricula] = useState<ProfessorTurmaDisciplina[]>([]);
    const [form, setForm] = useState({
        professorId: '',
        disciplinaId: '',
        turmaId: ''
    });

    const [messagem, setMessagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'success' | 'error' | ''>(''); // 'success' ou 'error'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [professores, turmas, diciplinas, matricula] = await Promise.all([
                    axios.get('http://localhost:3000/professor'),
                    axios.get('http://localhost:3000/turma'),
                    axios.get('http://localhost:3000/disciplina'),
                    axios.get("http://localhost:3000/turma-professor-disciplina"),
                ]);

                setDiciplinas(diciplinas.data);
                setTurmas(turmas.data);
                setProfessores(professores.data);
                setMatricula(matricula.data);              
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
            const res = await axios.post('http://localhost:3000/turma-professor-disciplina', {
                disciplinaId: Number(form.disciplinaId),
                professorId: Number(form.professorId),
                turmaId: Number(form.turmaId),
            });
            
            setMatricula(prev => [...prev, res.data]);
            setMessagem('Matrícula realizada com sucesso!');
            setTipoMensagem('success');

            setForm({
                professorId: '',
                disciplinaId: '',
                turmaId: ''
            });
        } catch (error: any) {
            setMessagem('Erro ao realizar matrícula.');
            setTipoMensagem('error');
        }
    };

    const columns: TableColumn<ProfessorTurmaDisciplina>[] = [
        {
            key: 'professor', 
            header: 'Professor', 
            render: (row) => row.professor?.nome || '' 
        },
        { 
            key: 'disciplina', 
            header: 'Disciplina', 
            render: (row) => row.disciplina?.nome || '' 
        },
        { 
            key: 'turma', 
            header: 'Turma', 
            render: (row) => row.turma?.nome || '' 
        },
    ];

    return (
        <div className="main-container">
            <h1 className="matricula-title">Matrícula</h1>
            {messagem && (
                <p className={`feedback-message ${tipoMensagem}`}>
                    {messagem}
                </p>
            )}

            <form onSubmit={handleSubmit}>
                <div className="column">
                    <div className="form-group">
                        <label>Professor</label>
                        <select name="professorId" value={form.professorId} onChange={handleChange}>
                            <option value="">Selecione um professor</option>
                            {professores.map((professor) => (
                                <option key={professor.id} value={professor.id}>
                                    {professor.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Disciplina</label>
                        <select name="disciplinaId" value={form.disciplinaId} onChange={handleChange}>
                            <option value="">Selecione uma disciplina</option>
                            {diciplinas.map((disciplina) => (
                                <option key={disciplina.id} value={disciplina.id}>
                                    {disciplina.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Turma</label>
                        <select name="turmaId" value={form.turmaId} onChange={handleChange}>
                            <option value="">Selecione uma turma</option>
                            {turmas.map((turma) => (
                                <option key={turma.id} value={turma.id}>
                                    {turma.nome}
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

            {/* <table className="matricula-table">
                <thead>
                    <tr>
                        <th>Professor</th>
                        <th>Disciplina</th>
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
                                <td>{(matricula.disciplina?.nome)}</td>
                                <td>{matricula.professor?.nome}</td>
                                <td>{matricula.turma?.nome}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table> */}
            <DataTable
                columns={columns}
                data={matricula}
                emptyMessage="Nenhuma matrícula cadastrada"
            />
        </div>
    )
}

export default ProfessorDiciplina