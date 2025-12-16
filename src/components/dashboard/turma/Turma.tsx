import { useEffect, useState } from 'react';
import axios from 'axios';
import './Turma.css';

interface Turma {
    id: number;
    nome: string;
    turno: string;
}

function Turma() {
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [turmas, setTurmas] = useState<Turma[]>([]);

    const [form, setForm] = useState({
        nome: '',
        turno: '',
    });

    /* ===============================
       BUSCAR TURMAS
    =============================== */
    const carregarTurmas = async () => {
        try {
            const response = await axios.get('http://localhost:3000/turma');
            setTurmas(response.data);
        } catch {
            setError('Erro ao carregar turmas');
        }
    };

    useEffect(() => {
        carregarTurmas();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            await axios.post('http://localhost:3000/turma/registro', form);

            setMessage(`Turma "${form.nome}" cadastrada com sucesso!`);

            setForm({
                nome: '',
                turno: '',
            });

            carregarTurmas();
        } catch (err: any) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Erro ao cadastrar turma');
            }
        }
    };

    return (
        <div className="main-container">
            <h1 className="profile-title">Cadastro de Turmas</h1>

            {error && <p className="error message">{error}</p>}
            {message && <p className="success message">{message}</p>}

            {/* ===== FORMULÁRIO ===== */}
            <form onSubmit={handleSubmit} className="turma-form">
                <div className="profile-fields">

                    <div className="column">
                        <div className="form-group">
                            <label>Nome da Turma</label>
                            <input
                                type="text"
                                name="nome"
                                value={form.nome}
                                onChange={handleChange}
                                placeholder="Ex: 9º Ano"
                            />
                        </div>
                    </div>

                    <div className="column">
                        <div className="form-group">
                            <label>Turno</label>
                            <select
                                name="turno"
                                value={form.turno}
                                onChange={handleChange}
                            >
                                <option value="">Selecione</option>
                                <option value="Manhã">Manhã</option>
                                <option value="Tarde">Tarde</option>
                                <option value="Noite">Noite</option>
                            </select>
                        </div>
                    </div>

                </div>

                <div className="action-buttons">
                    <button type="submit" className="save-btn">
                        Cadastrar
                    </button>
                </div>
            </form>

            {/* ===== LISTAGEM ===== */}
            <div className="turma-list">
                <h2>Turmas Cadastradas</h2>

                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Turno</th>
                        </tr>
                    </thead>
                    <tbody>
                        {turmas.map((turma) => (
                            <tr key={turma.id}>
                                
                                <td>{turma.nome}</td>
                                <td>{turma.turno}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Turma;
