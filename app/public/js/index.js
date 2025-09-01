document.addEventListener('DOMContentLoaded', function() {
    // Função para obter dados do backend
    function fetchData() {
        Promise.all([
            fetch('/api/receitas').then(response => response.json()),
            fetch('/api/despesas').then(response => response.json())
        ])
        .then(([receitas, despesas]) => {
            const totalReceitas = receitas.reduce((acc, receita) => acc + parseFloat(receita.valor), 0);
            const totalDespesas = despesas.reduce((acc, despesa) => acc + parseFloat(despesa.valor), 0);
            const saldoAtual = totalReceitas - totalDespesas;

            document.getElementById('totalReceitas').innerText = `R$ ${totalReceitas.toFixed(2)}`;
            document.getElementById('totalDespesas').innerText = `R$ ${totalDespesas.toFixed(2)}`;
            document.getElementById('saldoAtual').innerText = `R$ ${saldoAtual.toFixed(2)}`;
        })
        .catch(error => {
            console.error('Erro ao carregar dados:', error);
            document.getElementById('totalReceitas').innerText = 'R$ 0,00';
            document.getElementById('totalDespesas').innerText = 'R$ 0,00';
            document.getElementById('saldoAtual').innerText = 'R$ 0,00';
        });
    }

    // Carregar os dados ao iniciar a página
    fetchData();
})