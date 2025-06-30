import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { trainDelayData } from './mockTrainDelay';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TrainDelayChart() {
  const labels = trainDelayData.map((d) => `${d.hour}:00`);
  const data = {
    labels,
    datasets: [
      {
        label: 'Totale vertraging (minuten)',
        data: trainDelayData.map((d) => d.totalDelay),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Totale vertraging per uur',
      },
    },
  };

  return <Bar options={options} data={data} />;
}
