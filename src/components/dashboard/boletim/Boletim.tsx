import "./Boletim.css";
import React from "react";

// Dados Mockup para demonstração, agora com 4 notas
const studentInfo = {
  name: "Maria da Silva",
  class: "9º Ano - Turma B",
  period: "Ano Letivo 2025",
};

const grades = [
  // Quatro notas por disciplina (grade1, grade2, grade3, grade4)
  {
    subject: "Português",
    grade1: 7.5,
    grade2: 8.0,
    grade3: 7.8,
    grade4: 8.5,
    absences: 2,
  },
  {
    subject: "Matemática",
    grade1: 6.0,
    grade2: 2.5,
    grade3: 3.5,
    grade4: 7.2,
    absences: 5,
  },
  {
    subject: "História",
    grade1: 9.0,
    grade2: 8.5,
    grade3: 9.2,
    grade4: 8.8,
    absences: 0,
  },
  {
    subject: "Ciências",
    grade1: 8.5,
    grade2: 7.0,
    grade3: 7.5,
    grade4: 8.0,
    absences: 1,
  },
  {
    subject: "Geografia",
    grade1: 7.0,
    grade2: 7.0,
    grade3: 7.0,
    grade4: 7.0,
    absences: 0,
  },
  {
    subject: "Ed. Física",
    grade1: 9.5,
    grade2: 9.0,
    grade3: 9.5,
    grade4: 9.0,
    absences: 3,
  },
  {
    subject: "Artes",
    grade1: 5.5,
    grade2: 6.0,
    grade3: 5.0,
    grade4: 6.5,
    absences: 1,
  },
];

// Função para calcular a média das 4 notas
const calculateFinalAverage = (n1, n2, n3, n4) => {
  return (n1 + n2 + n3 + n4) / 4;
};

// Determina a situação (Aprovado >= 7, Rec. >= 5)
const getStatus = (average) => {
  if (average >= 7.0) return { text: "Aprovado", className: "status-aprovado" };
  if (average >= 5.0)
    return { text: "Recuperação", className: "status-recuperacao" };
  return { text: "Reprovado", className: "status-reprovado" };
};

function Boletim() {
  return (
    <div className="boletim-container">
      <h1>Boletim Escolar</h1>

      <div className="info-card">
        <p>
          <strong>Aluno:</strong> {studentInfo.name}
        </p>
        <p>
          <strong>Turma:</strong> {studentInfo.class}
        </p>
        <p>
          <strong>Período:</strong> {studentInfo.period}
        </p>
      </div>

      <div className="boletim-card">
        <h2>Notas Finais</h2>
        <div className="table-responsive">
          <table className="grades-table">
            <thead>
              <tr>
                <th>Disciplina</th>
                <th className="nota-col">Nota 1</th>
                <th className="nota-col">Nota 2</th>
                <th className="nota-col">Nota 3</th>
                <th className="nota-col">Nota 4</th>
                <th className="media-col">Média Final</th>
                <th className="faltas-col">Faltas</th>
                <th className="situacao-col">Situação</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((item, index) => {
                const media = calculateFinalAverage(
                  item.grade1,
                  item.grade2,
                  item.grade3,
                  item.grade4
                );
                const status = getStatus(media);

                return (
                  <tr key={index}>
                    <td>{item.subject}</td>
                    <td className="nota-col">{item.grade1.toFixed(1)}</td>
                    <td className="nota-col">{item.grade2.toFixed(1)}</td>
                    <td className="nota-col">{item.grade3.toFixed(1)}</td>
                    <td className="nota-col">{item.grade4.toFixed(1)}</td>
                    <td className="media-col">{media.toFixed(2)}</td>
                    <td className="faltas-col">{item.absences}</td>
                    <td className={`situacao-col ${status.className}`}>
                      {status.text}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Boletim;