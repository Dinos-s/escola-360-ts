import { useEffect, useState } from 'react';
import './Perfil.css';
import axios from 'axios';

function Perfil() {
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'success' | 'error' | ''>('');
    const userId = localStorage.getItem('id');
    const token = localStorage.getItem('authToken');
    let tipoUser = localStorage.getItem('tipoUser');

    if (tipoUser === 'coordenador') {
        tipoUser = 'administrativo';
    }

    const [form, setForm] = useState({
        nome: '',
        dataNasc: '',
        cpf: '',
        email: '',
    });

    // função para tornar o padrão de data brasieleiro
    function formatDateToBR(dateString: string | Date): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    useEffect(() => {
        axios.get(`http://localhost:3000/${tipoUser}/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {     
            setForm({
                nome: response.data.nome,
                dataNasc: response.data.dataNasc?.split('T')[0],
                cpf: response.data.cpf,
                email: response.data.email
            });

            // Atualiza nome no localStorage
            if (response.data.nome) {
                localStorage.setItem('userName', response.data.nome);
            }
        })
        .catch(error => {
            console.error('Erro ao buscar perfil:', error);
        });
    }, [tipoUser, userId, token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm, [name]: value
        }));
    };

    const cleanForm = Object.fromEntries(
        Object.entries(form).filter(
            ([_, value]) => value !== '' && value !== null
        )
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        axios.patch(`http://localhost:3000/${tipoUser}/${userId}`, cleanForm, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setMensagem('Perfil atualizado com sucesso!');
            setTipoMensagem('success');
        })
        .catch(error => {
            console.error('Erro ao atualizar perfil:', error);
            setMensagem('Erro ao atualizar perfil!');
            setTipoMensagem('error');
        });
    };
    

    // return (
    //     <div className="main-container">
    //         <h1 className="profile-title">Perfil</h1>

    //         <div className="profile-fields">
    //             <div className="column">
    //                 <div className="form-group">
    //                     <label htmlFor="name">Nome Completo</label>
    //                     <input type="text" placeholder='Digite seu nome completo' id="name" name="name" />
    //                 </div>

    //                 <div className="form-group">
    //                     <label htmlFor="nascimento">Data de Nascimento</label>
    //                     <input type="date" id="nascimento" name="nascimento"/>
    //                 </div>

    //                 <div className="form-group">
    //                     <label htmlFor="cpf">CPF</label>
    //                     <input type="text" placeholder='Digite seu CPF' id="cpf" name="cpf" readOnly/>
    //                 </div>

    //                 <div className="form-group">
    //                     <label htmlFor="email">Email</label>
    //                     <input type="email" placeholder='Digite seu email' id="email" name="email" />
    //                 </div>

    //                 <div className="action-buttons">
    //                     <button className="save-btn">Salvar Alterações</button>
    //                     <button className="cancel-btn">Cancelar</button>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );

    return (
        <div className="main-container">
            <h1 className="profile-title">Perfil</h1>
            {mensagem && (
                    <p className={`feedback-message ${tipoMensagem}`}>
                        {mensagem}
                    </p>
            )}

            <form onSubmit={handleSubmit}>
                <div className="column">
                    <div className="form-group">
                        <label>Nome Completo</label>
                        <input
                            type="text"
                            name="nome"
                            value={form.nome}
                            onChange={handleChange}
                        />
                    </div>

                    {tipoUser !== 'professor' && (
                        <div className="form-group">
                            <label>Data de Nascimento</label>
                            
                            <input
                                type="date"
                                name="dataNasc"
                                value={(form.dataNasc)}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>CPF</label>
                        <input
                            type="text"
                            name="cpf"
                            value={form.cpf}
                            readOnly
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="action-buttons">
                        <button type="submit" className="save-btn">
                            Salvar Alterações
                        </button>

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => window.location.reload()}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );

}

export default Perfil;