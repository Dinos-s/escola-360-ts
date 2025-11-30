import React, { useState, useMemo } from "react";
import "./Calendario.css";

// =======================================================
// DADOS MOCKUP (Adicionando o ano para filtragem)
// =======================================================
const ALL_EVENTS = [
  // NOVEMBRO 2025
  {
    date: new Date(2025, 10, 5),
    titulo: "Feira de Ciências",
    descricao: "Apresentação dos projetos do Ensino Médio.",
    tipo: "Entrega",
  },
  {
    date: new Date(2025, 10, 15),
    titulo: "Feriado Nacional",
    descricao: "Proclamação da República.",
    tipo: "Feriado",
  },
  {
    date: new Date(2025, 10, 22),
    titulo: "Entrega de Notas",
    descricao: "Prazo final para entrega de notas do 4º Bimestre.",
    tipo: "Entrega",
  },
  // DEZEMBRO 2025
  {
    date: new Date(2025, 11, 1),
    titulo: "Início da Recuperação",
    descricao: "Início do período de exames finais.",
    tipo: "Avaliação",
  },
  {
    date: new Date(2025, 11, 15),
    titulo: "Recesso Escolar",
    descricao: "Início das férias de verão.",
    tipo: "Recesso",
  },
  // JANEIRO 2026
  {
    date: new Date(2026, 0, 1),
    titulo: "Ano Novo",
    descricao: "Feriado e início do ano fiscal.",
    tipo: "Feriado",
  },
];

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const ANOS = [2024, 2025, 2026, 2027]; // Anos disponíveis para seleção

// =======================================================

// Função auxiliar para gerar dias do mês no Grid
const getDaysInMonth = (year, month) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

// Função auxiliar para obter o dia da semana do primeiro dia do mês (0=domingo)
const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

function Calendario() {
  // Estado inicial: Mês e Ano atuais
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null); // Estado para dia clicado

  // Filtra os eventos para o Mês e Ano selecionados
  const filteredEvents = useMemo(() => {
    return ALL_EVENTS.filter(
      (event) =>
        event.date.getMonth() === currentMonth &&
        event.date.getFullYear() === currentYear
    ).sort((a, b) => a.date - b.date); // Ordena por data
  }, [currentMonth, currentYear]);

  // Filtra eventos para o dia específico, se um dia estiver selecionado
  const dailyEvents = useMemo(() => {
    if (!selectedDay) return [];
    return filteredEvents
      .filter((event) => event.date.getDate() === selectedDay.getDate())
      .sort((a, b) => a.date - b.date);
  }, [filteredEvents, selectedDay]);

  // Gera o array de dias (incluindo preenchimento inicial) para o Grid
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);
  const calendarDays = [...Array(firstDayIndex).fill(null), ...daysInMonth];

  const handleDayClick = (day) => {
    if (day) {
      setSelectedDay(day);
    }
  };

  // Funções de navegação (opcional)
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  return (
    <div className="calendario-container">
      <h1>Calendário Acadêmico</h1>

      {/* 1. SELETORES DE MÊS E ANO */}
      <div className="calendario-selectors">
        <div className="select-group">
          <button onClick={goToPreviousMonth} className="btn-nav">
            {"<"}
          </button>
          <h2 className="current-month-year">
            {MESES[currentMonth]} {currentYear}
          </h2>
          <button onClick={goToNextMonth} className="btn-nav">
            {">"}
          </button>
        </div>

        <div className="select-group">
          <label htmlFor="selectMonth">Mês:</label>
          <select
            id="selectMonth"
            value={currentMonth}
            onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
          >
            {MESES.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="select-group">
          <label htmlFor="selectYear">Ano:</label>
          <select
            id="selectYear"
            value={currentYear}
            onChange={(e) => setCurrentYear(parseInt(e.target.value))}
          >
            {ANOS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. LISTA DE ATIVIDADES FILTRADAS (SELECIONADO ou MÊS COMPLETO) */}
      <div className="calendario-card">
        <h2>
          {selectedDay
            ? `Atividades em ${selectedDay.getDate()}/${
                currentMonth + 1
              }/${currentYear}`
            : `Próximas Atividades em ${MESES[currentMonth]}`}
        </h2>

        <div className="eventos-lista">
          {/* Renderiza eventos do dia, se houver. Senão, mostra todos do mês. */}
          {(selectedDay ? dailyEvents : filteredEvents).length > 0 ? (
            (selectedDay ? dailyEvents : filteredEvents).map(
              (evento, index) => (
                <div key={index} className="evento-item">
                  <div className="evento-data">
                    <strong>{evento.date.getDate()}</strong>
                    <span>
                      {MESES[evento.date.getMonth()]
                        .substring(0, 3)
                        .toUpperCase()}
                    </span>
                  </div>
                  <div className="evento-detalhes">
                    <h3>{evento.titulo}</h3>
                    <p>Tipo: {evento.tipo}</p>
                    <p>{evento.descricao}</p>
                  </div>
                </div>
              )
            )
          ) : (
            <p className="no-events">
              {selectedDay
                ? "Nenhuma atividade neste dia."
                : "Nenhuma atividade planejada para este mês."}
            </p>
          )}
        </div>
      </div>

      {/* 3. CALENDÁRIO VISUAL (GRID) */}
      <div className="calendario-full-card">
        <h2>Visualização Mensal</h2>
        <div className="calendario-grid">
          <div className="dia-semana">DOM</div>
          <div className="dia-semana">SEG</div>
          <div className="dia-semana">TER</div>
          <div className="dia-semana">QUA</div>
          <div className="dia-semana">QUI</div>
          <div className="dia-semana">SEX</div>
          <div className="dia-semana">SÁB</div>

          {calendarDays.map((day, index) => {
            const isEventDay =
              day &&
              filteredEvents.some(
                (event) => event.date.getDate() === day.getDate()
              );
            const isToday = day && day.toDateString() === today.toDateString();
            const isSelected =
              selectedDay &&
              day &&
              day.toDateString() === selectedDay.toDateString();

            return (
              <div
                key={index}
                className={`dia ${day ? "" : "empty"}
                                           ${isEventDay ? "dia-evento" : ""}
                                           ${isToday ? "dia-hoje" : ""}
                                           ${
                                             isSelected ? "dia-selecionado" : ""
                                           }`}
                onClick={() => handleDayClick(day)}
              >
                {day ? day.getDate() : ""}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Calendario;
