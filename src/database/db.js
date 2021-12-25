// Importar a dependência do Sqlite3
const sqlite3 = require("sqlite3").verbose()

// Criar o objeto que fará operações no banco de dados
const db = new sqlite3.Database("src/database/databese.db")

// exportar banco de dados
module.exports = db
