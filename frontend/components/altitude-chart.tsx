"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  type ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export type AltitudeChartProps = {
  data?: Array<{ time: string; altitude: number }>;
};

export function AltitudeChart({ data }: AltitudeChartProps) {
  // Show placeholder if no data
  if (!data || data.length === 0) {
    return (
      <div className="relative h-48 w-full overflow-hidden rounded-md bg-muted">
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <div className="text-center">
            <div className="mb-2 text-2xl">📊</div>
            <p className="text-sm">График высоты</p>
            <p className="text-xs">Ожидание данных...</p>
          </div>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data.map((item) => item.time),
    datasets: [
      {
        label: "Высота (км)",
        data: data.map((item) => item.altitude),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: { color: "rgba(255, 255, 255, 0.7)" },
      },
      title: {
        display: true,
        text: "Высота МКС",
        color: "rgba(255, 255, 255, 0.9)",
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#ccc",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Высота (км)",
          color: "rgba(255, 255, 255, 0.7)",
        },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { color: "rgba(255, 255, 255, 0.5)" },
      },
      x: {
        title: {
          display: true,
          text: "Время",
          color: "rgba(255, 255, 255, 0.7)",
        },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { color: "rgba(255, 255, 255, 0.5)" },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-md bg-transparent p-2">
      <Line data={chartData} options={options} />
    </div>
  );
}
