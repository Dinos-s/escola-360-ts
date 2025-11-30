import React from "react";
import "./Historico.css";

const historicoData = [
    {
        ano: 2023,
        serie: "8º Ano",
        situacao: "Aprovado",
        mediaGeral: 8.2,
        disciplinas: [
            { nome: "Português", media: 8.5, faltas: 10 },
            { nome: "Matemática", media: 7.8, faltas: 15 },
            { nome: "História", media: 9.0, faltas: 5 },
        ],
    },

    {
        ano: 2024,
        serie: "9º Ano",
        situacao: "Aprovado",
        mediaGeral: 8.5,
        disciplinas: [
            { nome: "Português", media: 8.8, faltas: 8 },
            { nome: "Matemática", media: 8.1, faltas: 12 },
            { nome: "Química", media: 8.6, faltas: 6 },
        ],
    },
];

function Historico() {
    return (
        <div className="historico-container">
            <h1>Histórico Escolar</h1>

            {historicoData.map((anoInfo, index) => (
                <div key={index} className="historico-card">
                    <div className="historico-header">
                        <h2>
                            {anoInfo.serie} ({anoInfo.ano})
                        </h2>
                        <div
                            className={`status-tag status-${anoInfo.situacao.toLowerCase()}`}
                        >
                            Situação: {anoInfo.situacao}
                        </div>
                        <p className="media-geral">
                            Média Geral: <strong>{anoInfo.mediaGeral.toFixed(2)}</strong>
                        </p>
                    </div>

                    <div className="table-responsive">
                        <table className="historico-table">
                            <thead>
                                <tr>
                                    <th>Disciplina</th>
                                    <th>Média Final</th>
                                    <th>Faltas</th>
                                </tr>
                            </thead>
                            <tbody>
                                {anoInfo.disciplinas.map((disc, dIndex) => (
                                    <tr key={dIndex}>
                                        <td>{disc.nome}</td>
                                        <td className="text-center">{disc.media.toFixed(1)}</td>
                                        <td className="text-center">{disc.faltas}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Historico;