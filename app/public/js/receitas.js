document.addEventListener('DOMContentLoaded', function() {
    const receitaForm = document.getElementById('formReceita');
    const receitaList = document.getElementById('listaReceitas');

    // Função para salvar receita no backend
    function saveReceitaToBackend(receita) {
        fetch('/api/receitas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(receita)
        })
        .then(response => response.json())
        .then(data => console.log(data.message))
        .catch(error => console.error('Erro ao salvar receita:', error));
    }

    // Função para remover receita do backend
    function removeReceitaFromBackend(descricao) {
        fetch(`/api/receitas/${descricao}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => console.log(data.message))
        .catch(error => console.error('Erro ao remover receita:', error));
    }

    // Função para carregar receitas do backend
    function loadReceitas() {
        fetch('/api/receitas')
            .then(response => response.json())
            .then(receitas => {
                receitas.forEach(receita => {
                    addReceitaToList(receita);
                });
            })
            .catch(error => console.error('Erro ao carregar receitas:', error));
    }

    // Adicionar receita ao formulário
    receitaForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const descricao = document.getElementById('descricao').value;
        const valor = document.getElementById('valor').value;
        const dataReceita = document.getElementById('dataReceita').value;
        const categoria = document.getElementById('categoria').value;
        const formaRecebimento = document.getElementById('formaRecebimento').value;

        // Cria um novo item de lista para a receita
        const novaReceita = {
            descricao: descricao,
            valor: parseFloat(valor).toFixed(2),
            data: dataReceita,
            categoria: categoria,
            formaRecebimento: formaRecebimento
        };

        addReceitaToList(novaReceita);
        saveReceitaToBackend(novaReceita);

        receitaForm.reset();
    });

    // Adiciona uma receita à lista no frontend
    function addReceitaToList(receita) {
        const novaReceitaItem = document.createElement('li');
        novaReceitaItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        
        novaReceitaItem.innerHTML = `
            <div>
                <strong style="color: rgb(76, 175, 80);">${receita.descricao}</strong><br>
                <small style="color: rgb(76, 175, 80);">${receita.categoria} | ${receita.formaRecebimento} | ${receita.data}</small>
            </div>
            <span class="badge bg-success rounded-pill">R$ ${parseFloat(receita.valor).toFixed(2)}</span>
            <button class="btn btn-danger btn-sm">Remover</button>
        `;
        
        // Adiciona a funcionalidade de remover receita
        novaReceitaItem.querySelector('button').addEventListener('click', function() {
            removeReceitaFromBackend(receita.descricao);
            receitaList.removeChild(novaReceitaItem);
        });

        // Adiciona a receita à lista
        receitaList.appendChild(novaReceitaItem);
    }

    // Carregar receitas ao iniciar a página
    loadReceitas();
});