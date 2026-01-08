import { useState, useEffect } from 'react';
import axios from 'axios';
import './Matricula.css';

type Aluno = {
  id: number;
  nome: string;
};

type Turma = {
  id: number;
  nome: string;
};

type MatriculaType = {
  id: number;
  anoLetivo: string;
  aluno?: Aluno;
  turma?: Turma;
};

function Matricula() {
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [matricula, setMatricula] = useState<MatriculaType[]>([]);
    const [form, setForm] = useState({
        anoLetivo: '',
        alunoId: '',
        turmaId: ''
    });

    const [messagem, setMessagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'success' | 'error' | ''>(''); // 'success' ou 'error'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [alunos, turmas, matricula] = await Promise.all([
                    axios.get('http://localhost:3000/aluno'),
                    axios.get('http://localhost:3000/turma'),
                    axios.get("http://localhost:3000/matricula"),
                ]);

                setAlunos(alunos.data);
                setTurmas(turmas.data);
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
            const res = await axios.post('http://localhost:3000/matricula', {
                anoLetivo: form.anoLetivo,
                alunoId: Number(form.alunoId),
                turmaId: Number(form.turmaId),
            });
            setMatricula(prev => [...prev, res.data]);
            setMessagem('Matrícula realizada com sucesso!');
            setTipoMensagem('success');

            setForm({
                anoLetivo: '',
                alunoId: '',
                turmaId: ''
            });
        } catch (error: any) {
            setMessagem('Erro ao realizar matrícula.');
            setTipoMensagem('error');
        }
    };

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
                        <label>Ano Letivo</label>
                        <input
                            type="number"
                            name="anoLetivo"
                            value={form.anoLetivo}
                            onChange={handleChange}
                            placeholder="Ex: 2026"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Aluno</label>
                        <select name="alunoId" value={form.alunoId} onChange={handleChange}>
                            <option value="">Selecione um aluno</option>
                            {alunos.map((aluno) => (
                                <option key={aluno.id} value={aluno.id}>
                                    {aluno.nome}
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

export default Matricula