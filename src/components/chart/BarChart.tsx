import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface BarChartProps {
    labels: string [];
    data: number[];
    maxY: number;
}

const BarChart: React.FC<BarChartProps> = ({ labels, data, maxY = 5}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if(!canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d");
        if(!ctx) return;

        const chartInstance = new Chart(ctx, {
            type: "bar",
            data: {
                labels,
                datasets: [
                    {
                        data,
                        backgroundColor: "#2FAB53",
                        borderRadius: 4,
                        barThickness: 40,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false},
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: maxY,
                        ticks: { stepSize: 1 },
                    },
                },
            },
        });

        return() => {
            chartInstance.destroy();
        };
    }, [labels, data, maxY]);

    return <canvas ref={canvasRef}></canvas>
    
};
 export default BarChart;