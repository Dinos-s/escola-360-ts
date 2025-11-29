const avisos = [
  {
    id: 1,
    data: '04/10/25',
    autor: 'Coordenação',
    texto: 'Prezados(as), amanhã não haverá aula para os 6º anos.',
  },
  {
    id: 2,
    data: '07/10/25',
    autor: 'Professora Laura',
    texto: 'Prezados(as), amanhã é o último dia para entrega da atividade de matemática',
  },
];

import './Mural.css';

function Mural() {
    return (
        <>
            <div className="mural-container">
                <h1>Mural</h1>
                <div className="avisos-card">
                    <h2>Avisos</h2>
                    <ul className="avisos-lista">
                        {avisos.map((aviso) => (
                            <li key={aviso.id} className="aviso-item">
                                <strong>{aviso.data} - {aviso.autor}:</strong> {aviso.texto}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Mural;