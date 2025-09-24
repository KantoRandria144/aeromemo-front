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
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Heures: ${context.raw}`
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: maxY,
                        ticks: { 
                            stepSize: maxY <= 10 ? 1 : Math.ceil(maxY/10),
                            callback: function(value) {
                                return value + 'h';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Heures'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Mois'
                        }
                    }
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