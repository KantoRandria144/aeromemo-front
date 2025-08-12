import Chart from "chart.js/auto";
import { useEffect, useRef } from "react";

interface PieChartProps {
    labels: string[];
    data: number[];
    colors?: string[];
    legendPosition: "top" | "left" | "bottom" | "right";
}
const PieChart: React.FC<PieChartProps> = ({
    labels,
    data,
    colors = ["#06b6d4", "#f59e0b", "#ef4444", "#8b5cf6"],
    legendPosition = "right",
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null> (null);

    useEffect(() => {
        if(!canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d");
        if(!ctx) return;

        const chartInstance = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels,
                datasets: [
                    {
                        data,
                        backgroundColor: colors,
                        borderWidth: 0,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: legendPosition,
                    },
                },
            },
        });
        return () => {
            chartInstance.destroy();
        };
    }, [labels, data,colors, legendPosition]);
    return <canvas ref={canvasRef} ></canvas>
};

export default PieChart;