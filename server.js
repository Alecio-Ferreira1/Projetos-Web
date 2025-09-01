const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'app')));

const despesasFile = path.join(__dirname, 'app', 'data', 'despesas.json');
const receitasFile = path.join(__dirname, 'app', 'data', 'receitas.json');

// Endpoint para carregar todas as despesas
app.get('/api/despesas', (req, res) => {
    fs.readFile(despesasFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao carregar despesas.' });
        }

        res.json(JSON.parse(data));
    })
})

// Endpoint para adicionar uma nova despesa
app.post('/api/despesas', (req, res) => {
    const novaDespesa = req.body;
    fs.readFile(despesasFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao salvar despesa.' });
        }
        const despesas = JSON.parse(data);
        despesas.push(novaDespesa);
        fs.writeFile(despesasFile, JSON.stringify(despesas, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao salvar despesa.' });
            }
            res.status(201).json({ message: 'Despesa salva com sucesso.' });
        });
    });
});

// Endpoint para remover uma despesa por nome
app.delete('/api/despesas/:nome', (req, res) => {
    const nome = req.params.nome;
    fs.readFile(despesasFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao remover despesa.' });
        }
        let despesas = JSON.parse(data);
        despesas = despesas.filter(despesa => despesa.nome !== nome);
        fs.writeFile(despesasFile, JSON.stringify(despesas, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao remover despesa.' });
            }
            res.status(200).json({ message: 'Despesa removida com sucesso.' });
        })
    })
})

// Endpoint para carregar todas as receitas
app.get('/api/receitas', (req, res) => {
    fs.readFile(receitasFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao carregar receitas.' });
        }
        res.json(JSON.parse(data));
    })
})

// Endpoint para adicionar uma nova receita
app.post('/api/receitas', (req, res) => {
    const novaReceita = req.body;
    
    fs.readFile(receitasFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao salvar receita.' });
        }
        
        const receitas = JSON.parse(data);
        receitas.push(novaReceita);
        
        fs.writeFile(receitasFile, JSON.stringify(receitas, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao salvar receita.' });
            }
            res.status(201).json({ message: 'Receita salva com sucesso.' });
        })
    })
})

// Endpoint para remover uma receita por descrição
app.delete('/api/receitas/:descricao', (req, res) => {
    const descricao = req.params.descricao;

    fs.readFile(receitasFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao remover receita.' });
        }

        let receitas = JSON.parse(data);
        receitas = receitas.filter(receita => receita.descricao !== descricao);

        fs.writeFile(receitasFile, JSON.stringify(receitas, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao remover receita.' });
            }

            res.status(200).json({ message: 'Receita removida com sucesso.' });
        })
    })
})

// Endpoint para carregar todas as receitas
app.get('/api/receitas', (req, res) => {
    fs.readFile('./app/data/receitas.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao carregar receitas.' });
        }
        res.json(JSON.parse(data))
    })
})

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})
