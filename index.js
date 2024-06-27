const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const connection = require('./config/db');
const app = express();
const port = 3000;
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, './public')));
//configurando o body-parser de arquivo estatico
app.use(bodyParser.json());
// o bodyParser ira fazer o parsing de dados vindos da URL
app.use(bodyParser.urlencoded({ extended: true }));
// rota para visyakuzar a pagina inicial
app.get('/', (req, res) => {
    const endereco = req.url;
    console.log(endereco);

    res.status(200).render('home');
});
////////////////////////////////////////////
//rota paraa visualizar os produtos
app.get('/produtos', (req, res) => {
    connection.query('SELECT * FROM produtos;', (err, results, fields) => {
        if (err) {
            console.error("erro na consulta " + err);
            //criar uma pagina de erro res.status(500).render("erroConsulta");
            return;
        }
        console.log(results);
        res.status(200).render('produtos', { obj_produtos: results });
    })
});
// app.get('/cadastraMovimentacoes', (req, res) => {
//     connection.query('SELECT * FROM armazens;', (err, results) => {
//         if (err) {
//             console.error("Erro na consulta " + err);
//             return res.status(500).send("Erro ao buscar armazéns");
//         }
//         res.status(200).render('formCadastraMovimentacoes', { obj_armazens: results });
//     });  
// });
//rota de cadastro de produtos
app.get('/cadastraProduto', (req, res) => {
    res.status(200).render('formCadastraProdutos');
});

//inserindo na tabela produtos
app.post('/cad_prod', (req, res) => {
    const { nome, descricao, valor, dataValidade } = req.body;
    const produto = { nome, descricao, valor, dataValidade }
    const query = connection.query('INSERT INTO produtos SET ?', produto, (err, result) => {
        if (err) {
            console.error("Erro ao inserir " + err);
            res.status(500).send("Deu erro")
            //res.status(500).render('erroInsert');
        }
        console.log("Produto com o id:" + result.insertId)
    })
    res.status(200).redirect('/produtos');
});
//exclui produto(delete)
app.delete('/produtos/:id', (req, res) => {
    const produtoCodigo = req.params.id;
    const sql = "DELETE FROM produtos WHERE codigo = ?";

    connection.query(sql, [produtoCodigo], (err, result) => {
        if (err) {
            console.error("Erro ao deletar produto:", err);
            return res.status(500).send("Erro ao deletar produto");
        }

        if (result.affectedRows === 0) {
            return res.status(404).send("Produto não encontrado");
        }

        console.log("Produto excluído com sucesso");
        res.status(200).send("Produto excluído com sucesso");
    });
});

//atualiza produto
app.put('/produtos/:id', (req, res) => {
    const produtoid = req.params.id;
    console.log("Produto com id " + produtoid + " atualizado com sucesso");
    res.redirect('/produtos');
});
////////////////////////////////////////////////////////////////////////////////

//rota de visualizar armazens
app.get('/armazens', (req, res) => {
    connection.query('SELECT * FROM armazens;', (err, results, fields) => {
        if (err) {
            console.error("erro na consulta " + err);
            return;
        }
        console.log(results);
        res.status(200).render('armazens', { obj_armazens: results });
    });
});
//rota do cadastro armazens
app.get('/cadastraArmazem', (req, res) => {
    res.status(200).render('formCadastraArmazens');
});

//insere na tabela armazens
app.post('/cad_arm', (req, res) => {
    const { nome, endereco } = req.body;
    const armazem = { nome, endereco };
    const query = connection.query('INSERT INTO armazens SET ?', armazem, (err, result) => {
        if (err) {
            console.error("Erro ao inserir " + err);
            res.status(500).send("Deu erro")
            //res.status(500).render('erroInsert');
        }
        console.log("Armazem com o id:" + result.insertId)
    });
    res.status(200).redirect('/armazens');
});
//exclui armazem(delete)
app.delete('/armazens/:id', (req, res) => {
    const armazemCodigo = req.params.id;
    const sql = "DELETE FROM armazens WHERE codigo = ?";
    connection.query(sql, [armazemCodigo], (err, result) => {
        if (err) {
            console.error("Erro ao deletar armazem:", err);
            return res.status(500).send("Erro ao deletar armazem");
        }
        if (result.affectedRows === 0) {
            return res.status(404).send("Armazem não encontrado");
        }
        console.log("Armazem excluído com sucesso");
        res.status(200).send("Armazem excluído com sucesso");
    });
});

//atualiza armazem
app.put('/armazens/:id', (req, res) => {
    const armazemid = req.params.id;
    console.log("Armazem com id " + armazemid + " atualizado com sucesso");
    res.redirect('/armazens');
});
///////////////////////////////////////////////////////////

//cadastra armazens 
app.get('/cadastraMovimentacoes', (req, res) => {
    // Primeiro, buscamos os armazéns
    connection.query('SELECT * FROM armazens;', (err, armazens) => {
        if (err) {
            console.error("Erro na consulta " + err);
            return res.status(500).send("Erro ao buscar armazéns");
        }

        // Se a consulta dos armazéns foi bem-sucedida, buscamos os produtos
        connection.query('SELECT * FROM produtos;', (err, produtos) => {
            if (err) {
                console.error("Erro na consulta " + err);
                return res.status(500).send("Erro ao buscar produtos");
            }

            // Se ambas as consultas foram bem-sucedidas, renderizamos a página com ambos os resultados
            res.status(200).render('formCadastraMovimentacoes', { obj_armazens: armazens, obj_produtos: produtos });
        });
    });
});
app.post('/cad_mov', (req, res) => {
    const { responsavel, armazem_codigo, produto_codigo, tipo, quantidade, observacao, data_movimentacao } = req.body;
    const movimentacao = { responsavel, armazem_codigo, produto_codigo, tipo, quantidade, observacao, data_movimentacao };
    const query = connection.query('INSERT INTO movimentacoes SET ?', movimentacao, (err, result) => {
        if (err) {
            console.error("Erro ao inserir " + err);
            res.status(500).send("Deu erro")
            //res.status(500).render('erroInsert');
        }
        console.log("Movimentação  com o id:" + result.insertId)
    });
    res.status(200).redirect('/relatorios');
});
//////////////////////////////////////////////////////////
app.get('/relatorios', (req, res) => {
    const query = `
        SELECT 
            movimentacoes.codigo AS movimentacao_codigo,  
            movimentacoes.responsavel AS movimentacao_responsavel,
            movimentacoes.tipo AS movimentacao_tipo,  
            movimentacoes.quantidade AS movimentacao_quantidade, 
            movimentacoes.observacao AS movimentacao_observacao,
            movimentacoes.data_movimentacao AS movimentacao_dataMovimentacao, 
            produtos.nome AS nome_produto, 
            produtos.valor AS produto_valor,   
            produtos.dataValidade AS produto_dataValidade, 
            armazens.nome AS armazem_nome, 
            armazens.endereco AS armazem_endereco
        FROM  
            movimentacoes 
        INNER JOIN 
            produtos ON movimentacoes.produto_codigo = produtos.codigo 
        INNER JOIN 
            armazens ON movimentacoes.armazem_codigo = armazens.codigo;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Erro na consulta " + err);
            return res.status(500).send("Erro ao gerar relatório");
        }
        res.status(200).render('relatorios', { obj_relatorios: results });
    });
});

app.listen(port, (error) => {
    if (error) {
        console.log("Erro ao rodar servidor");
        return;
    }
    console.log("Servidor rodando");
});