import { useState } from 'react';
import axios from 'axios';
import './TrocaSenha.css';
    
function TrocaSenha() {
    const userId = localStorage.getItem('id');
    const token = localStorage.getItem('authToken');
    let tipoUser = localStorage.getItem('tipoUser');

    if (tipoUser === 'coordenador') {
        tipoUser = 'administrativo';
    }

    const [form, setForm] = useState({
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: '',
    });

    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'success' | 'error' | ''>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (form.novaSenha !== form.confirmarSenha) {
            setMensagem('As senhas não conferem.');
            setTipoMensagem('error');
            return;
        }

        try {
            await axios.patch(
                `http://localhost:3000/${tipoUser}/${userId}/password`,
                {
                    senhaAtual: form.senhaAtual,
                    novaSenha: form.novaSenha,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMensagem('Senha alterada com sucesso!');
            setTipoMensagem('success');
            setForm({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
        } catch (error: any) {
            console.error(error);
            setMensagem(
                error?.response?.data?.message || 'Erro ao alterar a senha.'
            );
            setTipoMensagem('error');
        }
    };

    return (
        <div className="main-container">
            <h1 className="change-password-title">Trocar Senha</h1>
            
            <form className="change-password-form" onSubmit={handleSubmit}>

                {mensagem && (
                    <p className={`feedback-message ${tipoMensagem}`}>
                        {mensagem}
                    </p>
                )}

                <div className="form-group">
                    <label htmlFor="senhaAtual">Senha Atual</label>
                    <input type="password" placeholder="********" id="senhaAtual" name="senhaAtual" value={form.senhaAtual}
                        onChange={handleChange}
                        required />
                </div>

                <div className="form-group">
                    <label htmlFor="novaSenha">Nova Senha</label>
                    <input type="password" placeholder="********" id="novaSenha" name="novaSenha" value={form.novaSenha}
                        onChange={handleChange}
                        required/>
                </div>

                <div className="form-group">
                    <label htmlFor="confirmarSenha">Confirmar Senha</label>
                    <input type="password" placeholder="********" id="confirmarSenha" name="confirmarSenha" value={form.confirmarSenha}
                        onChange={handleChange}
                        required/>
                </div>

                <div className="action-buttons">
                    <button type="submit" className="save-btn">Trocar Senha</button>
                    <button type="button" className="cancel-btn" onClick={() => setForm({ senhaAtual: '', novaSenha: '', confirmarSenha: '' })}
                    >
                        Cancelar</button>
                </div>
            </form>
        </div>
    )
}

export default TrocaSenha