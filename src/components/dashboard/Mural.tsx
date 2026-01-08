const avisos = [
	{
		id: 1,
		data: "04/10/25",
		hora: "14:30",
		autor: "Coordenação",
		texto: "Prezados(as), amanhã não haverá aula para os 6º anos.",
	},
	{
		id: 2,
		data: "07/10/25",
		hora: "10:00",
		autor: "Professora Laura",
		texto: "Prezados(as), amanhã é o último dia para entrega da atividade de matemática",
	},
];

import "./Mural.css";

function Mural() {
	return (
		<>
			<div className="mural-container">
				<div className="avisos-card">
					<h1>Mural</h1>
					<ul className="avisos-lista">
						<h2>Avisos</h2>
						{avisos.map((aviso) => (
							<li key={aviso.id} className="aviso-item">
								<strong>
									{aviso.data} - {aviso.hora} - {aviso.autor}:
								</strong>{" "}
								{aviso.texto}
							</li>
						))}
					</ul>
				</div>
			</div>
		</>
	);
}

export default Mural;
