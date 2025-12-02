import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './Graficos.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const vendas = [
    { categoria: 'Eletrônicos', quantidade: 120 },
    { categoria: 'Roupas', quantidade: 90 },
    { categoria: 'Livros', quantidade: 60 },
    { categoria: 'Móveis', quantidade: 30 },
]

const data = {
    labels: vendas.map(venda => venda.categoria),
    datasets: [
        {
            data: vendas.map(venda => venda.quantidade),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1,
        }
    ]
}

function Graficos() {
    return (
        <div className='grafico'>
            <h2>Vendas por Categoria</h2>
            <Pie data={data} />
        </div>
    )
}

export default Graficos;