const mysql = require('mysql2'); // importando o mysql
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'armazem'

});
connection.connect((err) => {
    if (err) {
        console.error("Erro ao conectar " + err);
        return;
    }
    console.log("conexão realizada com o mysql com id " + connection.threadId);

});
module.exports = connection;