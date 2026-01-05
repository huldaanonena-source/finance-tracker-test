import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Chart = ({ summary }) => {
  const categories = Object.keys(summary.expensesByCategory || {});
  const amounts = Object.values(summary.expensesByCategory || {});

  const data = {
    labels: categories,
    datasets: [
      {
        label: 'Dépenses par catégorie',
        data: amounts,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Répartition des dépenses' }
    }
  };

  return (
    <div className="chart-container" style={{ background: 'white', padding: '20px', borderRadius: '12px' }}>
      {categories.length > 0 ? (
        <Pie data={data} options={options} />
      ) : (
        <p style={{ textAlign: 'center', color: '#666' }}>Ajoutez des dépenses pour voir le graphique</p>
      )}
    </div>
  );
};

export default Chart;