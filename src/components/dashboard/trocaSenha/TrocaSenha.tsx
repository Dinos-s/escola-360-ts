import { useState } from "react";
import axios from "axios";

function TrocaSenha() {
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [corfimarSenha, setConfirmarSenha] = useState("");

    // const trocaSenha = async () => {
    //     if (novaSenha !== confirmarSenha) {
    //         alert("As senha não são as mesmas");
    //         return;
    //     }

    //     try {
    //         await axios.patch(
    //             `http://localhost:3000/administrativo/${localStorage.getItem("id")}`,
    //             {
    //             senhaAtual,
    //             novaSenha,
    //             }
    //         );
    //             alert("Senha alterada com sucesso");
    //         } catch (err) {
    //             alert("Erro ao trocar senha");
    //         }
    //     }
    // }

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