import { chartLabel } from './constants.js';

// Register Chart.js plugins
Chart.register(ChartDataLabels);

// This chart is adapted from the Lichess (https://github.com/lichess-org/lila)
// Original source ui/chart/src/chart.ratingDistribution.ts
// Licensed under the GNU Affero General Public License v3
// Modified for Go/Baduk ratings, 2025-03-12
export function initModule(data) {
    $('#rating_distribution_chart').each(function() {
        const MIN_RATING = Math.min(...data.ratings);    // Get from actual data
        const MAX_RATING = Math.max(...data.ratings);
        const binSize = data.ratings[1] - data.ratings[0];  // Calculate from actual data
        
        const arraySum = (arr) => arr.reduce((a, b) => a + b, 0);
        const sum = arraySum(data.freq);
        const cumul = [];
        const ratings = data.ratings;
        
        // Calculate cumulative distribution
        for (let i = 0; i < data.freq.length; i++) {
            cumul.push(arraySum(data.freq.slice(0, i)) / sum);
        }

        const ctx = this.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(119, 152, 191, 1)');
        gradient.addColorStop(1, 'rgba(119, 152, 191, 0.3)');
        const gridColor = 'rgba(0, 0, 0, 0.1)';
        const hoverBorderColor = '#fff';

        const seriesCommonData = (color) => ({
            pointHoverRadius: 6,
            pointHoverBorderWidth: 2,
            pointHoverBorderColor: hoverBorderColor,
            borderColor: color,
            pointBackgroundColor: color,
        });

        const datasets = [
            {
                ...seriesCommonData('#dddf0d'),
                data: cumul,
                yAxisID: 'y2',
                label: chartLabel.cumulative,
                pointRadius: 0,
                datalabels: { display: false },
                pointHitRadius: 200,
                order: 1 
            },
            {
                ...seriesCommonData('#eeaaee'),
                data: data.freq,
                backgroundColor: gradient,
                yAxisID: 'y',
                fill: true,
                label: chartLabel.players,
                pointRadius: 4,
                datalabels: { display: false },
                pointHitRadius: 200,
                order: 3 
            }
        ];

        // Add rating lines
        const pushLine = (color, rating, label) => {
            datasets.push({
                ...seriesCommonData(color),
                yAxisID: 'y2',
                data: [
                    { x: rating, y: 0 },
                    { x: rating, y: Math.max(...cumul)}
                ],
                segment: {
                    borderDash: [10],
                },
                label: label,
                pointRadius: 4,
                datalabels: {
                    align: 'top',
                    offset: 0,
                    display: 'auto',
                    formatter: (value) => value.y === 0 ? '' : label,
                    color: color,
                },
                order: 2
                // animations: false
            });
        };

        if (data.myRating && data.myRating <= MAX_RATING) {
            pushLine('#55bf3b', data.myRating, `${chartLabel.yourRating} (${data.myRating})`);
        }
        if (data.otherRating && chartLabel.otherPlayer) {
            pushLine('#7798bf', Math.min(data.otherRating, MAX_RATING), `${chartLabel.otherPlayer} (${data.otherRating})`);
        }
        // pushLine('#7798bf', 1500, `Starting score`);
        // pushLine('#7798bf', data.meanRating, `Mean score`);
        const firstNonZeroIndex = data.freq.findIndex(f => f > 0);
        const lastNonZeroIndex = data.freq.length - 1 - [...data.freq].reverse().findIndex(f => f > 0);
        
        const effectiveMinRating = firstNonZeroIndex === -1 ? MIN_RATING : data.ratings[firstNonZeroIndex];
        const effectiveMaxRating = firstNonZeroIndex === -1 ? MAX_RATING : data.ratings[lastNonZeroIndex];

        new Chart(this, {
            type: 'line',
            data: {
                labels: ratings,
                datasets: datasets
            },
            options: {
                normalized: true,
                // animations: {
                //     x: {
                //         type: 'number',
                //         easing: 'easeOutQuad',
                //         duration: 1000 / ratings.length,
                //         from: NaN, // the point is initially skipped
                //         delay(ctx) {
                //             return ctx.mode === 'resize' ? 0 : ctx.dataIndex * (1000 / ratings.length);
                //         }
                //     },
                //     y: {
                //         type: 'number',
                //         easing: 'easeOutQuad',
                //         duration: 1000 / ratings.length,
                //         from(ctx) {
                //             if (!ctx.dataIndex) {
                //                 return ctx.chart.scales.y.getPixelForValue(100);
                //             }
                //             return ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.dataIndex - 1].getProps(['y'], true).y;
                //         },
                //         delay(ctx) {
                //             return ctx.mode === 'resize' ? 0 : ctx.dataIndex * (1000 / ratings.length);
                //         }
                //     }
                // },
                scales: {
                    x: {
                        type: 'linear',
                        min: effectiveMinRating,
                        max: effectiveMaxRating,
                        grid: {
                            color: gridColor,
                        },
                        ticks: {
                            stepSize: 100,
                        },
                        title: {
                            display: true,
                            text: chartLabel.glicko2Rating,
                        }
                    },
                    y: {
                        grid: {
                            color: gridColor,
                            tickLength: 0,
                        },
                        ticks: {
                            padding: 10,
                        },
                        title: {
                            display: true,
                            text: chartLabel.players,
                        }
                    },
                    y2: {
                        position: 'right',
                        grid: {
                            display: false,
                        },
                        ticks: {
                            format: {
                                style: 'percent',
                                maximumFractionDigits: 1,
                            }
                        },
                        title: {
                            display: true,
                            text: chartLabel.cumulative,
                        }
                    }
                },
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        align: 'center',    
                        labels: {
                            boxHeight: 30, 
                            boxWidth: 30,  
                            padding: 10  
                        }
                    },
                    tooltip: {
                        caretPadding: 8,
                        callbacks: {
                            label: item => (item.datasetIndex > 1 ? item.dataset.label : undefined)
                        }
                    }
                }
            }
        });
    });
}