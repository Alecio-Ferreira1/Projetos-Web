document.addEventListener('DOMContentLoaded', function() {
    const despesaForm = document.getElementById('despesaForm');
    const listaDespesas = document.getElementById('listaDespesas');
    const campofiltrarData = document.getElementById('filtrarData');

    // Carregar despesas ao iniciar a página
    loadExpenses();

    despesaForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const expenseName = document.getElementById('nomeDespesa').value;
        const expenseAmount = parseFloat(document.getElementById('valorDespesa').value).toFixed(2);
        const expenseDate = document.getElementById('dataDespesa').value;
        const expenseCategory = document.getElementById('categoria').value;
        const paymentMethod = document.getElementById('formaPagamento').value;

        const newRow = document.createElement('tr');

        newRow.innerHTML = `
            <td>${expenseName}</td>
            <td>R$ ${expenseAmount}</td>
            <td>${expenseDate}</td>
            <td>${expenseCategory}</td>
            <td>${paymentMethod}</td>
            <td><button class="remove-btn btn btn-danger btn-sm">Remover</button></td>
        `;

        listaDespesas.appendChild(newRow);
        saveExpenseToBackend({
            nome: expenseName,
            valor: expenseAmount,
            data: expenseDate,
            categoria: expenseCategory,
            formaPagamento: paymentMethod
        });

        despesaForm.reset();
    });

    listaDespesas.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-btn')) {
            const rowToRemove = event.target.closest('tr');
            const expenseName = rowToRemove.children[0].innerText;
            rowToRemove.remove();
            removeExpenseFromBackend(expenseName);
        }
    });

    campofiltrarData.addEventListener('input', function() {
        const filterDate = campofiltrarData.value;
        filterExpensesByDate(filterDate);
    });

    function filterExpensesByDate(filterDate) {
        const rows = listaDespesas.getElementsByTagName('tr');
        Array.from(rows).forEach(row => {
            const expenseDate = row.children[2].innerText;
            if (expenseDate === filterDate || filterDate === '') {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    function saveExpenseToBackend(expense) {
        fetch('/api/despesas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expense)
        }).then(response => response.json())
        .then(data => console.log(data.message))
        .catch(error => console.error('Erro ao salvar despesa:', error));
    }

    function removeExpenseFromBackend(expenseName) {
        fetch(`/api/despesas/${expenseName}`, {
            method: 'DELETE'
        }).then(response => response.json())
        .then(data => console.log(data.message))
        .catch(error => console.error('Erro ao remover despesa:', error));
    }

    function loadExpenses() {
        fetch('/api/despesas')
            .then(response => response.json())
            .then(despesas => {
                despesas.forEach(despesa => {
                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
                        <td>${despesa.nome}</td>
                        <td>R$ ${despesa.valor}</td>
                        <td>${despesa.data}</td>
                        <td>${despesa.categoria}</td>
                        <td>${despesa.formaPagamento}</td>
                        <td><button class="remove-btn btn btn-danger btn-sm">Remover</button></td>
                    `;
                    listaDespesas.appendChild(newRow);
                });
            })
            .catch(error => console.error('Erro ao carregar despesas:', error));
    }
});