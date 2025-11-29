function TrocaSenha() {
    return (
        <div className="main-container">
            <h1 className="change-password-title">Trocar Senha</h1>

            <div className="change-password-form">
                <div className="form-group">
                    <label htmlFor="senhaAtual">Senha Atual</label>
                    <input type="password" placeholder="********" id="senhaAtual" name="senhaAtual" />
                </div>

                <div className="form-group">
                    <label htmlFor="novaSenha">Nova Senha</label>
                    <input type="password" placeholder="********" id="novaSenha" name="novaSenha" />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmarSenha">Confirmar Senha</label>
                    <input type="password" placeholder="********" id="confirmarSenha" name="confirmarSenha" />
                </div>

                <div className="action-buttons">
                    <button className="save-btn">Trocar Senha</button>
                    <button className="cancel-btn">Cancelar</button>
                </div>
            </div>
        </div>
    )
}

export default TrocaSenha