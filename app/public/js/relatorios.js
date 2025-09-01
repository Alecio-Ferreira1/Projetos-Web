document.addEventListener('DOMContentLoaded', function() {
    // Função para formatar os dados do gráfico
    function formatData(data) {
        const labels = [];
        const values = [];
        const dataMap = {};

        data.forEach(item => {
            const valor = parseFloat(item.valor);

            // Verifica se a categoria já existe no mapa
            if (dataMap[item.categoria]) {
                dataMap[item.categoria] += valor;
            } else {
                dataMap[item.categoria] = valor;
                labels.push(item.categoria);
            }
        });

        labels.forEach(label => {
            values.push(dataMap[label]);
        });

        return { labels, values };
    }

    // Função para formatar os dados de saldo mensal
    function formatSaldoData(despesasData, receitasData) {
        const saldoMap = {};

        despesasData.forEach(item => {
            const mesAno = item.data.substring(0, 7); // "YYYY-MM"
            const valor = parseFloat(item.valor);

            if (!saldoMap[mesAno]) {
                saldoMap[mesAno] = -valor;
            } else {
                saldoMap[mesAno] -= valor;
            }
        });

        receitasData.forEach(item => {
            const mesAno = item.data.substring(0, 7); // "YYYY-MM"
            const valor = parseFloat(item.valor);

            if (!saldoMap[mesAno]) {
                saldoMap[mesAno] = valor;
            } else {
                saldoMap[mesAno] += valor;
            }
        });

        const labels = Object.keys(saldoMap).sort();
        const values = labels.map(label => saldoMap[label]);

        return { labels, values };
    }

    // Função para buscar e exibir dados de despesas, receitas e saldo mensal
    async function fetchData() {
        try {
            const despesasResponse = await fetch('/api/despesas');
            const despesasData = await despesasResponse.json();

            const receitasResponse = await fetch('/api/receitas');
            const receitasData = await receitasResponse.json();

            const { labels: despesaLabels, values: despesaValues } = formatData(despesasData);
            const { labels: receitaLabels, values: receitaValues } = formatData(receitasData);

            const { labels: saldoLabels, values: saldoValues } = formatSaldoData(despesasData, receitasData);

            // Gráfico de despesas
            new Chart(document.getElementById('graficoDespesas'), {
                type: 'pie',
                data: {
                    labels: despesaLabels,
                    datasets: [{
                        label: 'Despesas',
                        data: despesaValues,
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#E7E9ED', '#C9CBCF'],
                    }],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed && !isNaN(context.parsed)) {
                                        const total = despesaValues.reduce((a, b) => a + b, 0);
                                        const value = context.parsed;
                                        const percentage = total > 0 ? ((value / total) * 100).toFixed(2) : 0;
                                        label += `${value.toFixed(2)} R$ (${percentage}%)`;
                                    }
                                    return label;
                                }
                            }
                        }
                    }
                }
            });

            // Gráfico de receitas
            new Chart(document.getElementById('graficoReceitas'), {
                type: 'pie',
                data: {
                    labels: receitaLabels,
                    datasets: [{
                        label: 'Receitas',
                        data: receitaValues,
                        backgroundColor: ['#4BC0C0', '#FF9F40', '#FFCD56', '#C9CBCF', '#E7E9ED'],
                    }],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed && !isNaN(context.parsed)) {
                                        const total = receitaValues.reduce((a, b) => a + b, 0);
                                        const value = context.parsed;
                                        const percentage = total > 0 ? ((value / total) * 100).toFixed(2) : 0;
                                        label += `${value.toFixed(2)} R$ (${percentage}%)`;
                                    }
                                    return label;
                                }
                            }
                        }
                    }
                }
            });

            // Gráfico de saldo mensal
            new Chart(document.getElementById('graficoSaldoMensal'), {
                type: 'bar',
                data: {
                    labels: saldoLabels,
                    datasets: [{
                    label: 'Saldo Mensal',
                    data: saldoValues,
                    backgroundColor: saldoValues.map(value => value >= 0 ? '#00FF00' : '#FF0000'),
                    }],
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value.toFixed(2) + ' R$';
                                }
                            }
                        }
                    },
                    plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                
                                if (label) {
                                    label += ': ';
                                }
                            
                                if (context.parsed && !isNaN(context.parsed.y)) {
                                    label += `${context.parsed.y.toFixed(2)} R$`;
                                }
                                
                                return label;
                            }
                        }
                    }
                }
            }
        });
        
        } catch (error) {
            console.error('Erro ao buscar os dados:', error);
        }
    }

    fetchData();
});
