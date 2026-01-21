import "./Boletim.css";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

/* ================= REGISTRO CHART ================= */
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

/* ================= DADOS MOCK ================= */

const studentInfo = {
  name: "Maria da Silva",
  class: "9º Ano - Turma B",
  period: "Ano Letivo 2025",
};

const grades = [
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

/* ================= FUNÇÕES AUXILIARES ================= */

const calculateFinalAverage = (n1: number, n2: number, n3: number, n4: number) =>
  (n1 + n2 + n3 + n4) / 4;

const getStatus = (average: number) => {
  if (average >= 7)
    return { text: "Aprovado", className: "status-aprovado" };
  if (average >= 5)
    return { text: "Recuperação", className: "status-recuperacao" };
  return { text: "Reprovado", className: "status-reprovado" };
};

/* ================= ANÁLISE PEDAGÓGICA ================= */

const analyzePerformance = (grades: number[], index: number) => {
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  const current = grades[index];
  const previous = index > 0 ? grades[index - 1] : null;

  if (current >= 8) strengths.push("Nota alta neste bimestre");
  if (current < 5) weaknesses.push("Nota abaixo do esperado");

  if (previous !== null) {
    if (current > previous)
      strengths.push("Evolução em relação ao bimestre anterior");
    else if (current < previous)
      weaknesses.push("Queda em relação ao bimestre anterior");
  }

  return { strengths, weaknesses };
};

/* ================= GRÁFICO ================= */

const chartData = {
  labels: grades.map((g) => g.subject),
  datasets: [
    {
      label: "1º Bimestre",
      data: grades.map((g) => g.grade1),
      backgroundColor: "#4f46e5",
    },
    {
      label: "2º Bimestre",
      data: grades.map((g) => g.grade2),
      backgroundColor: "#06b6d4",
    },
    {
      label: "3º Bimestre",
      data: grades.map((g) => g.grade3),
      backgroundColor: "#22c55e",
    },
    {
      label: "4º Bimestre",
      data: grades.map((g) => g.grade4),
      backgroundColor: "#f59e0b",
    },
  ],
};

const chartOptions = {
  responsive: true,
  indexAxis: "y" as const,
  scales: {
    x: {
      min: 0,
      max: 10,
      title: {
        display: true,
        text: "Notas",
      },
    },
  },
  plugins: {
    legend: {
      position: "bottom" as const,
    },
    tooltip: {
      callbacks: {
        title: (items: any[]) => items[0].label,
        label: (context: any) => {
          const disciplinaIndex = context.dataIndex;
          const bimestreIndex = context.datasetIndex;

          const disciplina = grades[disciplinaIndex];
          const notas = [
            disciplina.grade1,
            disciplina.grade2,
            disciplina.grade3,
            disciplina.grade4,
          ];

          const { strengths, weaknesses } = analyzePerformance(
            notas,
            bimestreIndex
          );

          return [
            `Nota: ${context.raw}`,
            strengths.length ? "✔ Pontos Fortes:" : "",
            ...strengths.map((s) => `• ${s}`),
            weaknesses.length ? "⚠ Pontos Fracos:" : "",
            ...weaknesses.map((w) => `• ${w}`),
          ];
        },
      },
    },
  },
};

/* ================= COMPONENTE ================= */

function Boletim() {
  return (
    <div className="boletim-container">
      <h1>Boletim Escolar</h1>

      <div className="info-card">
        <p><strong>Aluno:</strong> {studentInfo.name}</p>
        <p><strong>Turma:</strong> {studentInfo.class}</p>
        <p><strong>Período:</strong> {studentInfo.period}</p>
      </div>

      <div className="boletim-card">
        <h2>Notas Finais</h2>

        <div className="table-responsive">
          <table className="grades-table">
            <thead>
              <tr>
                <th>Disciplina</th>
                <th>Nota 1</th>
                <th>Nota 2</th>
                <th>Nota 3</th>
                <th>Nota 4</th>
                <th>Média</th>
                <th>Faltas</th>
                <th>Situação</th>
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
                    <td>{item.grade1.toFixed(1)}</td>
                    <td>{item.grade2.toFixed(1)}</td>
                    <td>{item.grade3.toFixed(1)}</td>
                    <td>{item.grade4.toFixed(1)}</td>
                    <td>{media.toFixed(2)}</td>
                    <td>{item.absences}</td>
                    <td className={status.className}>{status.text}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== GRÁFICO ANALÍTICO ===== */}
      <div className="boletim-card">
        <h2>Desempenho por Disciplina e Bimestre</h2>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default Boletim;
