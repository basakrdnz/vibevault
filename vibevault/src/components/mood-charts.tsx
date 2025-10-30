'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface MoodDistributionChartProps {
  labels: string[];
  data: number[];
  colors: string[];
}

export function MoodDistributionChart({ labels, data, colors }: MoodDistributionChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Mood Count',
        data,
        backgroundColor: colors.map(color => `${color}80`), // Add transparency
        borderColor: colors,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Your Mood Distribution',
        color: '#ffffff',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#ffffff',
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#ffffff',
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg p-4 h-80">
      <Bar data={chartData} options={options} />
    </div>
  );
}

interface MoodPieChartProps {
  labels: string[];
  data: number[];
  colors: string[];
}

export function MoodPieChart({ labels, data, colors }: MoodPieChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors.map(color => `${color}80`),
        borderColor: colors,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#ffffff',
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Mood Breakdown',
        color: '#ffffff',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg p-4 h-80">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}

interface IntensityTrendChartProps {
  labels: string[];
  data: number[];
}

export function IntensityTrendChart({ labels, data }: IntensityTrendChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Average Intensity',
        data,
        borderColor: '#F87171',
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#F87171',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: 'Intensity Trends Over Time',
        color: '#ffffff',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#ffffff',
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        min: 0,
        max: 10,
        ticks: {
          color: '#ffffff',
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg p-4 h-80">
      <Line data={chartData} options={options} />
    </div>
  );
}
