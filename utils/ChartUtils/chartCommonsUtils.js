import Colors from "../colorsUtils.js";

const Commons = {
    line: {
        options: function(stacked = false) {
            let opt = {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        stacked: stacked,
                        beginAtZero: true,
                        grace: '10%'
                    }
                },
                plugins: {
                    legend: { display: true },
                    title: { display: false },
                    datalabels: {
                        anchor: 'end',
                        align: 'end',
                        color: Colors.black(0.6),
                        font: { size: 12 },
                        formatter: (value) => value.toLocaleString()
                    }
                }
            };

            if (stacked){
                opt.plugins.tooltip = { mode: 'index' };
                opt.plugins.interaction = {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }

            return opt;
        }
    },
    bar: {
        options: function(axis = 'x', legend = true) {
            var opt = {
                indexAxis: axis,
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grace: '10%'
                    }
                },
                plugins: {
                    legend: { display: legend },
                    title: { display: false },
                    datalabels: {
                        anchor: 'end',
                        align: 'end',
                        color: Colors.black(0.6),
                        font: { size: 12 },
                        // formatter: (value) => value.toLocaleString()
                    },
                    tooltip: {}
                },
            };

            if (axis == 'x') {
                opt.scales.y = { beginAtZero: true, grace: '10%' };
            } else {
                opt.scales.x = { beginAtZero: true, grace: '10%' };
            }

            return opt;      
        }
    },
    doughnut: {
        options: function() {
            var opt = {
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                        position: 'top',
                    },
                    title: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                return `${value.toFixed(2)}%`;
                            }
                        }
                    },
                    datalabels: {
                        formatter: (value, context) => {
                            return context.chart.data.labels[context.dataIndex]; 
                        },
                        color: Colors.primary(),
                        font: { size: 10 },
                    }
                }
            };

            return opt;
        }
    }
}

export default Commons;