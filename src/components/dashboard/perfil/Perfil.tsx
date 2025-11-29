import './Perfil.css';

function Perfil() {
    return (
        <div className="main-container">
            <h1 className="profile-title">Perfil</h1>

            <div className="profile-fields">
                <div className="column">
                    <div className="form-group">
                        <label htmlFor="name">Nome Completo</label>
                        <input type="text" placeholder='Digite seu nome completo' id="name" name="name" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="nascimento">Data de Nascimento</label>
                        <input type="date" id="nascimento" name="nascimento"/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="cpf">CPF</label>
                        <input type="text" placeholder='Digite seu CPF' id="cpf" name="cpf" readOnly/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" placeholder='Digite seu email' id="email" name="email" />
                    </div>

                    <div className="action-buttons">
                        <button className="save-btn">Salvar Alterações</button>
                        <button className="cancel-btn">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Perfil;