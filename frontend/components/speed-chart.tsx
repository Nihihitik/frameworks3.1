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

export type SpeedChartProps = {
  data?: Array<{ time: string; velocity: number }>;
};

export function SpeedChart({ data }: SpeedChartProps) {
  // Show placeholder if no data
  if (!data || data.length === 0) {
    return (
      <div className="relative h-48 w-full overflow-hidden rounded-md bg-muted">
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <div className="text-center">
            <div className="mb-2 text-2xl">📈</div>
            <p className="text-sm">Speed Chart</p>
            <p className="text-xs">No velocity data available</p>
          </div>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data.map((item) => item.time),
    datasets: [
      {
        label: "Velocity (km/h)",
        data: data.map((item) => item.velocity),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
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
      },
      title: {
        display: true,
        text: "ISS Velocity Over Time",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Velocity (km/h)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  return (
    <div className="relative h-48 w-full overflow-hidden rounded-md bg-background p-4">
      <Line data={chartData} options={options} />
    </div>
  );
}
